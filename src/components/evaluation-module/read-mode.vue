<template>
  <div>
    <div
      v-for="(item, indxx) in computedResponse"
      :key="'readItem' + indxx"
    >
      <div v-if="item.display">
        <span class="font-weight-medium texttitle--text">{{ item.label }}
        </span>
        <p>
          <span
            v-if="item.score || item.score === 0"
            class="score"
          >
            {{ item.score }}
          </span>
          <template v-if="item.type === 'checkbox'">
            <p
              v-for="(val, i) in item.value"
              :key="i + 'ch'"
              class="ma-0"
            >
              📌 {{ val }}
            </p>
          </template>
          <template v-else>
            {{ item.value }}
          </template>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  computed: {
    computedResponse() {
      return this.$store.getters.GET_CURRENT_EVAL_TAB_RESPONSE.response
        ? this.$store.getters.GET_CURRENT_EVAL_TAB_RESPONSE.response.filter(
          res => res.display
        )
        : [];
    }
  },
  beforeMount() {
    const res = this.$store.getters.GET_CURRENT_EVAL_TAB_RESPONSE.response;

    if (res) {
      const inputValues = res.reduce((acc, curr) => {
        const obj = { [curr.label]: curr.value };

        if (!curr.display) {
          curr.value = 0;
        }

        return {
          ...acc,
          ...obj
        };
      }, {});

      this.$store.commit('SET_INPUT_VALUES', inputValues);
    }
  }
};
</script>

<style lang="scss" scoped>
.score {
  background-color: #018053;
  color: white;
  padding: 1px 1px 1px 4px;
  border-radius: 5px;
  margin-right: 10px;
}
</style>
