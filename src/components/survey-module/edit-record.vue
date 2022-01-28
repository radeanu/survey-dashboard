<template>
  <AppDialogWidget
    max-width="1000"
    icon="mdi-file-edit"
    icon-color="info darken-2"
    tooltip="Editează"
    title="Editează"
    :scrollable="true"
    :show="false"
    :persistent="true"
    :loading="loadingResponse"
    @open="fetchResponse"
    @close="handleClose"
  >
    <template #default>
      <div class="d-flex flex-column">
        <AppAceJsonEditor
          v-if="!loadingResponse"
          id="edit-record"
          :value="response"
          @change="handleChange"
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
    </template>
  </AppDialogWidget>
</template>

<script>
import AppDialogWidget from '../widgets/app-dialog-widget.vue';
import AppAceJsonEditor from '../widgets/app-ace-json-editor.vue';

import { getSurveyResponseById, updateSurveyResponseById } from "../../services";

export default {
  components: {
    AppDialogWidget,
    AppAceJsonEditor
  },
  data() {
    return {
      newRes: {},
      response: {},
      loading: false,
      validJson: false,
      loadingResponse: true,
    };
  },
  computed: {
    surveyId() {
      return this.$route.params.surveyId
    },
    selectedRow() {
      return this.$store.getters.GET_SELECTED_ROW;
    },
  },
  methods: {
    handleChange(val) {
      try {
        this.newRes = JSON.parse(val);
        this.validJson = true;
      } catch (e) {
        this.validJson = false;
      }
    },
    handleClose() {
      this.newRes = {};
      this.response = {};
    },
    async fetchResponse() {
      try {
        this.loadingResponse = true;
        const res = await getSurveyResponseById(this.selectedRow._id);
        this.response = res.data;
      } catch (e) {
        console.error('FAILED: getSurveyResponseById()');
      } finally {
        this.loadingResponse = false;
      }
    },
    async submitHandler() {
      if (!Object.keys(this.newRes).length) {
        return;
      }

      try {
        const { data } = await updateSurveyResponseById(this.selectedRow._id, this.newRes);

        if (data.updated) {
          await this.$store.dispatch('FETCH_SURVEY_ROW_RESPONSE', {
            surveyId: this.surveyId,
            rowId: this.selectedRow._id,
            rowIndex: this.selectedRow._index,
          });

          this.$emit("update-preview");
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

        await this.$store.dispatch('FETCH_SURVEY_ROW_RESPONSE', {
          surveyId: this.surveyId,
          rowId: this.selectedRow._id,
          rowIndex: this.selectedRow._index,
        });
        this.display = false;
      } catch (e) {
        this.$notify({
          group: 'error',
          text: `${e.message ? e.message : '🤷‍♂️ Eroare!'}`,
          duration: 1500
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card__subtitle,
.v-card__title {
  padding: 10px 12px !important;
  font-size: 1.2em !important;
  font-weight: 300;
}

::v-deep textarea {
  height: 60vh !important;
}
</style>
