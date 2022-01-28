import Vue from 'vue';
import { mainApi } from '../../api-instances';
import { roles } from '../../shared/types';
import { parseJwt } from '../../shared/utils';

export default {
  state: {
    user: {},
    authError: ''
  },
  getters: {
    USER_CAN_EDIT_SETTINGS_FORMS: state => roles.ADMIN === state.user.role,
    USER_CAN_EDIT_RESPONSE_AS_NEW: state =>
      [roles.ADMIN, roles.COMMITTEE].includes(state.user.role),
    USER_CAN_CHANGE_RECORD_SETTINGS: state =>
      state.user.rights.canChangeRecordSettings,
    USER_CAN_ADD_NOTIFICATIONS: state => state.user.rights.canSetNotifications,
    USER_CAN_CHECK_DOSSIER: state => state.user.rights.evalForms.length > 0,
    USER_CAN_SUBMIT_FORMS: state => state.user.rights.canSubmitResponse,
    USER_CAN_DELETE_FILES: state => state.user.rights.canDeleteFiles,
    USER_CAN_UPLOAD_FILES: state => state.user.rights.canUploadFiles,
    USER_CAN_UPDATE_ROWS: state => state.user.rights.canUpdateRows,
    GET_LOGIN_ERROR: state => state.authError,
    GET_USER_ROLE: state => state.user.role,
    GET_USER_EVAL_ACTION_RIGHTS: state =>
      state.user.rights.evalForms.length > 0 ||
      state.user.rights.viewEvalForms.length > 0 ||
      state.user.rights.canValidateForms,
    GET_USER(state) {
      if (!Object.keys(state.user).length) {
        const token = Vue.$cookies.get('token');
        const data = token ? JSON.parse(atob(token.split('.')[1])) : {};
        state.user = data;
      }

      return state.user;
    }
  },
  mutations: {
    SET_LOGIN_ERROR: (state, message) => (state.authError = message),
    SET_USER_DATA(state, token) {
      Vue.$cookies.set('token', token, '5d');
      state.user = parseJwt(token);
    },
    LOGOUT(state) {
      state.user = {};
      state.authError = '';
      Vue.$cookies.remove('token');
      const surveyKeys = Object.keys(localStorage).filter(
        key => key.substring(0, 6) === 'Survey'
      );
      surveyKeys.forEach(key => {
        localStorage.removeItem(key);
      });
      location.reload();
    }
  },
  actions: {
    async LOGIN(store, { login, password }) {
      try {
        store.commit('SET_LOGIN_ERROR', '');

        const { data } = await mainApi.post('login', {
          login,
          password
        });

        store.commit('SET_USER_DATA', data.token);
      } catch (err) {
        console.error(err);
        if (err?.response?.status === 401) {
          store.commit('SET_LOGIN_ERROR', 'Date de acces incorecte');
        } else {
          store.commit(
            'SET_LOGIN_ERROR',
            'Eroare necunoscută, încercați mai târziu'
          );
        }
      }
    },
    async RESET_PASSWORD(store, data) {
      try {
        await mainApi.post('api/kents/reset-password', data);
        return true;
      } catch (err) {
        if (err?.response?.status === 401) {
          store.commit('SET_LOGIN_ERROR', 'Date de acces incorecte');
        } else {
          store.commit(
            'SET_LOGIN_ERROR',
            'Eroare necunoscută, încercați mai târziu'
          );
        }

        return false;
      }
    }
  }
};
