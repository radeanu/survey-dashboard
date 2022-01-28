import Vue from 'vue';
import vuetify from '../../plugins/vuetify';

export default {
  state: {
    isDark: false
  },
  getters: {
    THEME_IS_DARK: state => state.isDark,
  },
  mutations: {
    INIT_THEME(state) {
      const theme = Vue.$cookies.get('theme');
      const res = theme !== 'light';
      vuetify.framework.theme.dark = res;
      state.isDark = res;
    },
    TOGGLE_DARK_THEME(state) {
      const theme = Vue.$cookies.get('theme');
      const applyTheme = theme === 'dark' ? 'light' : 'dark';
      const isDark = applyTheme === 'dark';
      Vue.$cookies.set('theme', applyTheme);
      vuetify.framework.theme.dark = isDark;
      state.isDark = isDark;
    }
  }
}
