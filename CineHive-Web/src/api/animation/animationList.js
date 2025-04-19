//AnimationListView.vue

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// 애니메이션 목록 가져오기
export const fetchAnimations = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/animations`);
        return response.data;
    } catch (error) {
        console.error('애니메이션 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};
