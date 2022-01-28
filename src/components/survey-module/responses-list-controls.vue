<template>
  <div class="d-flex flex-wrap align-center px-5 py-2 gap-5">
    <div class="d-flex flex-nowrap align-center">
      <FormulateInput
        v-model="currentRound"
        class="surveys-calls"
        type="select"
        :options="surveyRounds"
        @change="fetchNewSurveyData"
      />

      <SurveySettings
        v-if="$store.getters.GET_USER.rights.canSetNotifications"
        class="pl-3"
      />
    </div>

    <v-spacer />

    <div class="d-flex">
      <v-text-field
        v-model="wordToSearch"
        hide-details
        height="40"
        outlined
        :label="searchResultLabel"
        dense
      >
        <template v-slot:append>
          <v-progress-circular
            v-if="searching"
            size="24"
            color="secondary lighten-3"
            indeterminate
          />
        </template>
      </v-text-field>
      <ExportDataWidget class="pl-3" />
      <ResponsesFilter />
    </div>
  </div>
</template>

<script>
import { ExportDataWidget } from '../widgets';
import { findAllSurveysBySameSlug } from '../../services/survey';
import SurveySettings from './survey-settings.vue';
import ResponsesFilter from './responses-filter';

export default {
  components: {
    ExportDataWidget,
    ResponsesFilter,
    SurveySettings
  },
  data() {
    return {
      importDialog: false,
      currentRound: 0,
      surveyRounds: [],
      wordToSearch: "",
      searching: false
    };
  },
  computed: {
    survey() {
      return this.$store.getters.GET_SURVEY;
    },
    searchResultLabel() {
      const count = this.$store.getters.GET_SURVEY_ROWS_TO_DISPLAY_COUNT;

      return count ? `${count} rezultate` : 'Caută';

    },
    stringifiedRows() {
      return this.$store.getters.GET_SURVEY_ROWS.map(v => ({
        _id: v._id,
        value: JSON.stringify(v).replace(/\W+/g, '').toLocaleLowerCase()
      }))
    }
  },
  watch: {
    wordToSearch(value) {
      setTimeout(() => {
        this.searching = true;
        this.$store.commit('SEARCH_TEXT', {
          text: value.replace(/\W+/g, '').toLocaleLowerCase(),
          list: this.stringifiedRows
        });
        this.searching = false;
      }, 0)
    },
  },
  async beforeMount() {
    const { data } = await findAllSurveysBySameSlug(this.survey.slug);
    this.surveyRounds = data.map((r) => {
      return {
        label: `#${r.round} - ${r.settings.shortName}`,
        value: `${r.round}`,
        // source: r.source,
        id: r.id
      };
    });
    this.currentRound = this.survey.round;
  },
  methods: {
    async fetchNewSurveyData() {
      const params = this.$route.params;
      const query = this.$route.query;
      const newSurvey = this.surveyRounds.filter(
        (r) => r.value === this.currentRound
      )[0];

      // params.source = newSurvey.source;
      params.surveyId = newSurvey.id;
      delete params.rowId;
      delete query.mode;

      this.$router.push({
        name: 'FormView',
        params,
        query
      });

      window.location.reload();
    }
  }
};
</script>

<style lang="scss" scoped>
.v-text-field {
  width: 240px !important;
}

.surveys-calls {
  margin: 0;
  min-width: 240px;
}
</style>
