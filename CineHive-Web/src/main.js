import Vue from 'vue';
import App from './App.vue';
import router from './router/router';
import store from './store/index.js';
import '@fortawesome/fontawesome-free/css/all.css';
import '@toast-ui/editor/dist/toastui-editor.css';

Vue.config.productionTip = false;



// 초기 스토어 세팅 후 앱 마운트
store.dispatch('initializeStore').then(() => {
    new Vue({
        store,
        router,
        render: h => h(App)
    }).$mount('#app');
});
