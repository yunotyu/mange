import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/css/global.css'
// import ElementUI from 'element-ui';
import element from '@/common/element';
//全局引入，需要单独引入elementui的样式文件
// import '../node_modules/element-ui/lib/theme-chalk/index.css';
import '@/assets/css/fonts/iconfont.css';
import { axiosrequest } from '@/network/request';

Vue.config.productionTip = false
    // Vue.use(ElementUI);
Vue.use(element)
Vue.prototype.$request = axiosrequest;

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')