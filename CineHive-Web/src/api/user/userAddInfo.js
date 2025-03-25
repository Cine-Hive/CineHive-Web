// SoicalLoginAdditionalInfo.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api/auth';


export async function getUserInfo(loginType) {
    try {
        const response = await axios.get(`${API_BASE_URL}/${loginType}/success`, {
            withCredentials: true
        });
        console.log("사용자 정보 가져오기 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
        throw error;
    }
}

export async function registerUser(loginType, userData) {
    try {
        const response = await axios.post(`${API_BASE_URL}/${loginType}/register`, userData);
        console.log("회원가입 성공:", response.data);
        return response.data;
    } catch (error) {
        console.error("회원가입 실패:", error);
        throw error;
    }
}

// AuthView.vue


