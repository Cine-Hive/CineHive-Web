// DramaDetail.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// 드라마 상세 정보 가져오기
export const fetchDramaDetails = async (dramaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dramas/${dramaId}`);
        return response.data;
    } catch (error) {
        console.error('드라마 정보를 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 즐겨찾기 개수 가져오기
export const fetchBookmarkCount = async (dramaId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reply/bookmark/count?movieId=${dramaId}`);
        const count = await response.json();
        return count;
    } catch (error) {
        console.error('즐겨찾기 개수 가져오는 중 오류 발생:', error);
        return 0;
    }
};

// 즐겨찾기 토글 처리
export const toggleBookmark = async (dramaId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reply/bookmark/toggle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ movieId: dramaId }), // movieId를 객체 형태로 보내기
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error("즐겨찾기 토글 오류:", error);
        throw error;
    }
};