// api/media.js

import axios from 'axios';

// 정확한 컨트롤러 경로로 수정
const BASE_URL = 'http://localhost:8081/api/v1/media/movies';

/**
 * 현재 상영 중인 영화 가져오기
 */
export const fetchMovies = async () => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                category: 'now_playing',
                page: 1,
                size: 18
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('상영 중 영화 데이터를 가져오는 중 오류:', error);
        throw error;
    }
};

/**
 * 최고 평점 영화 가져오기
 */
export const fetchTopMovies = async () => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                category: 'top_rated',
                page: 1,
                size: 18
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('최고 평점 영화 데이터를 가져오는 중 오류:', error);
        throw error;
    }
};

/**
 * 개봉 예정 영화 가져오기
 */
export const fetchUpcomingMovies = async () => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                category: 'upcoming',
                page: 1,
                size: 18
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('개봉 예정 영화를 가져오는 중 오류:', error);
        throw error;
    }
};

/**
 * 인기 영화 가져오기
 */
export const fetchPopularMovies = async () => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                category: 'popular',
                page: 1,
                size: 18
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('인기 영화 데이터를 가져오는 중 오류:', error);
        throw error;
    }
};
