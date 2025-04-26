//BoardDetailView.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// 게시글 상세 조회
export const fetchBoardDetail = (boardId) => {
    return axios.get(`${API_BASE_URL}/boards/${boardId}`);
};

// 댓글 조회
export const fetchComments = (boardId) => {
    return axios.get(`${API_BASE_URL}/comment/${boardId}/board/all`);
};

// 댓글 추가
export const addComment = (boardId, content, token) => {
    return axios.post(`${API_BASE_URL}/comment/${boardId}`, { content }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// 댓글 삭제
export const deleteComment = (boardId, commentId, token) => {
    return axios.delete(`${API_BASE_URL}/comment/${boardId}/board/${commentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
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
export const toggleBookmark = (boardId, token) => {
    return axios.post(`${API_BASE_URL}/bookmark/${boardId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// 좋아요 토글
export const toggleLike = (boardId, token) => {
    return axios.post(`${API_BASE_URL}/like/${boardId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// 싫어요 토글
export const toggleDisLike = (boardId, token) => {
    return axios.post(`${API_BASE_URL}/dislike/${boardId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// 게시글 삭제
export const deleteBoard = (boardId, token) => {
    return axios.delete(`${API_BASE_URL}/boards/${boardId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};
