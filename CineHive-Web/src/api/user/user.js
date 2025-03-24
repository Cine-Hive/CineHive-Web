// AuthView.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

export const checkDuplicatesEmail = async (email) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/checkemail/${email}`);
        return response.data;
    } catch (error) {
        console.error('이메일 중복 확인 실패:', error.response?.data || error.message);
        return false;
    }
};

export const checkDuplicatesNickname = async (nickname) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/checknickname/${nickname}`);
        return response.data;
    } catch (error) {
        console.error('닉네임 중복 확인 실패:', error.response?.data || error.message);
        return false;
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/register`, userData);
        return response;
    } catch (error) {
        throw error.response ? error.response.data : '회원가입 오류';
    }
};

export const loginUser = async (loginData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/login`, loginData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data.message || '로그인 오류' : '로그인 오류';
    }
};
