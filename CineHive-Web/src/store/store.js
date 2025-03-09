import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoggedIn: false, // 로그인 상태
        user: null, // 사용자 정보
        loginType: null, // 로그인 타입 (kakao, google, naver)
        searchResults: null, // 검색 결과 저장
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
                email: payload.user.email, // ✅ email 저장
                preferredGenres: payload.user.preferredGenres || [],
            };
            console.log("Setting user in Vuex:", state.user);
            state.loginType = payload.loginType || payload.user.mem_type;

            // ✅ localStorage에 email 저장
            localStorage.setItem('email', payload.user.email);
            localStorage.setItem("nickname", payload.user.nickname);
        }
        ,
        SET_LOGOUT(state) {
            state.isLoggedIn = false;
            state.user = null;
            state.loginType = null;

            // 다른 계정으로 로그인 시 즐겨찾기, 좋아요, 싫어요 오류가 남에 따라 -> 로그아웃 시 해당 상태 값 초기화 하도록 추가
            state.bookmarks = {};
            state.likes = {};
            state.dislikes = {};

            // 상태 값 제거
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
        setBookmark({ commit }, { boardId, status }) {
            commit('SET_BOOKMARK', { boardId, status });
        },
        setLike({ commit }, { boardId, status }) {
            commit('SET_LIKE', { boardId, status });
        },
        setDislike({ commit }, { boardId, status }) {
            commit('SET_DISLIKE', { boardId, status });
        },
        // 로그인 액션
        async login({ commit }, { user, loginType }) {
            try {
                const finalloginType = loginType || user.mem_type;

                commit('SET_LOGIN', { isLoggedIn: true, user, loginType });

                // ✅ localStorage에 user.email 저장
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(user));
                localStorage.setItem('loginType', finalloginType);

                console.log("로그인 후 localStorage 저장 확인:", localStorage.getItem("user"));
            } catch (error) {
                console.error('로그인 중 오류 발생:', error);
            }
        },
        // 로그아웃 액션
        logout({ commit }) {

            commit('SET_LOGOUT');


            // 로컬 스토리지에서 로그인 정보 제거
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            localStorage.removeItem('loginType');

            console.log("로그아웃 후 localStorage:", localStorage.getItem('isLoggedIn'), localStorage.getItem('user'));
        },


        updateSearchResults({ commit }, results) {
            commit('SET_SEARCH_RESULTS', results);
        },


        initializeStore({ commit }) {
            const isLoggedIn = localStorage.getItem('isLoggedIn');
            const user = JSON.parse(localStorage.getItem('user'));

            if (isLoggedIn === 'true' && user) {
                const loginType = user.mem_type || localStorage.getItem('loginType');
                commit('SET_LOGIN', { isLoggedIn: true, user, loginType });
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
        isBookmarked: (state) => (boardId) => state.bookmarks[boardId] || false,
        isLiked: (state) => (boardId) => state.likes[boardId] || false,
        isDisliked: (state) => (boardId) => state.dislikes[boardId] || false,
    }

});