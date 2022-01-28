<template>
  <v-card-text
    v-if="$store.getters.GET_CURRENT_EVAL_TAB.scope === 'response'"
    class="overflow-auto-2 pa-2"
  >
    <div
      v-for="([key, value], i) in Object.entries(response)"
      :key="'read v' + i"
    >
      <span class="font-weight-medium texttitle--text">
        {{ key }}:
      </span>
      <p>{{ value }}</p>
    </div>
  </v-card-text>
</template>

<script>
export default {
  props: {
    response: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
</style>
