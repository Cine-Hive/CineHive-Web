    //HomeView.vue

    import axios from 'axios';

    const API_URL = 'http://localhost:8081/api/v1/movies';

    export const fetchMovies = async () => {
        try {
            const response = await axios.get(`${API_URL}/now-playing`);
            return response.data.results.slice(0, 18);
        } catch (error) {
            console.error('영화 데이터를 가져오는 중 오류가 발생했습니다:', error);
            throw error;
        }
    };

    export const fetchTopMovies = async () => {
        try {
            const response = await axios.get(`${API_URL}/top-rated`);
            return response.data.results.slice(0, 18);
        } catch (error) {
            console.error('영화 데이터를 가져오는 중 오류가 발생했습니다:', error);
            throw error;
        }
    };

    export const fetchUpcomingMovies = async () => {
        try {
            const response = await axios.get(`${API_URL}/upcoming`);
            return response.data.results.slice(0, 18);
        } catch (error) {
            console.error('개봉 예정 영화를 가져오는 중 오류가 발생했습니다:', error);
            throw error;
        }
    };

    export const fetchPopularMovies = async () => {
        try {
            const response = await axios.get(`${API_URL}/popular`);
            return response.data.results.slice(0, 18);
        } catch (error) {
            console.error('인기 영화를 가져오는 중 오류가 발생했습니다:', error);
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

