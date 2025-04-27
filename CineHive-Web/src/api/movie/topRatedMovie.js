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

export const fetchMovieVideo = async (movieId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/movies/${movieId}/videos`);
        console.log('비디오 응답:', response.data);  // 응답 데이터 구조 확인

        // response.data가 배열일 경우 첫 번째 비디오 반환
        if (response.data && response.data.length > 0) {
            return response.data[0];  // 첫 번째 트레일러 영상만 반환
        } else {
            return null;  // 비디오가 없을 경우 null 반환
        }

    } catch (error) {
        console.error("비디오 정보를 가져오는 중 오류가 발생했습니다:", error);
        throw error;
    }
};

// 출연진 및 제작진 정보 가져오기
export const fetchMovieCredits = async (movieId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/movies/${movieId}/credits`);
        return response.data;
    } catch (error) {
        console.error('출연/제작진 정보를 가져오는 중 오류 발생:', error);
        throw error;
    }
};


