import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/index.js';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.css';
import '@toast-ui/editor/dist/toastui-editor.css';

Vue.config.productionTip = false;

// ✨ Axios 응답 인터셉터 설정 (403 자동 로그아웃)
axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            alert("로그아웃 되었습니다. 다시 로그인 해 주세요.");

            store.commit('SET_LOGOUT');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('user');
            localStorage.removeItem('loginType');
            localStorage.removeItem('token');

            router.push('/auth');
        }
        return Promise.reject(error);
    }
);

// 초기 스토어 세팅 후 앱 마운트
Vue.config.productionTip = false
store.dispatch('initializeStore').then(() => {
    new Vue({
        store,
        router,
        render: h => h(App)
    }).$mount('#app');
});