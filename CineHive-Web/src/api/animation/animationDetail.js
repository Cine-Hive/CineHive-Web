//AnimationDetailView.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// 애니메이션 상세 정보 가져오기
export const fetchAnimationDetails = async (animationId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/animations/${animationId}`);
        return response.data;
    } catch (error) {
        console.error('애니메이션 상세 정보를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

// 애니메이션 추천 목록 가져오기
export const fetchSimilarAnimations = async (animationId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/animations/${animationId}/similar`);
        return response.data;
    } catch (error) {
        console.error('추천 애니메이션을 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 즐겨찾기 개수 가져오기
export const fetchBookmarkCount = async (animationId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reply/bookmark/count?movieId=${animationId}`);
        const count = await response.json();
        return count;
    } catch (error) {
        console.error('즐겨찾기 개수 가져오는 중 오류 발생:', error);
        return 0;
    }
};

// 즐겨찾기 토글 처리 (애니메이션)
export const toggleBookmark = async (animationId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reply/bookmark/toggle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ movieId: animationId }),
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error("즐겨찾기 토글 오류:", error);
        throw error;
    }
};
