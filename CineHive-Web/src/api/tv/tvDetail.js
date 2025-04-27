// DramaDetailView.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1';

// 드라마 상세 정보 가져오기
export const fetchDramaDetails = async (dramaId, details = false) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/${dramaId}`, {
            params: { details }
        });
        return response.data;
    } catch (error) {
        console.error('드라마 정보를 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 드라마 출연진/제작진 가져오기
export const fetchDramaCredits = async (dramaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/${dramaId}/credits`);
        return response.data;
    } catch (error) {
        console.error('드라마 출연진 정보를 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 드라마 비디오(예고편 등) 가져오기
export const fetchDramaVideos = async (dramaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/${dramaId}/videos`);
        return response.data;
    } catch (error) {
        console.error('드라마 비디오 정보를 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 드라마와 유사한 드라마 목록 가져오기
export const fetchSimilarDramas = async (dramaId, page = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/${dramaId}/similar`, {
            params: { page }
        });
        return response.data;
    } catch (error) {
        console.error('유사 드라마 목록 가져오는 중 오류 발생:', error);
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
