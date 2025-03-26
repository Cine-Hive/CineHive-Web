//MovieDetail.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// 영화 상세 정보 가져오기
export const fetchMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('영화 상세 정보를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

// 유사 영화 목록 가져오기
export const fetchSimilarMovies = async (movieId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/${movieId}/similar`);
        return response.data;
    } catch (error) {
        console.error('추천 영화를 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 즐겨찾기 토글
export const toggleBookmark = async (movieId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reply/bookmark/toggle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ movieId: movieId }),
        });
        const result = await response.text();
        return result;
    } catch (error) {
        console.error("즐겨찾기 토글 오류:", error);
        throw error;
    }
};


export const fetchBookmarkCount = async (movieId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reply/bookmark/count?movieId=${movieId}`, {
            method: "GET", // GET 요청으로 변경
            headers: {
                "Content-Type": "application/json",
            },
        });
        const count = await response.json();
        return count;
    } catch (error) {
        console.error("즐겨찾기 개수 가져오는 중 오류 발생:", error);
        return 0;
    }
};

