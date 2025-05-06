import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081';

/**
 * 미디어 상세 정보 가져오기
 */
export const fetchMediaDetails = async (mediaType, mediaId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/v1/media/${mediaType}s/${mediaId}`);
        return response.data;
    } catch (error) {
        console.error(`${mediaType} 상세 정보를 가져오는 중 오류 발생:`, error);
        throw error;
    }
};

/**
 * 즐겨찾기 토글
 */
export const toggleBookmark = async (mediaId, token) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reply/bookmark/toggle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ movieId: mediaId }),
        });
        return await response.text();
    } catch (error) {
        console.error("즐겨찾기 토글 오류:", error);
        throw error;
    }
};

/**
 * 즐겨찾기 개수 조회
 */
export const fetchBookmarkCount = async (mediaId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reply/bookmark/count?movieId=${mediaId}`);
        return await response.json();
    } catch (error) {
        console.error("즐겨찾기 개수 가져오는 중 오류 발생:", error);
        return 0;
    }
};
