import { mainApi } from '../../api-instances';

export default {
  actions: {
    async FETCH_TABS(store, surveyId) {
      try {
        const url = `api/eval-forms/${surveyId}/tabs`;
        const { data } = await mainApi.get(url);
        store.commit('SET_FORM_TABS', data);
      } catch (error) {
        console.error(error);
      }
    },
    async FETCH_CURRENT_TAB_RESPONSES(store, rowId) {
      try {
        const url = `api/eval-forms/${rowId}/${store.state.currentTab.id}/responses`;
        const { data } = await mainApi.get(url);

        store.commit('SET_CURRENT_EVAL_TAB_RESPONSES', data);
        store.commit('SET_CURRENT_EVAL_TAB_RESPONSE', 0);
      } catch (error) {
        console.error(error);
      }
    }
  },
  mutations: {
    SET_FORM_TABS(state, val) {
      state.tabs = val;
    },
    SET_CURRENT_EVAL_TAB(state, indx) {
      state.currentTab = state.tabs[indx];
    },
    SET_CURRENT_EVAL_TAB_RESPONSES(state, data) {
      state.responses = data;
    },
    SET_CURRENT_EVAL_TAB_RESPONSE(state, indx) {
      state.currentResponse = state.responses[indx]
        ? state.responses[indx]
        : {};
    },
    RESET_CURRENT_EVAL_TAB_RESPONSES(state) {
      state.responses = [];
    },
    RESET_CURRENT_EVAL_TAB_RESPONSE(state) {
      state.currentResponse = {};
    },
    RESET_VIEW_MODE(state) {
      state.viewMode = '';
    },
    RESET_EVAL_STATE_TO_DEFAULT(state) {
      state.tabs = [];
      state.viewMode = '';
      state.responses = [];
      state.currentTab = {};
      state.currentResponse = {};
      state.inputValues = {};
    },
    SET_VIEW_MODE(state) {
      const isNote = state.currentTab.scope === 'note';
      const resAlready = !!state.currentResponse.response;
      const noteMode = isNote && resAlready;
      const editMode = !noteMode && !resAlready;
      const readMode = !editMode && resAlready;

      if (noteMode || readMode) {
        state.viewMode = 'read';
      } else {
        state.viewMode = 'edit';
      }
    },
    UPDATE_VIEW_MODE(state, mode) {
      state.viewMode = mode;
    },
    SET_INPUT_VALUES(state, values) {
      state.inputValues = values;
    }
  },
  getters: {
    GET_CURRENT_EVAL_TAB(state) {
      return state.currentTab;
    },
    GET_CURRENT_EVAL_TAB_SCHEMA(state) {
      return state.currentTab.schema;
    },
    GET_CURRENT_EVAL_TAB_RESPONSES(state) {
      return state.responses;
    },
    GET_CURRENT_EVAL_TAB_RESPONSE(state) {
      return state.currentResponse;
    },
    GET_EVAL_TABS(state) {
      return state.tabs;
    },
    GET_VIEW_MODE(state) {
      return state.viewMode;
    },
    GET_EVAL_FORM_INPUT_VALUES(state) {
      return state.inputValues;
    }
  },
  state: {
    tabs: [],
    viewMode: '',
    responses: [],
    currentTab: {},
    inputValues: {},
    currentResponse: {}
  }
};
