<template>
  <FormulateForm
    v-model="inputValues"
    class="pt-2"
    :schema="computedShema"
    @submit="submitForm"
  >
    <div class="align-center d-flex flex-wrap gap-20">
      <v-btn
        type="submit"
        color="primary"
        outlined
        :loading="sending"
      >
        Salvează
      </v-btn>
      <i>Se va salva ca răspuns nou</i>
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
    const res = this.$store.getters.GET_CURRENT_EVAL_TAB_RESPONSE.response;
    this.inputValues = res.reduce((acc, curr) => {
      const obj = { [curr.label]: curr.value };

      if (!curr.display) {
        curr.value = 0;
      }

      return {
        ...acc,
        ...obj
      };
    }, {});
  },
  methods: {
    submitForm() {
      this.$store.commit('SET_INPUT_VALUES', this.inputValues);
      this.$emit('submit', true);
    },
    evalCondition(cond) {
      return eval(cond);
    }
  }
};
</script>

<style lang="scss" scoped></style>
