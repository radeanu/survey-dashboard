import { mainApi } from '../api-instances';

function registerNewUser(data) {
  return mainApi.post('api/kents/sign-in', data);
}

function getRegisterSchema() {
  return [
    {
      label: 'Nume/Prenume',
      name: 'login',
      validation: '^required|min:4|max:30',
      style: 'width: 350px',
      'validation-messages': {
        required: 'Acest câmp este obligatoriu',
        min: 'Minim 4 caractere',
        max: 'Maxim 30 caractere'
      }
    },
    {
      label: 'Email',
      name: 'email',
      style: 'width: 350px',
      validation: '^required|email',
      'validation-messages': {
        required: 'Acest câmp este obligatoriu',
        email: 'Email invalid'
      }
    },
    {
      label: 'Parola temporară',
      type: 'password',
      name: 'password',
      style: 'width: 350px',
      validation: '^required|min:4|max:30',
      'validation-messages': {
        required: 'Acest câmp este obligatoriu',
        min: 'Minim 4 caractere',
        max: 'Maxim 30 caractere'
      }
    },
    {
      label: 'Rol',
      type: 'select',
      name: 'role',
      options: {
        executor: 'Executor',
        admin: 'Administrator',
        manager: 'Manager',
        committee: 'Comitet',
      }
    },
    {
      type: 'textarea',
      name: 'rights',
      style: 'width: 350px; height: 150px',
      label: 'Setează drepturi',
      value: JSON.stringify(
        {
          surveysId: [],
          evalForms: [],
          viewEvalForms: [],
          canUploadFiles: true,
          canValidateForms: false,
          canViewLogs: false,
          canRegisterNewUser: false,
          canChangeRecordSettings: true,
          canSubmitResponse: true,
          canViewRecordSettings: true,
          canDeleteFiles: true,
          canUpdateRows: true,
          canSetNotifications: true
        },
        undefined,
        4
      )
    },
    {
      type: 'submit',
      label: 'Continuă'
    }
  ];
}

export { registerNewUser, getRegisterSchema };
