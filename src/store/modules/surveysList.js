import Vue from 'vue';
import { mainApi } from '../../api-instances';

export default {
  actions: {
    async FETCH_SURVEYS(store) {
      try {
        const { data } = await mainApi.get('api/surveys');

        store.commit('SET_SURVEYS_DATA', data);
      } catch (error) {
        console.error(error);
      }
    },
    async COUNT_SURVEYS_RESPONSES(store) {
      try {
        const surveysIds = store.state.surveys.map(({id}) => id);
        const { data } = await mainApi.get('api/surveys/responses/count', {
          params: { ids: JSON.stringify(surveysIds) }
        });

        data.forEach(countResult => {
          store.commit('SET_SURVEY_RESPONSES_COUNT', countResult);
        });

      } catch (error) {
        console.error(error);
      }
    },
    async COUNT_SURVEY_RESPONSES(store, surveyId) {
      try {
        const { data } = await mainApi.get(`api/surveys/${surveyId}/responses/count`);

        store.commit('SET_SURVEY_RESPONSES_COUNT', data);
      } catch (error) {
        console.error(error);
      }
    }
  },
  mutations: {
    SET_SURVEYS_DATA(state, surveys) {
      state.surveys = surveys;
    },
    ADD_NEW_SURVEY_DATA(state, survey) {
      state.surveys = [
        ...state.surveys,
        survey
      ];
    },
    SET_SURVEY_RESPONSES_COUNT(state, { id, count }) {
      state.surveys.filter(survey => survey.id === id)[0].submitedCount = count;
    },
    SET_CURRENT_FORM(state, form) {
      state.currentForm = form;
    },
    INIT_FORM_META_IN_COOKIES(_, meta) {
      if (Vue.$cookies.indexOf('form-meta') === -1) {
        Vue.$cookies.set('form-meta', JSON.stringify([...meta]));
      } else {
        const cookieFormsMeta = Vue.$cookies.get('form-meta').parse();
        const found = cookieFormsMeta.filter(({ slug }) => slug === meta.slug);

        if (!found.length) {
          Vue.$cookies.set(
            'form-meta',
            JSON.stringify([...cookieFormsMeta, ...meta])
          );
        }
      }
    },
    UPDATE_FORM_META_IN_COOKIES(_, meta) {
      if (Vue.$cookies.indexOf('form-meta') === -1) {
        return;
      } else {
        const cookieFormsMeta = Vue.$cookies.get('form-meta').parse();
        const found = cookieFormsMeta.filter(({ slug }) => slug === meta.slug);

        if (!found.length) {
          return;
        }

        Vue.$cookies.set(
          'form-meta',
          JSON.stringify([
            ...cookieFormsMeta.filter(({ slug }) => slug !== meta.slug),
            ...meta
          ])
        );
      }
    }
  },
  getters: {
    GET_SURVEYS(state) {
      return state.surveys;
    }
  },
  state: {
    surveys: []
  }
};
