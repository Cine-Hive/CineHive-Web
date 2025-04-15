import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoggedIn: false,
        user: null,
        loginType: null,
        token: null,
        searchResults: null,
        bookmarks: {},
        likes: {},
        dislikes: {}
    },
    mutations: {
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
    },
    actions: {
        async login({ commit }, response) {
            try {
                commit('SET_LOGIN', {
                    isLoggedIn: true,
                    userInfo: response.userInfo,
                    token: response.token,
                    loginType: response.userInfo.mem_type
                });

                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(response.userInfo));
                localStorage.setItem('loginType', response.userInfo.mem_type);
                localStorage.setItem('token', response.token);

                console.log("✅ 로그인 후 localStorage 저장 확인:", localStorage.getItem("token"));
            } catch (error) {
                console.error('로그인 중 오류 발생:', error);
            }
        },
        logout({ commit }) {
            commit('SET_LOGOUT');

            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            localStorage.removeItem('loginType');
            localStorage.removeItem('token');

            console.log("로그아웃 후 localStorage:", localStorage.getItem('isLoggedIn'), localStorage.getItem('user'));
        },
        updateSearchResults({ commit }, results) {
            commit('SET_SEARCH_RESULTS', results);
        },
        initializeStore({ commit }) {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');

            if (isLoggedIn === 'true' && user && token) {
                const loginType = user.mem_type || localStorage.getItem('loginType');
                commit('SET_LOGIN', { isLoggedIn: true, user, loginType, token });
            } else {
                commit('SET_LOGOUT');
            }

            // 즐겨찾기 상태 초기화
            const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
            for (const [boardId, status] of Object.entries(bookmarks)) {
                commit('SET_BOOKMARK', { boardId, status });
            }

            // 좋아요 상태 초기화
            const likes = JSON.parse(localStorage.getItem('likes')) || {};
            for (const [boardId, status] of Object.entries(likes)) {
                commit('SET_LIKE', { boardId, status });
            }

            // 싫어요 상태 초기화
            const dislikes = JSON.parse(localStorage.getItem('dislikes')) || {};
            for (const [boardId, status] of Object.entries(dislikes)) {
                commit('SET_DISLIKE', { boardId, status });
            }
        }
    },
    getters: {
        getUserId: (state) => (state.user ? state.user.userid : null),
        getUserInfo: (state) => state.user,
        getLoginType: (state) => state.loginType,
        getToken: (state) => state.token, // ✅ 토큰 getter 추가
        isBookmarked: (state) => (boardId) => state.bookmarks[boardId] || false,
        isLiked: (state) => (boardId) => state.likes[boardId] || false,
        isDisliked: (state) => (boardId) => state.dislikes[boardId] || false,
    }
});
