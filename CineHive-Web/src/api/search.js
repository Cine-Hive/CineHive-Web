//SearchView.vue

import axios from 'axios';

// API_BASE_URL은 그대로 둬도 될 듯!
const API_BASE_URL = 'http://localhost:8081';

export async function fetchSearchResults(query) {
    try {
        // POST 대신 GET으로 변경하고, URL이랑 파라미터 넘기는 방식 바꿈
        const response = await axios.get(`${API_BASE_URL}/api/v1/media/search`, {
            params: { query: query } // query라는 이름으로 검색어 넘겨주기
        });
        console.log("서버 응답 데이터:", response.data);
        return response.data;
    } catch (error) {
        console.error("검색 결과 오류:", error);
        // 에러 처리 로직은 그대로 유지
        throw error;
    }
}