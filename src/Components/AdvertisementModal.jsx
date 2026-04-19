import { useActiveAds } from '../hooks/useAds';

const AdvertisementModal = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [ads, setAds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const { data: activeAds, isLoading } = useActiveAds();

    // Shuffle array function
    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    useEffect(() => {
        if (activeAds && activeAds.length > 0) {
            const shuffledAds = activeAds.length > 1 ? shuffleArray([...activeAds]) : activeAds;
            setAds(shuffledAds);
            setIsVisible(true);
        }
    }, [activeAds]);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible || ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-300">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl transform transition-all duration-300 scale-100 overflow-hidden">

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-gray-100 transition-colors z-10 text-gray-600 hover:text-red-500 shadow-sm"
                >
                    <FaTimes size={24} />
                </button>

                {/* Ad Content */}
                <div className="flex flex-col">
                    {/* Image Container */}
                    <div className="w-full h-auto max-h-[70vh] bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                            src={currentAd.adImage.startsWith('http') ? currentAd.adImage : `${backendUrl}/${currentAd.adImage.replace(/\\/g, '/')}`}
                            alt={currentAd.title}
                            className="w-full h-full object-contain"
                        />
                    </div>

                    {/* Footer / Title */}
                    <div className="p-4 bg-white border-t border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                            {currentAd.title}
                        </h3>
                        <span className="text-[10px] text-gray-400 ml-2">v10</span>
                        <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                            Sponsored
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdvertisementModal;
