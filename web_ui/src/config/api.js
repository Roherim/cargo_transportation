// API Configuration
export const API_CONFIG = {
    SERVER_IP: 'http://localhost:8000', // Default server IP
    API_BASE_URL: 'http://localhost:8000/api',
    ENDPOINTS: {
        AUTH: '/users/token',
        REFRESH: '/users/token_refresh',
        DELIVERIES: '/deliveries',
        MODELS: '/models',
        SERVICES: '/services',
        PACKAGING: '/packaging'
    }
};

// Initialize server IP in localStorage if not set
if (!localStorage.getItem('server_ip')) {
    localStorage.setItem('server_ip', API_CONFIG.SERVER_IP);
}

export const getServerUrl = () => {
    return localStorage.getItem('server_ip') || API_CONFIG.SERVER_IP;
};

export const getApiUrl = () => {
    const serverUrl = getServerUrl();
    return `${serverUrl}/api`;
}; 