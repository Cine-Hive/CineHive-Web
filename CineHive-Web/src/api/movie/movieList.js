//MovieList.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// 영화 목록 가져오기
export const fetchMovies = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies`);
        return response.data;
    } catch (error) {
        console.error('영화 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};
