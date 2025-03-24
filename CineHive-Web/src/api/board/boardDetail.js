import axios from 'axios';

// 게시글 상세 조회
export const fetchBoardDetail = (boardId) => {
    return axios.get(`http://localhost:8081/boards/detail/${boardId}`);
};

// 댓글 조회
export const fetchComments = (boardId) => {
    return axios.get(`http://localhost:8081/comment/all/board/${boardId}`);
};

// 댓글 추가
export const addComment = (boardId, content, token) => {
    return axios.post(`http://localhost:8081/comment/${boardId}`, { content }, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// 댓글 삭제
export const deleteComment = (boardId, commentId, token) => {
    return axios.delete(`http://localhost:8081/comment/board/${boardId}/delete/${commentId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// 카운트 조회 (북마크, 좋아요, 싫어요)
export const fetchCounts = (boardId) => {
    return Promise.all([
        axios.get(`http://localhost:8081/bookmark/${boardId}/count`),
        axios.get(`http://localhost:8081/like/${boardId}/count`),
        axios.get(`http://localhost:8081/dislike/${boardId}/count`),
    ]);
};

// 북마크 토글
export const toggleBookmark = (boardId, token) => {
    return axios.post(`http://localhost:8081/bookmark/${boardId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// 좋아요 토글
export const toggleLike = (boardId, token) => {
    return axios.post(`http://localhost:8081/like/${boardId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// 싫어요 토글
export const toggleDisLike = (boardId, token) => {
    return axios.post(`http://localhost:8081/dislike/${boardId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};

// 게시글 삭제
export const deleteBoard = (boardId, token) => {
    return axios.delete(`http://localhost:8081/boards/delete/${boardId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });
};
