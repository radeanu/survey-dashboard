export default {
  mutations: {
    SET_PROMT_DIALOG(state, val) {
      state.promtDialog = val;
    }
  },
  getters: {
    SHOW_PROMT_DIALOG(state) {
      return state.showPromtDialog;
    }
  },
  state: {
    promtDialog: false
  }
};
