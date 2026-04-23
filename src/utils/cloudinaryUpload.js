import axios from 'axios';

/**
 * Uploads a file directly to Cloudinary using a signed signature.
 * Best for small files (images).
 */
export const uploadToCloudinary = async (file, signatureData, onProgress) => {
    const { signature, timestamp, apiKey, cloudName, folder } = signatureData;
    
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    const config = {
        onUploadProgress: (progressEvent) => {
            if (onProgress) {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentCompleted);
            }
        },
    };

    try {
        const response = await axios.post(url, formData, config);
        return response.data.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error.response?.data || error.message);
        throw error;
    }
};

/**
 * Uploads a large file to Cloudinary using Signed Chunked Upload.
 * Best for large videos on unstable networks.
 */
export const uploadToCloudinaryChunked = async (file, signatureData, onProgress) => {
    const { signature, timestamp, apiKey, cloudName, folder } = signatureData;
    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks (Cloudinary minimum)
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uniqueUploadId = Math.random().toString(36).substring(2) + Date.now();

    let secureUrl = '';

    for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);

        const formData = new FormData();
        formData.append('file', chunk);
        formData.append('api_key', apiKey);
        formData.append('timestamp', timestamp);
        formData.append('signature', signature);
        formData.append('folder', folder);
        formData.append('resource_type', resourceType);

        // Retry logic for unstable network
        let retries = 3;
        let success = false;
        
        while (retries > 0 && !success) {
            try {
                const response = await axios.post(url, formData, {
                    headers: {
                        'X-Unique-Upload-Id': uniqueUploadId,
                        'Content-Range': `bytes ${start}-${end - 1}/${file.size}`
                    }
                });
                
                if (i === totalChunks - 1) {
                    secureUrl = response.data.secure_url;
                }
                
                success = true;
                if (onProgress) {
                    const percentCompleted = Math.round(((i + 1) * 100) / totalChunks);
                    onProgress(percentCompleted);
                }
            } catch (error) {
                retries--;
                const errMsg = error.response?.data?.error?.message || error.message;
                console.warn(`Chunk ${i} failed (${errMsg}). Retries left: ${retries}`);
                if (retries === 0) {
                    const finalError = new Error(errMsg);
                    finalError.details = error.response?.data;
                    throw finalError;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    }

    return secureUrl;
};
