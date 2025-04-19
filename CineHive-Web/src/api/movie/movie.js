//HomeView.vue

import axios from 'axios';

const API_URL = 'http://localhost:8081';

export const fetchMovies = async () => {
    try {
        const response = await axios.get(`${API_URL}/now_playing`);
        return response.data.slice(0, 18);
    } catch (error) {
        console.error('영화 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

export const fetchTopMovies = async () => {
    try {
        const response = await axios.get(`${API_URL}/get_topmovies`);
        return response.data.slice(0, 18);
    } catch (error) {
        console.error('영화 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

export const fetchUpcomingMovies = async () => {
    try {
        const response = await axios.get(`${API_URL}/get_upcoming_movies`);
        return response.data.slice(0, 18);
    } catch (error) {
        console.error('개봉 예정 영화를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

export const fetchPopularMovies = async () => {
    try {
        const response = await axios.get(`${API_URL}/get_popular_movies`);
        return response.data.slice(0, 18);
    } catch (error) {
        console.error('인기 영화를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

export const fetchPreferredGenres = async (genres) => {
    try {
        const response = await axios.post(`${API_URL}/preferredGenres`, { genres });
        const uniqueMovies = [];
        const movieIds = new Set();

        response.data.forEach(movie => {
            if (!movieIds.has(movie.id)) {
                movieIds.add(movie.id);
                uniqueMovies.push(movie);
            }
        });

        return uniqueMovies.slice(0, 18);
    } catch (error) {
        console.error('선호 장르 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};

export const searchMovies = async (query) => {
    try {
        const response = await axios.post(`${API_URL}/search`, { query });
        return response.data;
    } catch (error) {
        console.error("검색 중 오류가 발생했습니다:", error);
        throw error;
    }
};
