import { mainApi } from '../api-instances';

function getEvalFormSchemaBySlug(slug) {
  return mainApi.get('api/eval-forms/schema/slug', {
    params: { slug }
  });
}

function buildEvalFormResponseReport(resId) {
  return mainApi.get(`api/eval-forms/response/${resId}/report`, {
    responseType: 'blob'
  });
}

function submitResponse({ surveyResponseId, evalFormId, ...rest }) {
  const url = `api/eval-forms/${surveyResponseId}/${evalFormId}/create`;
  return mainApi.post(url, rest);
}

export { getEvalFormSchemaBySlug, submitResponse, buildEvalFormResponseReport };
