import { API_CONFIG } from '../config/api.config';

// Вспомогательные функции
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
};

const getHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };

    if (includeAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            headers['Authorization'] = `Token ${token}`;
        }
    }

    return headers;
};

// API методы
const api = {
    // Аутентификация
    async login(username, password) {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
                method: 'POST',
                headers: getHeaders(false),
                body: JSON.stringify({ username, password }),
                mode: 'cors'
            });
            const responseData = await handleResponse(response);
            if (responseData.token) {
              localStorage.setItem('token', responseData.token);
            }
            return responseData;
        } catch (error) {
            console.error('Login request failed:', error);
            throw new Error(error.message || 'Ошибка авторизации');
        }
    },

    async register(userData) {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
                method: 'POST',
                headers: getHeaders(false),
                body: JSON.stringify(userData),
                mode: 'cors'
            });
            const responseData = await handleResponse(response);
            if (responseData.token) {
              localStorage.setItem('token', responseData.token);
            }
            return responseData;
        } catch (error) {
            console.error('Registration failed:', error);
            throw new Error(error.message || 'Ошибка регистрации');
        }
    },

    async logout() {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
                method: 'POST',
                headers: getHeaders(),
                mode: 'cors'
            });
            const responseData = await handleResponse(response);
            if (responseData.token) {
              localStorage.setItem('token', responseData.token);
            }
            return responseData;
        } catch (error) {
            console.error('Logout failed:', error);
            throw new Error(error.message || 'Ошибка выхода');
        }
    },

    // Опции
    async getOptions() {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.OPTIONS.ALL, {
                headers: getHeaders(),
                mode: 'cors'
            });
            const responseData = await handleResponse(response);
            if (responseData.token) {
              localStorage.setItem('token', responseData.token);
            }
            return responseData;
        } catch (error) {
            console.error('Get options failed:', error);
            throw new Error(error.message || 'Ошибка получения опций');
        }
    },

    async getFilterOptions() {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.OPTIONS.FILTER, {
                headers: getHeaders()
            });
            const responseData = await handleResponse(response);
            if (responseData.token) {
              localStorage.setItem('token', responseData.token);
            }
            return responseData;
        } catch (error) {
            console.error('Get filter options failed:', error);
            throw new Error(error.message || 'Ошибка получения опций фильтрации');
        }
    },

    // Доставки
    async createDelivery(data) {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.DELIVERY.NEW, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            const responseData = await handleResponse(response);
            if (responseData.token) {
              localStorage.setItem('token', responseData.token);
            }
            return responseData;
        } catch (error) {
            console.error('Create delivery failed:', error);
            throw new Error(error.message || 'Ошибка создания доставки');
        }
    },

    async getDeliveries(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await fetch(`${API_CONFIG.ENDPOINTS.DELIVERY.LIST}${queryString ? `?${queryString}` : ''}`, {
                headers: getHeaders(),
                mode: 'cors'
            });
            const responseData = await handleResponse(response);
            if (responseData.token) {
              localStorage.setItem('token', responseData.token);
            }
            return responseData;
        } catch (error) {
            console.error('Get deliveries failed:', error);
            throw new Error(error.message || 'Ошибка получения списка доставок');
        }
    },

    async updateDelivery(id, data) {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.DELIVERY.UPDATE(id), {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data)
            });
            const responseData = await handleResponse(response);
            if (responseData.token) {
              localStorage.setItem('token', responseData.token);
            }
            return responseData;
        } catch (error) {
            console.error('Update delivery failed:', error);
            throw new Error(error.message || 'Ошибка обновления доставки');
        }
    },

    async deleteDelivery(id) {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.DELIVERY.DELETE(id), {
                method: 'DELETE',
                headers: getHeaders(),
                mode: 'cors'
            });
            if (response.status === 204) {
                return { success: true };
            }
            const responseData = await handleResponse(response);
            if (responseData.token) {
              localStorage.setItem('token', responseData.token);
            }
            return responseData;
        } catch (error) {
            console.error('Delete delivery failed:', error);
            throw new Error(error.message || 'Ошибка удаления доставки');
        }
    },
    async getDelivery(id) {
        try {
            const response = await fetch(API_CONFIG.ENDPOINTS.DELIVERY.GET, {
                method: 'POST',  // Изменили на POST
                headers: {
                    ...getHeaders(),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),  // Передаём ID в теле
                mode: 'cors',
            });
            const responseData = await handleResponse(response);
            return responseData;
        } catch (error) {
            console.error('Get delivery failed:', error);
            throw new Error(error.message || 'Ошибка получения доставки');
        }
    },
    // Отчеты
    async getDeliveryReport(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            if (filters.startDate) queryParams.append('start_date', filters.startDate);
            if (filters.endDate) queryParams.append('end_date', filters.endDate);
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.cargoType) queryParams.append('cargo_type', filters.cargoType);

            const response = await fetch(`${API_CONFIG.ENDPOINTS.DELIVERY.REPORT}?${queryParams}`, {
                headers: getHeaders()
            });
            const responseData = await handleResponse(response);
            if (responseData.token) {
              localStorage.setItem('token', responseData.token);
            }
            return responseData;
        } catch (error) {
            console.error('Get delivery report failed:', error);
            throw new Error(error.message || 'Ошибка получения отчета');
        }
    },

    async exportData({ type, startDate, endDate, format }) {
        try {
            const queryParams = new URLSearchParams();
            queryParams.append('type', type);
            queryParams.append('start_date', startDate);
            queryParams.append('end_date', endDate);
            queryParams.append('format', format);

            const response = await fetch(`${API_CONFIG.ENDPOINTS.EXPORT.DATA}?${queryParams}`, {
                headers: getHeaders()
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.detail || 'Ошибка при экспорте данных');
            }

            return response.blob();
        } catch (error) {
            console.error('Export data failed:', error);
            throw new Error(error.message || 'Ошибка экспорта данных');
        }
    }
};

export { api };