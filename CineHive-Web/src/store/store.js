import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLoggedIn: false, // 로그인 상태
        user: null, // 사용자 정보
        loginType: null, // 로그인 타입 (kakao, google, naver)
        searchResults: null, // 검색 결과 저장
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
        }
        ,
        SET_LOGOUT(state) {
            state.isLoggedIn = false;
            state.user = null;
            state.loginType = null;
        },
        SET_SEARCH_RESULTS(state, results) {
            state.searchResults = results;
        }
    },
    actions: {
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

                console.log("스토어 초기화 - 가져온 user 데이터:", user); // ✅ 로그 확인
            } else {
                commit('SET_LOGOUT');
            }

            // ✅ email이 저장되었는지 확인
            console.log("스토어 초기화 - email 확인:", localStorage.getItem("email"));
        }

    },
    getters: {
        getUserId: (state) => (state.user ? state.user.userid : null),
        getUserInfo: (state) => state.user,
        getLoginType: (state) => state.loginType,
    }
});