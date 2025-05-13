import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/store';
import '@fortawesome/fontawesome-free/css/all.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import axios from "axios";

Vue.config.productionTip = false;

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 403) {
            console.warn("⛔ 토큰 만료 감지, 자동 로그아웃 처리");

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
store.dispatch('initializeStore').then(() => {
    new Vue({
        store,
        router,
        render: h => h(App)
    }).$mount('#app');
});
