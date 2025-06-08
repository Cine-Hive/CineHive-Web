// api/mypage.js

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

//MyPage.vue
export const fetchUserProfile = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/myInfo/info`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;

    } catch (error) {
        console.error('API - 사용자 정보 가져오기 실패:', error.response?.data?.message || error.response?.data || error.message);
        throw error.response?.data?.message || error.response?.data || error.message || '사용자 정보 조회 오류';
    }
};

//UserSexChange.vue
export const changeUserSex = async (token, newSex) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/myInfo/change-memsex`,
            { newMemSex: newSex },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data;

    } catch (error) {
        console.error('API - 성별 변경 실패:', error.response?.data?.message || error.response?.data || error.message);
        throw error.response?.data?.message || error.response?.data || error.message || '성별 변경 오류';
    }
};

//UserPwChange.vue
export const changeUserPassword = async (token, oldPassword, newPassword) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/myInfo/change-password`, {
            oldPassword: oldPassword,
            newPassword: newPassword,
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;

    } catch (error) {
        console.error('API - 비밀번호 변경 실패:', error.response?.data?.message || error.response?.data || error.message);
        throw error.response?.data?.message || error.response?.data || error.message || '비밀번호 변경 오류';
    }
};

//UserNickname.vue
export const changeUserNickname = async (token, newNickname) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/myInfo/change-nickname`,
            { newNickname: newNickname },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data;

    } catch (error) {
        console.error('API - 닉네임 변경 실패:', error.response?.data?.message || error.response?.data || error.message);
        throw error.response?.data?.message || error.response?.data || error.message || '닉네임 변경 오류';
    }
};

//UserNameChange.vue
export const changeUserName = async (token, newName) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/myInfo/change-memname`,
            { newMemName: newName },
            { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data;

    } catch (error) {
        console.error('API - 이름 변경 실패:', error.response?.data?.message || error.response?.data || error.message);
        throw error.response?.data?.message || error.response?.data || error.message || '이름 변경 오류';
    }
};

//UserDeleteAccount.vue
export const deleteAccount = async (token) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/myInfo/delete-account`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;

    } catch (error) {
        console.error('API - 회원 탈퇴 실패:', error.response?.data?.message || error.response?.data || error.message);
        throw error.response?.data?.message || error.response?.data || error.message || '회원 탈퇴 오류';
    }
};