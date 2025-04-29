// DramaDetailView.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1';


// TV 출연/제작진 정보 가져오기
export const fetchDramaCredits = async (dramaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/${dramaId}/credits`);
        return response.data;
    } catch (error) {
        console.error('출연/제작진 정보 가져오는 중 오류 발생:', error);
        throw error;
    }
};


// TV 상세 정보 가져오기 (출연, 제작진, 줄거리 등)
export const fetchDramaDetails = async (dramaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/${dramaId}`);
        return response.data;
    } catch (error) {
        console.error('드라마 상세 정보 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// TV 비디오 정보 가져오기 (트레일러 등)
export const fetchDramaVideos = async (dramaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/${dramaId}/videos`);
        return response.data;
    } catch (error) {
        console.error('비디오 정보 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 유사 TV 시리즈 목록 가져오기
export const fetchSimilarTvSeries = async (dramaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/${dramaId}/similar`);
        return response.data;
    } catch (error) {
        console.error('유사 TV 시리즈 목록 가져오는 중 오류 발생:', error);
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
