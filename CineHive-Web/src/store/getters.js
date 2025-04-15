export default {
    getUserId: (state) => (state.user ? state.user.userid : null),
    getUserInfo: (state) => state.user,
    getLoginType: (state) => state.loginType,
    getToken: (state) => state.token, // ✅ 토큰 getter 추가
    isBookmarked: (state) => (boardId) => state.bookmarks[boardId] || false,
    isLiked: (state) => (boardId) => state.likes[boardId] || false,
    isDisliked: (state) => (boardId) => state.dislikes[boardId] || false,
};
