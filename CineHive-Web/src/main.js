import Vue from 'vue'
import App from './App.vue'
import router from './router/router';
import store from './store/store';

import '@toast-ui/editor/dist/toastui-editor.css';


Vue.config.productionTip = false
store.dispatch('initializeStore').then(() => {
  new Vue({
    store,
    router,
    render: h => h(App)
  }).$mount('#app');
});