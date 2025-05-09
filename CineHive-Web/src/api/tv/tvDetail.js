// DramaDetailView.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1';


// 애니메이션 상세 정보 가져오기
export const fetchMediaDetails = async (mediaType, mediaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/media/${mediaType}s/${mediaId}`);
        return response.data;
    } catch (error) {
        console.error(`${mediaType} 상세 정보를 가져오는 중 오류 발생:`, error);
        throw error;
    }
};

// 즐겨찾기 개수 가져오기
export const fetchBookmarkCount = async (dramaId) => {
    try {
        const response = await axios.get(`http://localhost:8081/reply/bookmark/count`, {
            params: { movieId: dramaId }
        });
        return response.data;
    } catch (error) {
        console.error('즐겨찾기 개수 가져오는 중 오류 발생:', error);
        return 0;
    }
};

// 즐겨찾기 토글 처리
export const toggleBookmark = async (dramaId, token) => {
    try {
        const response = await fetch(`http://localhost:8081/reply/bookmark/toggle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ movieId: dramaId }),
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error("즐겨찾기 토글 오류:", error);
        throw error;
    }
};
