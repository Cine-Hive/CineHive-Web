import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1';

// 영화 목록 가져오기 (검색어와 페이지를 파라미터로 넘기게 수정)
export const fetchMoviesSearch = async (query, page = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/search`, {
            params: {
                query: query,
                page: page
            }
        });
        return response.data;
    } catch (error) {
        console.error('영화 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};
