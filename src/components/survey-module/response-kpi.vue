<template>
  <v-expansion-panels accordion>
    <v-expansion-panel>
      <v-expansion-panel-header>
        Informații adăugătoare
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-btn
          small
          outlined
          class="mb-2"
          color="primary"
          @click="addNew = true"
        >
          + Adaugă un câmp
        </v-btn>

        <div v-if="addNew">
          <FormulateForm v-model="kpiToAdd" :schema="kpiShemaToAdd">
            <div class="d-flex mt-2">
              <v-btn
                small
                color="secondary"
                @click="addNew = false"
              >
                Închide
              </v-btn>

              <v-btn
                type="submit"
                small
                class="ml-2"
                color="primary"
                :loading="loading"
                @click="addNewKpi"
              >
                Adaugă
              </v-btn>
            </div>
          </FormulateForm>
        </div>

        <div v-else>
          <div v-if="surveyKpiSchema.length">
            <FormulateForm v-model="newKpiValues" :schema="surveyKpiSchema">
              <v-btn
                type="submit"
                small
                class="mt-2"
                color="primary"
                :loading="loading"
                @click="saveKpi"
              >
                Salvează
              </v-btn>
            </FormulateForm>
          </div>
          <div v-else>Nu a fost adăugat nici un câmp</div>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { getSurveyResponseById, updateSurveyResponseById } from "../../services";

export default {
  props: {
    kpiValues: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => {
    return {
      menu: false,
      kpiToAdd: {},
      addNew: false,
      newKpiValues: {},
      loading: false,
      kpiShemaToAdd: [
        {
          "label": "Denumire câmp",
          "name": "label",
          "help": "Denumirea trebuie să fie unică",
          "validation": "required"
        }
      ]
    };
  },
  computed: {
    selectedRow() {
      return this.$store.getters.GET_SELECTED_ROW;
    },
    surveyKpiSchema() {
      return this.$store.getters.GET_SURVEY?.settings?.kpiSchema || [];
    },
    surveyId() {
      return this.$route.params.surveyId
    }
  },
  watch: {
    kpiValues: {
      handler(val) {
        this.newKpiValues = val ?? {};
      },
      immediate: true
    }
  },
  methods: {
    async addNewKpi() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;
        this.kpiToAdd.name = `kpi__${this.kpiToAdd.label.replace(/\W+/g, '_').toLocaleLowerCase()}`;

        const kpiExists = this.surveyKpiSchema.some(s => s.name === this.kpiToAdd.name);
        if (kpiExists) {
          this.loading = false;
          alert('Acest indicator deja există');
          return;
        }
        const settings = this.$store.getters.GET_SURVEY.settings;

        if (settings.hasOwnProperty('kpiSchema')) {
          settings.kpiSchema.push(this.kpiToAdd);
        } else {
          settings.kpiSchema = [this.kpiToAdd];
        }

        await this.$store.dispatch('UPDATE_SURVEY_SETTINGS', {
          surveyId: this.surveyId,
          settings: settings
        });
        this.$notify({
          group: 'success',
          text: `👌 Succes!`,
          duration: 1500
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    async saveKpi() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;
        const { data: response } = await getSurveyResponseById(this.selectedRow._id);

        if (!response.hasOwnProperty('_kpi')) {
          response._kpi = {}
        }

        Object.entries(this.newKpiValues).forEach(([key, value]) => {
          response._kpi[key] = value;
        });

        const resUpdate = await updateSurveyResponseById(this.selectedRow._id, response);

        if (resUpdate?.data?.updated) {
          await this.$store.dispatch('FETCH_SURVEY_ROW_RESPONSE', {
            surveyId: this.surveyId,
            rowId: this.selectedRow._id,
            rowIndex: this.selectedRow._index
          });

          this.$notify({
            group: 'success',
            text: `👌 Succes!`,
            duration: 1500
          });
        } else {
          this.$notify({
            group: 'warn',
            text: 'Eroare la editare',
            duration: 1500
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-expansion-panel-header, .v-expansion-panel-header--active {
  padding: 5px 12px !important;
  min-height: 36px;
}

::v-deep .v-expansion-panel--active > .v-expansion-panel-header {
  padding: 5px 12px !important;
  min-height: 36px;
}

::v-deep .v-expansion-panel {
  border: 1px solid #cecece;

  &::before {
    box-shadow: unset !important;
  }
}

::v-deep .v-expansion-panel-content__wrap {
  padding: 0 12px 16px !important;
}

::v-deep .formulate-input {
  margin-bottom: 0 !important;
}
</style>
