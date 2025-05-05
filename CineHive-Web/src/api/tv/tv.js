// api/tv.js

import axios from 'axios';

const BASE_URL = 'http://localhost:8081/api/v1/media/tvs';

/**
 * 인기 있는 TV 시리즈 가져오기
 */
export const fetchPopularTvSeries = async () => {
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
        console.error('인기 TV 시리즈 목록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};

/**
 * 평점 높은 TV 시리즈 가져오기
 */
export const fetchTopRatedTvSeries = async () => {
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
        console.error('평점 높은 TV 시리즈 목록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};

/**
 * 방영 중인 TV 시리즈 가져오기
 */
export const fetchOnTheAirTvSeries = async () => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                category: 'on_the_air',
                page: 1,
                size: 18
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('방영 중인 TV 시리즈 목록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};

/**
 * 오늘 방영하는 TV 시리즈 목록 가져오기
 */
export const fetchAiringTodayTvSeries = async () => {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                category: 'airing_today',
                page: 1,
                size: 18
            }
        });
        return response.data.results;
    } catch (error) {
        console.error('오늘 방영하는 TV 시리즈 목록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};
