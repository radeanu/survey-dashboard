<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="window">
    <WindowToolbarWidget
      :close-icon="true"
      :item-iterator="{
        display: true,
        current: selectedRow._index,
        total: $store.getters.GET_SURVEY_ROWS_LENGTH
      }"
      :loading="loading"
      close-icon-position="left"
      @close="close"
      @previous="nextRow(-1)"
      @next="nextRow(1)"
    >
      <v-tooltip top>
        <template #activator="{on, attrs}">
          <v-icon
            v-if="$store.getters.GET_USER_EVAL_ACTION_RIGHTS"
            v-bind="attrs"
            class="pointer"
            color="info darken-2"
            v-on="on"
            @click="pushEvalModeToRouteQuery"
          >
            mdi-comment-account
          </v-icon>
        </template>
        <span>Modul de evaluare</span>
      </v-tooltip>

      <ResponseItemStatus v-if="$store.getters.USER_CAN_CHANGE_RECORD_SETTINGS" />

      <template #right>
        <v-tooltip bottom>
          <template #activator="{on, attrs}">
            <v-icon
              v-bind="attrs"
              class="pointer"
              color="accent lighten-2"
              v-on="on"
              @click="syncPDFReport"
            >
              mdi-file-sync
            </v-icon>
          </template>
          <span>Actualizează raportul PDF</span>
        </v-tooltip>

        <EditRecord @update-preview="getPreviewContent" />
      </template>
    </WindowToolbarWidget>

    <div class="window-content">
      <div v-if="contentLoading">Loading...</div>
      <div v-else class="d-flex flex-column h-full">
        <ResponseKpi :kpi-values="selectedRow._kpi" />
        <div class="pb-2 flex-1" v-html="compiledPreview" />
        <v-divider />
        <template v-if="hasAttachments">
          <div>
            <div class="d-flex gap-10 align-center my-2">
              <b>Anexele</b>
              <UploadFileWidget
                v-if="$store.getters.USER_CAN_UPLOAD_FILES"
                :target-api-url="surveyUploadApiUrl"
                @start="fetchingFiles = true"
                @success="onFileUpload"
              />
            </div>
            <v-progress-linear
              v-if="fetchingFiles"
              class="d-block my-1"
              color="primary"
              indeterminate
              size="20"
            />
          </div>

          <div
            v-for="(fileInput, index) in selectedRow.uploadedFiles"
            :key="index + '_' + fileInput.label"
            class="files-list"
          >
            <div class="d-flex flex-column pa-1 flex-1">
              <div v-if="fileInput.label" class="subtitle-2">
                <b>{{ index + 1 + ': ' }}</b>
                <span class="response-title">
                  {{ fileInput.label }}
                </span>
              </div>

              <div v-if="fileInput.files" class="flex-1">
                <div
                  v-for="(f, i) in fileInput.files"
                  :key="'file_' + i"
                  class="flex-1"
                >
                  <FileItemController :file="f" />
                </div>
              </div>
              <div v-else>
                <FileItemController :file="fileInput" />
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { isEqual } from 'lodash';
import { mainApi } from '../../api-instances';
import {
  WindowToolbarWidget,
  UploadFileWidget
} from '../widgets';

import EditRecord from './edit-record.vue';
import ResponseItemStatus from './response-item-status';
import FileItemController from './file-item-controller.vue';
import ResponseKpi from './response-kpi.vue';

import { updateSurveyResponsePdfReport, getSurveyResponsesCompiledPreview } from "../../services/survey";

