<template>
  <div class="app-survey">
    <v-skeleton-loader
      v-if="loading"
      class="mx-5 w-full"
      type="list-item-avatar-two-line, list-item-avatar-two-line, list-item-avatar-two-line"
    />

    <div v-else class="my-3 mx-5 flex-1">
      <v-expansion-panels
        v-model="activeItem"
        accordion
        focusable
        tile
      >
        <v-expansion-panel v-for="(item) in programmes" :key="item.slug">
          <v-expansion-panel-header>
            <div class="d-flex gap-10 align-center">
              <v-icon>
                mdi-format-list-bulleted-square
              </v-icon>
              <span class="font-weight-medium">{{ item.name }}</span>
            </div>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <center v-if="loadingSurveys">
              <span>Se încarcă formularele</span>
              <v-progress-linear
                color="primary"
                indeterminate
                rounded
                height="6"
              />
            </center>
            <div v-else>{{ programSurveys }}</div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<script>
import { getAllPorgrammSurveysConfig } from "../services/survey.js";
import { getAllProgrammes } from "../services/programmes.js";

export default {
  components: {
  },
  data() {
    return {
      activeItem: -1,
      loading: false,
      loadingSurveys: false,
      listDisplayed: false,
      programmes: [],
      programSurveys: []
    };
  },
  computed: {
    currProgrammId() {
      return this.programmes[this.activeItem].id_programm;
    }
  },
  watch: {
    async activeItem(index) {
      if (index !== undefined) {
        await this.fetchProgrammSurveys();
      }
    }
  },
  async created() {
    await this.fetchProgrammes();
  },
  methods: {
    async fetchProgrammes() {
      try {
        this.loading = true;
        const res = await getAllProgrammes();
        this.programmes = res.data;
      } catch (error) {

      } finally {
        this.loading = false;
      }
    },
    async fetchProgrammSurveys() {
      this.loadingSurveys = true;
      this.programSurveys = [];
      const options = {
        attributes: {
          include: ['id', 'active']
        }
      }

      const res = await getAllPorgrammSurveysConfig(options, this.currProgrammId);

      if (res?.error) {
        this.loadingSurveys = false;

        this.$notify({
          group: 'error',
          text: `🤷 Eroare!`
        });
      }

      if (res?.data) {
        this.programSurveys = res.data
        this.loadingSurveys = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.app-survey {
  display: flex;
  flex: 1;
  flex-wrap: nowrap;
  border-bottom: 1px solid #a2a2a2;
  margin-bottom: 10px;
}

.v-progress-linear {
  max-width: 200px;
}

.v-expansion-panel-header--active {
  min-height: 48px !important;
}

.v-expansion-panel-header {
  padding: 10px !important;
}

::v-deep .v-expansion-panel-content__wrap {
  padding: 10px !important;
}

</style>
