import axios from 'axios';
import router from "@/router/router";
import store from "@/store/store";

const API_BASE_URL = 'http://localhost:8081';

const handleLogout = () => {
    alert('로그아웃 되었습니다. 다시 로그인해 주세요.');
    store.commit('SET_LOGOUT');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginType');
    router.push('/auth');
};

// 게시글 상세 조회
export const fetchBoardDetail = (boardId) => {
    return axios.get(`${API_BASE_URL}/boards/${boardId}`);
};

// 댓글 조회
export const fetchComments = (boardId) => {
    return axios.get(`${API_BASE_URL}/comment/${boardId}/board/all`);
};

// 댓글 추가
export const addComment = async (boardId, content, token) => {
    try {
        return await axios.post(`${API_BASE_URL}/comment/${boardId}`, { content }, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 403) {
            handleLogout();
        } else {
            console.error('댓글 추가 중 오류 발생:', error);
            throw error;
        }
    }
};

// 댓글 삭제
export const deleteComment = async (boardId, commentId, token) => {
    try {
        return await axios.delete(`${API_BASE_URL}/comment/${boardId}/board/${commentId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 403) {
            handleLogout();
        } else {
            console.error('댓글 삭제 중 오류 발생:', error);
            throw error;
        }
    }
};

// 카운트 조회 (북마크, 좋아요, 싫어요)
export const fetchCounts = (boardId) => {
    return Promise.all([
        axios.get(`${API_BASE_URL}/bookmark/${boardId}/count`),
        axios.get(`${API_BASE_URL}/like/${boardId}/count`),
        axios.get(`${API_BASE_URL}/dislike/${boardId}/count`),
    ]);
};

// 북마크 토글
export const toggleBookmark = async (boardId, token) => {
    try {
        return await axios.post(`${API_BASE_URL}/bookmark/${boardId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 403) {
            handleLogout();
        } else {
            console.error('북마크 토글 중 오류 발생:', error);
            throw error;
        }
    }
};

// 좋아요 토글
export const toggleLike = async (boardId, token) => {
    try {
        return await axios.post(`${API_BASE_URL}/like/${boardId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 403) {
            handleLogout();
        } else {
            console.error('좋아요 토글 중 오류 발생:', error);
            throw error;
        }
    }
};

// 싫어요 토글
export const toggleDisLike = async (boardId, token) => {
    try {
        return await axios.post(`${API_BASE_URL}/dislike/${boardId}`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 403) {
            handleLogout();
        } else {
            console.error('싫어요 토글 중 오류 발생:', error);
            throw error;
        }
    }
};

// 게시글 삭제
export const deleteBoard = async (boardId, token) => {
    try {
        return await axios.delete(`${API_BASE_URL}/boards/${boardId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
    } catch (error) {
        if (error.response && error.response.status === 403) {
            handleLogout();
        } else {
            console.error('게시글 삭제 중 오류 발생:', error);
            throw error;
        }
    }
};
