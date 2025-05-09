// Функция для получения IP-адреса клиента
export const getClientIP = async () => {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Ошибка при получении IP-адреса:', error);
        return null;
    }
}; 