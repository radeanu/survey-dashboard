<template>
  <div class="d-flex">
    <v-progress-circular
      v-if="loading"
      class="d-block ma-auto"
      color="actioncolor"
      indeterminate
      size="20"
    />

    <v-icon
      v-else
      title="Exportă datele"
      color="actioncolor"
      raised
      :ripple="false"
      @click="downloadData"
    >
      mdi-table-arrow-down
    </v-icon>
  </div>
</template>

<script>
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { getSurveyResponsesForExport } from "../../services/survey";

export default {
  data() {
    return {
      loading: false
    };
  },
  methods: {
    async downloadData() {
      try {
        this.loading = true;
        const responses = await getSurveyResponsesForExport(this.$route.params.surveyId);
        const cols = Object.keys(responses.data[0]);
        const rows = responses.data.map(r => Object.values(r));

        const worksheet = XLSX.utils.aoa_to_sheet([cols, ...rows]);
        const workbook = {
          Sheets: {
            data: worksheet
          },
          SheetNames: ['data']
        };
        const excelBuffer = XLSX.write(workbook, {
          bookType: 'xlsx',
          type: 'array'
        });

        const blob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });

        saveAs(blob, `${this.$store.getters.GET_SURVEY.settings.name}.xlsx`);
        this.$notify({
          group: 'success',
          text: `👌 Succes!`,
          duration: 1500
        });
      } catch (error) {
        console.error(error);
        this.$notify({
          group: 'error',
          text: '🤷‍♂️ Eroare!'
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  flex-direction: column;
  max-height: 500px;
}

.v-input--selection-controls {
  margin: 0;
  padding: 0;
}

.formulate-input-label {
  cursor: pointer !important;
}

.radio-options,
.formulate-input-group-item,
.formulate-input {
  margin: 0 !important;
}

.option-item {
  max-width: 250px !important;
  width: 250px !important;
  margin: 0 !important;
}

.option {
  max-width: 250px !important;
  width: 250px !important;
}

.formulate-input-group-repeatable-remove,
.formulate-input[data-classification='group'],
a {
  top: 0 !important;
}

.table-export {
  overflow-y: visible;
  padding: 10px;
  max-height: 400px;
  overflow: auto;
}

.mx-auto {
  width: 100%;
  overflow: hidden;
}

.settings {
  height: 90%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

form {
  width: 300px;
}

option {
  max-width: 250px !important;
}
</style>
