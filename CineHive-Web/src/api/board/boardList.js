//BoardList.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// 게시글 목록 조회 요청 함수
export const fetchPosts = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/boards`);
        return response.data; // 게시글 목록
    } catch (error) {
        console.error('게시글 목록 조회에 실패했습니다:', error);
        throw error; // 에러 처리
    }
};

// 게시글 검색 요청 함수
export const searchPosts = async (keyword) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/boards/search?keyword=${keyword}`);
        return response.data; // 검색된 게시글 목록
    } catch (error) {
        console.error('게시글 검색에 실패했습니다:', error);
        throw error; // 에러 처리
    }
};
