//CreateBoardView.vue

import axios from 'axios';
import store from '@/store'; // Vuex store import
import router from '@/router/router'; // router import
const API_BASE_URL = 'http://localhost:8081';


// 게시글 등록 요청 함수
export const createBoardPost = async (brdTitle, brdContent, token) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/boards`, {
            brdTitle,
            brdContent,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 403) {
            alert('로그아웃 되었습니다. 다시 로그인해 주세요.');
            store.commit('SET_LOGOUT');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginType');
            router.push('/auth');
        } else {
            console.error('게시물 등록에 실패했습니다.', error);
            throw error;
        }
    }
};