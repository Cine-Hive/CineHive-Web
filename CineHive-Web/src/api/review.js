//ReviewView.vue

import axios from "axios";

const API_BASE_URL = "http://localhost:8081/reply";

export const fetchReviews = async (movieId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movie/${movieId}`);
        return response.data;
    } catch (error) {
        console.error("감상평을 불러오는 중 오류 발생:", error);
        throw error;
    }
};

export const toggleLike = async (replyId, movieId, token) => {
    try {
        await axios.post(`${API_BASE_URL}/judge/like`, null, {
            params: { movieId, replyId },
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("좋아요 처리 중 오류 발생:", error);
        throw error;
    }
};

export const toggleDislike = async (replyId, movieId, token) => {
    try {
        await axios.post(`${API_BASE_URL}/judge/dislike`, null, {
            params: { movieId, replyId },
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("싫어요 처리 중 오류 발생:", error);
        throw error;
    }
};

export const fetchLikeCount = async (replyId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/judge/count/like`, {
            params: { replyId },
        });
        return response.data;
    } catch (error) {
        console.error("좋아요 개수 불러오기 실패:", error);
        throw error;
    }
};

export const fetchDislikeCount = async (replyId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/judge/count/dislike`, {
            params: { replyId },
        });
        return response.data;
    } catch (error) {
        console.error("싫어요 개수 불러오기 실패:", error);
        throw error;
    }
};

export const submitReview = async (movieId, nickname, text, token) => {
    try {
        await axios.post(API_BASE_URL, null, {
            params: { memNickname: nickname, movieId, content: text },
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("감상평 등록 중 오류 발생:", error);
        throw error;
    }
};

export const deleteReview = async (movieId, replyId, token) => {
    try {
        await axios.delete(`${API_BASE_URL}/${movieId}/${replyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
    } catch (error) {
        console.error("감상평 삭제 중 오류 발생:", error);
        throw error;
    }
};
