<template>
  <div class="window">
    <WindowToolbarWidget
      :close-icon="true"
      :loading="loading"
      close-icon-position="left"
      @close="close"
    >
      <template>
        <v-chip
          v-if="currentFormResponse.response"
          color="primary"
          class="pointer"
          small
          @click="buildReport"
        >
          <span>PDF</span>
          <v-icon
            class="ml-1"
            color="white"
            size="15"
          >
            mdi-download
          </v-icon>
        </v-chip>
      </template>
    </WindowToolbarWidget>
    <Tabs @change="changeTab" />

    <v-card flat>
      <v-card-text class="pa-2">
        <ResponseTabScope
          v-if="$store.getters.GET_CURRENT_EVAL_TAB.scope === 'response'"
          :response="tabRes"
        />

        <div v-else>
          <AuthorsTab v-if="$store.getters.GET_CURRENT_EVAL_TAB_RESPONSES.length && currentEvalForm.meta.multipleSubmits" />
          <ResponseControls
            v-if="canEditResponseAsNew"
            class="mt-2"
            @save="submitForm(true)"
          />

          <div class="mt-2 overflow-auto">
            <v-skeleton-loader
              v-if="$store.getters.GET_VIEW_MODE === ''"
              type="card-avatar, article, actions"
              boilerplate
            />
            <ReadMode v-if="$store.getters.GET_VIEW_MODE === 'read'" />
            <EditMode
              v-if="$store.getters.GET_VIEW_MODE === 'edit'"
              class="pa-2"
              @submit="submitForm($event)"
            />
            <CopyMode
              v-if="$store.getters.GET_VIEW_MODE === 'copy' && currentEvalForm.meta.multipleSubmits"
              @submit="submitForm($event)"
            />
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { omit } from 'lodash';
import { saveAs } from 'file-saver';

import Tabs from './tabs';
import AuthorsTab from './authors-tab';
import ReadMode from './read-mode';
import EditMode from './edit-mode';
import CopyMode from './copy-mode';
import ResponseControls from './response-controls';
import ResponseTabScope from './response-tab-scope';
import { WindowToolbarWidget } from '~widgets';

import { mainApi } from '../../api-instances';
import { removeHtmlTags } from '~shared/utils';
import { submitResponse, buildEvalFormResponseReport } from '../../services/evalForm';

