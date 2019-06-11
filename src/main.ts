import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import Vuetify from 'vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';

// css
import 'vuetify/dist/vuetify.min.css';

Vue.config.productionTip = false;
Vue.use(Vuetify);
Vue.use(VueAxios, axios);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
