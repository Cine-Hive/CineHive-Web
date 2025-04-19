//TopMovieDetailView.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// 영화 상세 정보 가져오기
export const fetchMovieDetails = async (movieId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('영화 정보를 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 비슷한 영화 목록 가져오기
export const fetchSimilarMovies = async (movieId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/movies/${movieId}/similar`);
        return response.data;
    } catch (error) {
        console.error('추천 영화를 가져오는 중 오류 발생:', error);
        throw error;
    }
};
