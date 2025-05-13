//BoardEditView.vue
import axios from 'axios';
import store from '@/store/store'
import router from '@/router/router'

const API_BASE_URL = 'http://localhost:8081';

// 게시글 상세 조회 요청 함수
export const fetchBoardDetail = async (boardId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/boards/${boardId}`);
        return response.data;
    } catch (error) {
        console.error('게시글 조회에 실패했습니다:', error);
        throw error;
    }
};

export const updateBoardPost = async (boardId, memEmail, brdTitle, brdContent, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/boards/${boardId}`,
            { memEmail, brdTitle, brdContent },
            { headers: { Authorization: `Bearer ${token}` } }
        );
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
            console.error('게시물 수정에 실패했습니다.', error);
            throw error;
        }
    }
};