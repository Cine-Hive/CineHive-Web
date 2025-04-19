//SerachView.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

export async function fetchSearchResults(query) {
    try {
        const response = await axios.post(`${API_BASE_URL}/search`, { query });
        console.log("서버 응답 데이터:", response.data);
        return response.data;
    } catch (error) {
        console.error("검색 결과 오류:", error);
        throw error;
    }
}