export default {
  components: {
    EditRecord,
    ResponseKpi,
    UploadFileWidget,
    FileItemController,
    ResponseItemStatus,
    WindowToolbarWidget,
  },
  data() {
    return {
      loading: false,
      compiledPreview: "",
      fetchingFiles: false,
      contentLoading: false,
    };
  },
  computed: {
    selectedRow() {
      return this.$store.getters.GET_SELECTED_ROW;
    },
    surveyId() {
      return this.$store.getters.GET_SURVEY.id;
    },
    surveyUploadApiUrl() {
      return `${mainApi.defaults.baseURL}/storage/manage/add/${this.surveyId}/${this.selectedRow._id}`;
    },
    hasAttachments() {
      return this.selectedRow?.uploadedFiles?.length
    }
  },
  watch: {
    async selectedRow() {
      await this.getPreviewContent();
    }
  },
  async beforeMount() {
    await this.getPreviewContent();
  },
  methods: {
    async onFileUpload() {
      this.fetchingFiles = false;
      await this.$store.dispatch('FETCH_SURVEY_ROW_RESPONSE', {
        surveyId: this.surveyId,
        rowId: this.selectedRow._id,
        rowIndex: this.selectedRow._index,
      });
    },
    close() {
      if (localStorage.getItem('changed') === 'true') {
        this.$dialog
          .confirm({
            title: 'Atenție',
            body: 'Au fost făcute modificări, iar datele nu au fost salvat, sigur doriți să închideți'
          })
          .then(() => {
            this.unselectRow();
            localStorage.setItem('changed', 'false');
          })
          .catch(() => {
            localStorage.setItem('changed', 'true');
          });
      } else {
        this.unselectRow();
        localStorage.setItem('changed', 'false');
      }
    },
    getInputResponseLabel(key) {
      return this.columns.filter(({ value }) => value === key)[0].text;
    },
    nextRow(position) {
      if (localStorage.getItem('changed') === 'true') {
        this.$dialog
          .confirm({
            title: 'Atenție',
            body: 'Au fost făcute modificări, iar datele nu au fost salvat, sigur doriți să închideți'
          })
          .then(() => {
            this.$store.commit('MANAGE_CURRENT_SELECTED_ROW', next);
            localStorage.setItem('changed', 'false');
          })
          .catch(() => {
            localStorage.setItem('changed', 'true');
          });
      } else {
        this.$store.commit('MANAGE_CURRENT_SELECTED_ROW', position);
        localStorage.setItem('changed', 'false');
      }
    },
    pushEvalModeToRouteQuery() {
      const query = {
        ...this.$route.query,
        mode: 'eval'
      };

      if (!isEqual(this.$route.query, query)) {
        this.$router.push({ query });
      }
    },
    unselectRow() {
      const params = this.$route.params;
      const query = this.$route.query;
      delete params.rowId;
      delete query.mode;

      this.$router.push({
        name: 'FormView',
        params,
        query
      });
    },
    async syncPDFReport() {
      try {
        this.loading = true;
        const { data } = await updateSurveyResponsePdfReport(this.selectedRow._id);

        if (data.updated) {
          this.$notify({
            group: 'success',
            text: `👌 Succes!`,
            duration: 1500
          });
        } else {
          this.$notify({
            group: 'success',
            text: 'Template-ul lipsește',
            duration: 2500
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    async getPreviewContent() {
      try {
        this.contentLoading = true;
        const { data } = await getSurveyResponsesCompiledPreview({
          responseId: this.selectedRow._id,
          index: this.selectedRow._index,
          surveyId: this.surveyId,
        });
        this.compiledPreview = data;
      } catch (e) {
        console.error(e);
      } finally {
        this.contentLoading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.files-list {
  display: flex;
  gap: 10px;
  flex-wrap: nowrap;
  border-bottom: 1px solid #e0e0e0;

  &:hover {
    background-color: #f1f1f1;
  }
}

.window {
  display: flex;
  flex-direction: column;
  border-left: 1px solid #b9b9b9;
  border-radius: 0;
  padding: 0 !important;
  height: 100%;
  min-width: 600px;
  max-width: 600px;
}

.window-content {
  max-height: calc(100% - 30px);
  min-height: calc(100% - 30px);
  padding: 10px;
  overflow: auto;
}
</style>
