const actionTypes = {
  LOADING: 'loading',
  SUCCESS: 'succes',
  ERROR: 'error',
  SHOW_FORM: 'show form',
  LOAD_FORM_SHEMA: 'load form schema',
  SOCKET_DISCONECTED: 'socket disconected',
  SOCKET_ERROR: 'socket error'
};

const evalFormsType = {
  EXPERT_REGISTRATION: 'expert-registration',
  EVALUATION_FORM: 'evaluation-form'
};

const restResponseType = {
  REST_ERROR: 'Eroare necunoscută',
  REST_SUCCESS: 'Succes',
  REST_SOCKET_DISCONECTED: 'Conexiune întreruptă',
  REST_SOCKET_ERROR: 'Eroare la conectare',
  REST_LOADING: 'În process'
};

const evalForm = {
  evalStatus: {
    EMPTY: 'empty',
    SAVED: 'saved',
    PROCESSING: 'processing',
    INVALID: 'invalid',
    VALID: 'valid'
  },
  evalDescription: {
    empty: {
      icon: 'mdi-comment-plus',
      color: 'accent',
      text: 'Forma nu a fost completată deloc'
    },
    saved: {
      icon: 'mdi-comment-check',
      color: 'info',
      text: 'Forma a fost salvată'
    },
    processing: {
      icon: 'mdi-comment-search',
      color: 'info',
      text: 'Forma este în proces de verificare'
    },
    invalid: {
      icon: 'mdi-comment-alert',
      color: 'accent',
      text: 'Forma nu a trecut etapa de verificare'
    },
    valid: {
      icon: 'mdi-comment-check',
      color: 'primary',
      text: 'Forma a fost completată și verificată'
    }
  }
};

const roles = {
  ADMIN: 'admin',
  EXPERT: 'expert',
  EXECUTOR: 'executor',
  MANAGER: 'manager',
  COMMITTEE: 'committee'
};

Object.freeze(actionTypes);
Object.freeze(evalForm);
Object.freeze(evalFormsType);
Object.freeze(restResponseType);
Object.freeze(roles);

module.exports = {
  actionTypes,
  evalFormsType,
  restResponseType,
  evalForm,
  roles
};