export default {
  components: {
    ResponseControls,
    ResponseTabScope,
    WindowToolbarWidget,
    AuthorsTab,
    EditMode,
    ReadMode,
    CopyMode,
    Tabs
  },
  data() {
    return {
      loading: false,
      viewMode: 'read',
      tabRes: {}
    };
  },
  computed: {
    currentEvalForm() {
      return this.$store.getters.GET_CURRENT_EVAL_TAB;
    },
    surveyId() {
      return this.$route.params.surveyId
    },
    selectedRow() {
      return this.$store.getters.GET_SELECTED_ROW;
    },
    canEditResponseAsNew() {
      const isNote = this.currentEvalForm.scope === 'note';
      const currResponse = this.$store.getters.GET_CURRENT_EVAL_TAB_RESPONSE;
      const editRight = this.$store.getters.USER_CAN_EDIT_RESPONSE_AS_NEW;
      const resAlready = !!currResponse.response;
      const canCopy = !!currResponse.can_copy;

      return !isNote && editRight && resAlready && canCopy && this.$store.getters.GET_VIEW_MODE !== 'copy';
    },
    currentFormResponse() {
      return this.$store.getters.GET_CURRENT_EVAL_TAB_RESPONSE
    }
  },
  watch: {
    '$route.params.rowId': {
      handler: async function () {
        this.loading = true;

        if (this.currentEvalForm.scope === 'response') {
          await this.fetchChildFormResponse();
        } else {
          await this.fetchTabResponses();
        }

        this.loading = false;
      },
      deep: true,
      immediate: false
    }
  },
  async beforeMount() {
    this.loading = true;
    await this.$store.dispatch('FETCH_TABS', this.surveyId);
    this.loading = false;
  },
  created() {
    window.addEventListener('beforeunload', event => {
      event.preventDefault();
      if (localStorage.getItem('changed') === 'true') {
        event.returnValue = '';
      }
    });
  },
  beforeDestroy() {
    this.$store.commit('RESET_EVAL_STATE_TO_DEFAULT');
  },
  methods: {
    close() {
      if (localStorage.getItem('changed') === 'true') {
        this.$dialog
          .confirm({
            title: 'Atenție',
            body:
              'Au fost făcute modificări, iar datele nu au fost salvat, sigur doriți să închideți'
          })
          .then(() => {
            this.hideEvalModeFromQuery();
            localStorage.setItem('changed', 'false');
          })
          .catch(() => {
            localStorage.setItem('changed', 'true');
          });
      } else {
        this.hideEvalModeFromQuery();
        localStorage.setItem('changed', 'false');
      }
    },
    async submitForm(isCopy) {
      try {
        this.loading = true;
        const inputValues = this.$store.getters.GET_EVAL_FORM_INPUT_VALUES;
        const schema = this.currentEvalForm.schema;

        const preRes = this.currentEvalForm.meta.score
          ? Object.entries(inputValues).map(([label, value]) => {
            const itemSchema = schema.filter(k => k.name === label)[0];
            let score = false;

            const itemSchemaCases = {
              select: () => {
                if ('altScore' in itemSchema) {
                  score = +inputValues[itemSchema.altScore];
                } else {
                  score = +itemSchema.options.filter(
                    o => o.label === value
                  )[0].score;
                }
              },
              number: () => {
                score = +value;
              },
              checkbox: () => {
                score = value.reduce((acc, curr) => {
                  const sc = itemSchema.options.filter(
                    o => o.label === curr
                  )[0];
                  return acc + +sc.score;
                }, 0);
              }
            }

            if (itemSchemaCases.hasOwnProperty(itemSchema.type)) {
              itemSchemaCases[itemSchema.type]();
            }

            return { score, label, value };
          })
          : Object.entries(inputValues).map(([label, value]) => {
            return { label, value };
          });

        const { data } = await submitResponse({
          surveyResponseId: this.$store.getters.GET_SELECTED_ROW._id,
          evalFormId: this.currentEvalForm.id,
          scope: this.currentEvalForm.scope,
          response: preRes,
          canCopy: this.currentEvalForm.scope === 'note' ? false : !isCopy
        });

        !isCopy
          ? this.$store.commit('SET_CURRENT_EVAL_TAB_RESPONSES', [data])
          : this.$store.commit('SET_CURRENT_EVAL_TAB_RESPONSES', [
            ...this.$store.getters.GET_CURRENT_EVAL_TAB_RESPONSES,
            data
          ]);

        this.$store.commit('SET_CURRENT_EVAL_TAB_RESPONSE', 0);
        this.$store.commit('UPDATE_VIEW_MODE', 'read');

        await this.$store.dispatch('FETCH_SURVEY_ROW_RESPONSE', {
          rowIndex: this.selectedRow._index,
          rowId: this.$route.params.rowId,
          surveyId: this.surveyId
        });
        localStorage.setItem('changed', 'false');
      } catch (error) {
        console.error(error);
      } finally {
        this.loading = false;
        this.$notify({
          group: 'success',
          text: `👌 Succes!`,
          duration: 1500
        });
      }
    },
    async changeTab(nr) {
      this.loading = true;
      this.$store.commit('RESET_CURRENT_EVAL_TAB_RESPONSES');
      this.$store.commit('SET_CURRENT_EVAL_TAB', nr);

      if (this.currentEvalForm.scope === 'response') {
        await this.fetchChildFormResponse();
      } else {
        await this.fetchTabResponses();
      }

      this.loading = false;
    },
    async fetchTabResponses() {
      this.$store.commit('RESET_CURRENT_EVAL_TAB_RESPONSES');
      await this.$store.dispatch('FETCH_CURRENT_TAB_RESPONSES', this.$route.params.rowId);
      this.$store.commit('RESET_VIEW_MODE');
      this.$store.commit('SET_VIEW_MODE');
    },
    async fetchChildFormResponse() {
      this.tabRes = {};
      const { data } = await mainApi.get('api/surveys/child/response', {
        params: {
          surveyId: this.currentEvalForm.id,
          idno: removeHtmlTags(this.$store.getters.GET_SELECTED_ROW.idno)
        }
      });
      this.tabRes = JSON.parse(data);
    },
    hideEvalModeFromQuery() {
      const params = this.$route.params;

      this.$router.push({
        name: 'FormView',
        params,
        query: {
          ...omit(this.$route.query, ['mode'])
        }
      });
    },
    async buildReport() {
      try {
        this.loading = true;
        const { id } = this.currentFormResponse;
        const { data } = await buildEvalFormResponseReport(id);

        const name = this.currentEvalForm.meta.name;
        const rowId = this.$store.getters.GET_SELECTED_ROW._id;

        saveAs(data, `${rowId} ${name}.pdf`);
      } catch (e) {
        console.error(e);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.overflow-auto {
  height: calc(100vh - 252px);
  overflow-y: auto !important;
}

.overflow-auto-2 {
  height: calc(100vh - 160px);
  overflow-y: auto !important;
}

::v-deep .formulate-input-element {
  overflow: unset !important;
  max-width: 100%;
}

::v-deep .formulate-input .formulate-input-element {
  max-width: 100% !important;
}

::v-deep
  .formulate-input[data-classification='box']
  .formulate-input-element
  input[type='checkbox']:checked
  ~ .formulate-input-element-decorator::before {
  background-color: aliceblue !important;
}

::v-deep
  .formulate-input[data-classification='box']
  .formulate-input-element
  input[type='checkbox']:checked
  ~ .formulate-input-element-decorator {
  background-color: #018053 !important;
}

::v-deep .formulate-input {
  width: 100% !important;
}

::v-deep .formulate-form {
  padding-top: 10px !important;
}

.window {
  display: flex;
  flex-direction: column;
  border-left: 1px solid #b9b9b9;
  border-radius: 0;
  min-width: 30%;
  max-width: 30%;
  padding: 0 !important;
}

.pointer {
  cursor: pointer !important;
}
</style>
