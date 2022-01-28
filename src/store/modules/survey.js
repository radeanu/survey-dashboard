import { mainApi } from '../../api-instances';
import { filterList, searchTextInList, switchToNewListItem } from '../utils/survey-utils.js';
import { updateSurveySettings } from '../../services/survey';

const getDefaultState = () => {
  return {
    rows: [],
    survey: {},
    selectedRow: {},
    rowsToDisplay: []
  };
};

export default {
  state: getDefaultState(),
  getters: {
    GET_SURVEY: state => state.survey,
    GET_SURVEY_ROWS: state => state.rows,
    GET_SURVEY_ROWS_LENGTH: state => state.rows.length,
    GET_SELECTED_ROW: state => state.selectedRow,
    GET_SURVEY_ROWS_TO_DISPLAY: state => state.rowsToDisplay.length ? state.rowsToDisplay : state.rows,
    GET_SURVEY_ROWS_TO_DISPLAY_COUNT: state => state.rowsToDisplay.length,
  },
  mutations: {
    SET_SURVEY: (state, data) => (state.survey = data),
    SET_SURVEY_ROWS: (state, rows) => (state.rows = rows),
    SET_SELECTED_ROW: (state, sel) => (state.selectedRow = sel),
    SET_SURVEY_SETTINGS: (state, data) => (state.survey.settings = data),
    SET_SELECTED_ROW_BY_ID: (state, rowId) => state.selectedRow = state.rows.filter(row => row._id === rowId)[0],
    RESET_SURVEY_STATE: (state) => Object.assign(state, getDefaultState()),
    APPLY_FILTERS: (state, filters) => {
      const result = filterList(state.rows, filters);
      result.length
        ? state.rowsToDisplay = result
        : alert('Nu au fost găsite nici o înregistrare după așa filtru');
    },
    SEARCH_TEXT: (state, {text, list}) => {
      const resIds = searchTextInList(text, list);
      state.rowsToDisplay = resIds ? state.rows.filter(v => resIds.includes(v._id)) : [];
    },
    MANAGE_CURRENT_SELECTED_ROW(state, position) {
      const roe = switchToNewListItem(state.rows, state.selectedRow, position);
      state.selectedRow = roe;
    },
    UPDATE_SURVEY_RESPONSE(state, { id, response }) {
      const row = state.rows.filter(r => +r._id === +id)[0];
      if (row) {
        const index = state.rows.indexOf(row);
        Object.keys(state.rows[index]).forEach((key) => {
          state.rows[index][key] = response[key];
        })
      }
    }
  },
  actions: {
    async DELETE_CURRENT_SURVEY_RESPONSE_FILE(store, fileName) {
      try {
        const url = `storage/manage/delete/${store.state.survey.id}/${store.state.selectedRow._id}/${fileName}`;
        const { data } = await mainApi.get(url);

        if (data.done) {
          await store.dispatch('FETCH_SURVEY_ROW_RESPONSE', {
            rowIndex: store.state.selectedRow._index,
            rowId: store.state.selectedRow._id,
            surveyId: store.state.survey.id
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    async FETCH_SURVEY_RESPONSES(store) {
      try {
        const { data } = await mainApi.get(
          `api/surveys/${store.state.survey.id}/responses`
        );

        store.commit('SET_SURVEY_ROWS', data);
      } catch (error) {
        console.error(error);
      }
    },
    async FETCH_SURVEY_BY_PARAMS(store, { surveyId }) {
      try {
        const url = 'api/surveys/' + surveyId;
        const { data } = await mainApi.get(url);

        store.commit('SET_SURVEY', data);
      } catch (error) {
        console.error(error);
      }
    },
    async FETCH_SURVEY_ROW_RESPONSE(store, { rowId, surveyId, rowIndex }) {
      try {
        const { data } = await mainApi.get('api/surveys/responses', {
          params: {
            responseId: rowId,
            index: rowIndex,
            surveyId,
          }
        });

        store.commit('UPDATE_SURVEY_RESPONSE', {
          id: rowId,
          response: data.response
        });
      } catch (error) {
        console.error(error);
      }
    },
    async UPDATE_SURVEY_SETTINGS(store, payload) {
      try {
        const response = await updateSurveySettings(payload);

        store.commit('SET_SURVEY_SETTINGS', response.data);
      } catch (error) {
        console.error(error);
      }
    },
  }
};
