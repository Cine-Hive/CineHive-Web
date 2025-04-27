// HomeView.vue
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/v1';


// 인기 있는 TV 시리즈 가져오기
export const fetchPopularTvSeries = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/popular`);
        return response.data.results.slice(0, 18);
    } catch (error) {
        console.error('인기 TV 시리즈 목록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 평점 높은 TV 시리즈 가져오기
export const fetchTopRatedTvSeries = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/top-rated`);
        return response.data.results.slice(0, 18);
    } catch (error) {
        console.error('평점 높은 TV 시리즈 목록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};

// 방영 중인 TV 시리즈 가져오기
export const fetchOnTheAirTvSeries = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/tv/on-the-air`);
        return response.data.results.slice(0, 18);
    } catch (error) {
        console.error('방영 중인 TV 시리즈 목록을 가져오는 중 오류 발생:', error);
        throw error;
    }
};
