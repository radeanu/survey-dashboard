<template>
  <v-menu
    v-model="menu"
    :close-on-click="true"
    :close-on-content-click="false"
    :nudge-width="200"
    elevation="0"
    offset-y
  >
    <template #activator="menu">
      <v-tooltip top>
        <template #activator="{ on, attrs }">
          <span
            v-bind="attrs"
            v-on="on"
          >
            <v-icon
              raised
              class="pointer"
              color="warning"
              :ripple="false"
              v-bind="menu.attrs"
              v-on="menu.on"
            >
              mdi-flag
            </v-icon>
          </span>
        </template>
        <span>Statutul dosarului</span>
      </v-tooltip>
    </template>

    <v-card class="py-2 px-3">
      <div class="d-flex gap-5">
        <span>Statut</span>
        <v-progress-circular
          v-if="loading"
          class="d-block ma-auto"
          color="primary"
          indeterminate
          :size="20"
        />
      </div>

      <div class="d-flex flex-column">
        <v-checkbox
          v-for="(status, i) in surveyStatuses"
          :key="'status_' + i"
          v-model="statuses"
          :label="status"
          :value="status"
          hide-details
          multiple
        />

        <div class="mt-2 d-flex justify-space-between">
          <v-btn
            text
            @click="menu = false"
          >
            Închide
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="setStatus"
          >
            Aplică
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-menu>
</template>

<script>
import { updateRecordStatus } from '../../services/survey';

export default {
  data: () => {
    return {
      statuses: [],
      loading: false,
      menu: false
    };
  },
  computed: {
    selectedRow() {
      return this.$store.getters.GET_SELECTED_ROW;
    },
    surveyStatuses() {
      return this.$store.getters.GET_SURVEY.settings?.statuses || [];
    }
  },
  watch: {
    'selectedRow._status': {
      handler(val) {
        this.statuses = val;
      },
      immediate: true
    }
  },
  methods: {
    async setStatus() {
      try {
        this.loading = true;
        const statuses = this.statuses.join('; ');
        await updateRecordStatus(statuses, this.selectedRow._id);

        await this.$store.dispatch('FETCH_SURVEY_ROW_RESPONSE', {
          rowId: this.selectedRow._id,
          rowIndex: this.selectedRow._index,
          surveyId: this.$route.params.surveyId,
        });

        this.$notify({
          group: 'success',
          text: `👌 Succes!`,
          duration: 1500
        });
      } catch (error) {
        console.error(error);
        this.$notify({
          group: 'error',
          text: '🤷‍♂️ Eroare!',
          duration: 1500
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn {
  padding: 0 !important;
}

.v-input--selection-controls {
  margin: 0;
}
</style>
