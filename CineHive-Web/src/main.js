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
    alert('로그아웃 되었습니다. 다시 로그인해 주세요');
    store.commit('SET_LOGOUT');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginType');
    router.push('/auth');
}

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            console.log("⛔ 토큰 만료 감지, 자동 로그아웃 처리");

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

store.dispatch('initializeStore').then(() => {
    new Vue({
        store,
        router,
        render: h => h(App)
    }).$mount('#app');
});
