import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // You can also log the error to an error reporting service
        
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                    <div className="text-center p-5 card shadow-sm" style={{ maxWidth: '500px' }}>
                        <h1 className="display-4 text-danger mb-4">Oops!</h1>
                        <h2 className="h4 mb-3">Something went wrong.</h2>
                        <p className="text-muted mb-4">
                            We're sorry for the inconvenience. Please try refreshing the page or come back later.
                        </p>
                        <button
                            className="btn btn-primary px-4 py-2"
                            onClick={() => window.location.reload()}
                        >
                            Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
