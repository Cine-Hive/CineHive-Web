import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/ott'; // 백엔드 서버 주소

export const fetchOttMovies = async (providerId) => {
    try {
        const response = await axios.get(`${BASE_URL}/${providerId}`);
        return response.data; // 영화 목록 반환
    } catch (error) {
        console.error(`OTT(${providerId}) 데이터를 불러오는 중 오류 발생:`, error);
        return [];
    }
};