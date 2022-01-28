<template>
  <AppDialogWidget
    max-width="1000"
    icon="mdi-cog"
    tooltip="Setări formular"
    title="Setări formular"
    :scrollable="true"
    :show="false"
  >
    <div class="d-flex flex-column">
      <AppAceJsonEditor
        :value="surveySettings"
        @change="handleSettingsChange"
      />

      <div class="pa-2 d-flex justify-end">
        <v-btn
          class="ml-2"
          small
          depressed
          color="primary"
          :loading="loading"
          :disabled="!validJson"
          @click="submitHandler"
        >
          Salvează
        </v-btn>
      </div>
    </div>
  </AppDialogWidget>
</template>

<script>
import AppDialogWidget from '../widgets/app-dialog-widget.vue';
import AppAceJsonEditor from '../widgets/app-ace-json-editor.vue';

export default {
  components: {
    AppDialogWidget,
    AppAceJsonEditor
  },
  data() {
    return {
      loading: false,
      validJson: true,
      newSurveySettigs: {}
    };
  },
  computed: {
    surveySettings() {
      return this.$store.getters.GET_SURVEY.settings;
    },
    surveyId() {
      return this.$store.getters.GET_SURVEY.id;
    }
  },
  methods: {
    async submitHandler() {
      if (this.loading) {
        return;
      }

      try {
        this.loading = true;
        await this.$store.dispatch('UPDATE_SURVEY_SETTINGS', {
          surveyId: this.surveyId,
          settings: this.newSurveySettigs
        })

        this.$notify({
          group: 'success',
          text: `👌 Succes!`,
          duration: 2500
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    handleSettingsChange(value) {
      try {
        this.newSurveySettigs = JSON.parse(value);
        this.validJson = true;
      } catch (error) {
        this.validJson = false;
      }
    }
  }
};
</script>
