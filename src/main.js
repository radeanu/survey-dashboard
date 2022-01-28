import Vue from 'vue';
import VueAxios from 'vue-axios';
import VueCookies from 'vue-cookies';
import VuejsDialog from 'vuejs-dialog';
import Notifications from 'vue-notification';
import VueFormulate from '@braid/vue-formulate';
import VueVirtualScroller from 'vue-virtual-scroller';

import '../node_modules/@braid/vue-formulate/themes/snow/snow.scss';
import '../node_modules/vuejs-dialog/dist/vuejs-dialog.min.css';
import './assets/style/styles.scss';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

import { mainApi } from './api-instances';
import { formulateOptions, dialogOptions } from './plugins/config';
import vuetify from './plugins/vuetify';
import router from './router';
import store from './store';

import App from './App.vue';

Vue.use(VueVirtualScroller);
Vue.use(VueAxios, mainApi);
Vue.use(VueCookies);
Vue.use(Notifications);
Vue.use(VueFormulate, formulateOptions);
Vue.use(VuejsDialog, dialogOptions);

Vue.config.performance = true;
Vue.config.productionTip = false;

const setted = Vue.$cookies.get('theme');
const theme = setted ? setted : 'light';
Vue.$cookies.set('theme', theme);

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');
