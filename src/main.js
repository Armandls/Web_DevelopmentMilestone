import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router/index.js";
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faUser, faShoppingCart, faList, faTrophy, faFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faHome, faUser, faShoppingCart, faList, faTrophy, faFlag);

createApp(App).component('font-awesome-icon', FontAwesomeIcon).use(router).mount('#app')
