// AnimationListView.vue (혹은 따로 api.js 파일일 경우)

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

// 애니메이션 검색
export const fetchAnimationsSearch = async (query, page = 1) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/animations/search`, {
            params: {
                query,
                page
            }
        });
        return response.data;
    } catch (error) {
        console.error('애니메이션 데이터를 가져오는 중 오류가 발생했습니다:', error);
        throw error;
    }
};
