//BoardEditView.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// 게시글 상세 조회 요청 함수
export const fetchBoardDetail = async (boardId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/boards/${boardId}`);
        return response.data; // 게시글 상세 데이터
    } catch (error) {
        console.error('게시글 조회에 실패했습니다:', error);
        throw error; // 에러 처리
    }
};

// 게시글 수정 요청 함수
export const updateBoardPost = async (boardId, memEmail, brdTitle, brdContent, token) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/boards/${boardId}`,
            { memEmail, brdTitle, brdContent },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data; // 수정된 게시글 응답
    } catch (error) {
        console.error('게시물 수정에 실패했습니다.', error);
        throw error; // 에러 처리
    }
};
