import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/index.js';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { isTokenExpired } from './utils/auth';

Vue.config.productionTip = false;

const token = localStorage.getItem('token');
if (token && isTokenExpired(token)) {
    alert('🔒 토큰이 만료되었습니다. 자동 로그아웃 처리합니다.');
    store.commit('SET_LOGOUT');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginType');
    router.push('/auth');
}

// ✨ Axios 응답 인터셉터 설정 (403 자동 로그아웃)
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            console.warn("⛔ 토큰 만료 감지, 자동 로그아웃 처리");
            alert("⛔ 토큰 만료 감지, 자동 로그아웃 처리");

            store.commit('SET_LOGOUT');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginType');

            router.push('/auth');
        }
        return Promise.reject(error);
    }
);

// 초기 스토어 세팅 후 앱 마운트
store.dispatch('initializeStore').then(() => {
    new Vue({
        store,
        router,
        render: h => h(App)
    }).$mount('#app');
});
