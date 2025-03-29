//CreateBoard.vue

import axios from 'axios';

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

        return response.data; // 성공적으로 등록된 게시글의 응답
    } catch (error) {
        console.error('게시물 등록에 실패했습니다.', error);
        throw error; // 실패 시 에러를 던짐
    }
};
