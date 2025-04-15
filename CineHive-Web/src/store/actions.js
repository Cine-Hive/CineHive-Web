export default {
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
};
