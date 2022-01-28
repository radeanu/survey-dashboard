<template>
  <FormulateForm
    v-model="inputValues"
    :schema="computedShema"
    @submit="submitForm"
  >
    <div
      v-if="$store.getters.GET_CURRENT_EVAL_TAB.canSubmit"
      class="align-center d-flex flex-wrap gap-20"
    >
      <v-btn
        type="submit"
        color="primary"
        outlined
        :loading="sending"
      >
        Salvează
      </v-btn>
    </div>
  </FormulateForm>
</template>

<script>
export default {
  data() {
    return {
      sending: false,
      inputValues: {}
    };
  },
  computed: {
    computedShema() {
      return this.$store.getters.GET_CURRENT_EVAL_TAB_SCHEMA.reduce(
        (acc, curr) => {
          const vif = curr.vif ? this.evalCondition(curr.vif) : true;

          return vif ? [...acc, curr] : acc;
        },
        []
      );
    }
  },
  beforeMount() {
    const { response } = this.$store.getters.GET_CURRENT_EVAL_TAB_RESPONSE;
    if (response) {
      response.forEach(({ label, value }) => this.inputValues[label] = value);
    }
  },
  methods: {
    evalCondition(cond) {
      return eval(cond);
    },
    submitForm() {
      this.$store.commit('SET_INPUT_VALUES', this.inputValues);
      this.$emit('submit', false);
    }
  }
};
</script>

<style lang="scss" scoped></style>
