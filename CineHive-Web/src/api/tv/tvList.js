import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1';

// 드라마 목록 가져오기
export const fetchDramasSearch = async (query, page = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/search`, {
            params: {
                query,
                page
            }
        });
        return response.data;
    } catch (error) {
        console.error('드라마 목록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};
