const API_BASE_URL = 'http://localhost:8000';

export const API_CONFIG = {
    BASE_URL: API_BASE_URL,
    ENDPOINTS: {
        AUTH: {
            LOGIN: `${API_BASE_URL}/api/auth/login/`,
            REGISTER: `${API_BASE_URL}/api/auth/register/`,
            LOGOUT: `${API_BASE_URL}/api/auth/logout/`,
            USER_INFO: `${API_BASE_URL}/api/user/`
        },
        OPTIONS: {
            ALL: `${API_BASE_URL}/api/options/`,
            FILTER: `${API_BASE_URL}/api/filter-options/`
        },
        DELIVERY: {
            LIST: `${API_BASE_URL}/api/delivery/list/`,
            NEW: `${API_BASE_URL}/api/delivery/new/`,
            UPDATE: (id) => `${API_BASE_URL}/api/delivery/${id}/update/`,
            DELETE: (id) => `${API_BASE_URL}/api/delivery/${id}/delete/`,
            REPORT: `${API_BASE_URL}/api/delivery/report/`,
            GET: `${API_BASE_URL}/api/delivery/get/`,
            REGISTER: (id) => `${API_BASE_URL}/api/delivery/${id}/register/`,
        },
        EXPORT: {
            DATA: `${API_BASE_URL}/api/export/`
        }
    }
};