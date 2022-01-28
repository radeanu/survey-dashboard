import { mainApi } from '../api-instances';

function getAllProgrammes() {
  return mainApi.get('api/programmes/all');
}

export {
  getAllProgrammes
}
