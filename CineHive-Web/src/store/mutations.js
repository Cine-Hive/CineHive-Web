export default {
    SET_LOGIN(state, payload) {
        state.isLoggedIn = payload.isLoggedIn;
        state.user = {
            name: payload.user.name,
            nickname: payload.user.nickname,
            email: payload.user.email,
            preferredGenres: payload.user.preferredGenres || [],
        };
        state.loginType = payload.loginType || payload.user.mem_type;
        state.token = payload.token;

        console.log("✅ Vuex 저장된 사용자 정보:", state.user);
        console.log("✅ Vuex 저장된 토큰:", state.token);

        // ✅ localStorage에 저장
        localStorage.setItem('email', payload.user.email);
        localStorage.setItem('nickname', payload.user.nickname);
        localStorage.setItem('token', payload.token);
    },
    SET_LOGOUT(state) {
        state.isLoggedIn = false;
        state.user = null;
        state.loginType = null;
        state.token = null;
        state.bookmarks = {};
        state.likes = {};
        state.dislikes = {};


        localStorage.removeItem('email');
        localStorage.removeItem('nickname');
        localStorage.removeItem('token');
        localStorage.removeItem('bookmarks');
        localStorage.removeItem('likes');
        localStorage.removeItem('dislikes');
    },
    SET_SEARCH_RESULTS(state, results) {
        state.searchResults = results;
    },
    SET_BOOKMARK(state, { boardId, status }) {
        state.bookmarks[boardId] = status;
    },
    SET_LIKE(state, { boardId, status }) {
        state.likes[boardId] = status;
    },
    SET_DISLIKE(state, { boardId, status }) {
        state.dislikes[boardId] = status;
    },
};
