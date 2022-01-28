<template>
  <div class="app-dashboard">
    <div
      v-if="!loaded"
      class="d-flex"
    >
      <v-skeleton-loader
        v-for="(n, index) in 3"
        :key="'E' + index"
        class="loader"
        type="card"
        elevation="5"
      />
    </div>

    <div
      v-else
      class="surveys-list"
    >
      <SurveyCardWidget
        v-for="survey in $store.getters.GET_SURVEYS"
        :key="'survey_' + survey.id"
        :survey="survey"
      />
    </div>
  </div>
</template>

<script>
import { SurveyCardWidget } from '~widgets';

export default {
  components: {
    SurveyCardWidget
  },
  data() {
    return {
      loaded: false
    };
  },
  async mounted() {
    await this.$store.dispatch('FETCH_SURVEYS');
    await this.$store.dispatch('COUNT_SURVEYS_RESPONSES');
    this.loaded = true;
  }
};
</script>

<style lang="scss" scoped>
.loader {
  width: 300px;
  margin: auto;
}

.surveys-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.app-dashboard {
  flex: 1;
  width: 100%;
  padding: 20px 10%;
  overflow-y: auto;
  margin-bottom: 10px;
  border-bottom: 1px solid #a2a2a2;
}

@media (max-width: 800px) {
  .d-flex {
    justify-content: center;
  }

  .app-dashboard {
    padding-inline: 20px;
  }
}

@media (min-width: 800px) {
  .d-flex {
    justify-content: flex-start;
  }
}
</style>
