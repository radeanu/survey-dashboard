import Vue from 'vue';
import Vuex from 'vuex';

import surveysList from './modules/surveysList';
import user from './modules/user';
import theme from './modules/theme';
import dashboard from './modules/dashboard';
import evaluation from './modules/evaluation';
import survey from './modules/survey';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    surveysList,
    theme,
    user,
    dashboard,
    evaluation,
    survey
  },
});
