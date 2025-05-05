// api/animations.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/v1/media/animations';

/**
 * 현재 상영 중인 애니메이션 가져오기
 */
export const fetchAnimations = async () => {
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
        console.error('상영 중 애니메이션 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

/**
 * 최고 평점 애니메이션 가져오기
 */
export const fetchTopAnimations = async () => {
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
        console.error('최고 평점 애니메이션 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

/**
 * 개봉 예정 애니메이션 가져오기
 */
export const fetchUpcomingAnimations = async () => {
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
        console.error('개봉 예정 애니메이션 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

/**
 * 인기 애니메이션 가져오기
 */
export const fetchPopularAnimations = async () => {
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
        console.error('인기 애니메이션 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};
