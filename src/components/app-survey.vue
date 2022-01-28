<template>
  <div class="app-survey">
    <div class="app-survey-responses">
      <ResponsesListControls v-if="surveyLoaded" />
      <v-divider />

      <ResponsesList @loaded="surveyLoaded = true" />
    </div>

    <EvaluationModule v-if="surveyLoaded && $route.query.mode === 'eval'" />
    <ResponsesItemPreview v-if="surveyLoaded && $route.params.rowId" />
  </div>
</template>

<script>
import ResponsesItemPreview from './survey-module/responses-item-preview.vue';
import ResponsesList from './survey-module/responses-list';
import ResponsesListControls from './survey-module/responses-list-controls.vue';
import EvaluationModule from './evaluation-module/evaluation-module';

export default {
  components: {
    ResponsesItemPreview,
    EvaluationModule,
    ResponsesListControls,
    ResponsesList,
  },
  data() {
    return {
      surveyLoaded: false
    };
  },
  beforeDestroy() {
    this.$store.commit('RESET_SURVEY_STATE');
  },
  methods: {}
};
</script>

<style lang="scss" scoped>
.app-survey {
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  border-bottom: 1px solid #a2a2a2;
  margin-bottom: 10px;
  overflow: auto;
}

.app-survey-responses {
  min-width: 30%;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
