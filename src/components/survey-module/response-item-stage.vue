<template>
  <div class="item-stage-wrapper">
    {{ responseStage }}
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      stages: [],
      loading: false,
      menu: false
    };
  },
  computed: {
    responseStage() {
      return this.selectedRow._stage || 'lipsa'
    },
    selectedRow() {
      return this.$store.getters.GET_SELECTED_ROW;
    },
    surveyStatuses() {
      return this.$store.getters.GET_SURVEY.settings?.statuses || [];
    }
  },
  methods: {
  }
};
</script>

<style lang="scss" scoped>
.item-stage-wrapper {
  padding: 5px;
}
</style>
