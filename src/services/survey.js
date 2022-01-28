import axios from 'axios';
import { mainApi } from '../api-instances';

let cancelToken = null;

async function getAllPorgrammSurveysConfig(options, programmId) {
  try {
    if (cancelToken) {
      cancelToken.cancel();
    }

    cancelToken = axios.CancelToken.source();
    const response = await mainApi.post(`api/surveys/config/get/${programmId}`, options, {
      cancelToken: cancelToken.token
    });

    cancelToken = null;
    return response;
  } catch (error) {
    if (!axios.isCancel(error)) {
      return { error: true }
    }
  }
}

function getSurveyResponsesCompiledPreview(params) {
  const url = `api/surveys/responses/preview-template`;

  return mainApi.get(url, {
    params
  });
}

function getSurveyResponsesForExport(surveyId) {
  const url = `api/public/survey/responses/export/${surveyId}?key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9`;

  return mainApi.get(url);
}

function getSurveyResponses(surveyId) {
  const url = `api/surveys/responses/all?surveyId=${surveyId}`;

  return mainApi.get(url);
}

function getSurveyResponseById(resId) {
  const url = `api/surveys/responses/find/${resId}`;

  return mainApi.get(url);
}

function updateSurveyResponseById(resId, response) {
  const url = `api/surveys/responses/update/${resId}`;

  return mainApi.post(url, { response });
}

function getRecordStatus(resId) {
  const url = 'api/surveys/responses/' + resId + '/status';

  return mainApi.get(url);
}

function updateRecordStatus(status, resId) {
  const url = `api/surveys/responses/${resId}/status`;

  return mainApi.post(url, { status });
}

function updateSurveyResponsePdfReport(resId) {
  const url = `api/surveys/responses/${resId}/update-report`;

  return mainApi.post(url);
}

function checkForArcGisSurvey(argisFeatureServerUrl) {
  const url = 'api/surveys/arcgis/check';

  return mainApi.get(url, {
    params: {
      argisFeatureServerUrl
    }
  });
}

function importArcGisSurvey(payload) {
  const url = 'api/surveys/arcgis/import';

  return mainApi.post(url, payload);
}

function getSurveysByAttributes(attributes) {
  const url = 'api/surveys/find';

  return mainApi.get(url, {
    params: {
      attributes
    }
  });
}

function getSurveyById(surveyId) {
  const url = `api/surveys/${surveyId}`;

  return mainApi.get(url);
}

function findAllSurveysBySameSlug(slug) {
  const url = `api/surveys/find/${slug}`;

  return mainApi.get(url);
}

function updateSurveySettings(payload) {
  return mainApi.post('/api/surveys/config/settings', payload);
}

function addSurveySchemaItem(item, id) {
  return mainApi.post('/api/surveys/schema/add', {
    item,
    id
  });
}

export {
  getSurveyById,
  getRecordStatus,
  updateRecordStatus,
  importArcGisSurvey,
  getSurveyResponses,
  addSurveySchemaItem,
  updateSurveySettings,
  checkForArcGisSurvey,
  getSurveyResponseById,
  getSurveysByAttributes,
  updateSurveyResponseById,
  findAllSurveysBySameSlug,
  getAllPorgrammSurveysConfig,
  getSurveyResponsesForExport,
  updateSurveyResponsePdfReport,
  getSurveyResponsesCompiledPreview
};
