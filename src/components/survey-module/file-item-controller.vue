<template>
  <div class="my-1 d-flex flex-1 justify-space-between">
    <div>
      <v-icon class="pointer" :color="file.color">
        {{ file.icon }}
      </v-icon>

      <a
        class="ml-1"
        :href="getPreviewUrl(file.name)"
        title="Vezi"
        target="_blank"
        rel="noopener noreferrer"
        data-title="A new page"
      >
        <v-icon class="pointer" color="primary">mdi-eye-outline</v-icon>
      </a>

      <a
        :href="getDownloadLink(file.name)"
        title="Descarcă"
        target="_blank"
        rel="noopener noreferrer"
        data-title="A new page"
      >
        <v-icon class="pointer" color="primary">mdi-download</v-icon>
      </a>

      <span class="mb-1 ml-2 caption" :title="file.name">
        {{ file.name }}
      </span>
    </div>

    <v-icon
      v-if="$store.getters.USER_CAN_DELETE_FILES"
      class="pointer pr-2"
      title="Șterge"
      color="accent"
      @click="promtFileDelete(file.name)"
    >
      mdi-delete-forever
    </v-icon>
  </div>
</template>

<script>
import { mainApi } from '../../api-instances';

export default {
  filters: {
    fileType(filename) {
      return filename.split('.').pop();
    }
  },
  props: {
    file: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  computed: {
    selectedRow() {
      return this.$store.getters.GET_SELECTED_ROW;
    },
    token() {
      return this.$cookies.get('token');
    },
    surveyId() {
      return this.$store.getters.GET_SURVEY.id
    }
  },
  methods: {
    getPreviewUrl(name) {
      return mainApi.defaults.baseURL + '/storage/preview/' +
        this.surveyId + '/' + this.selectedRow._id + '/' +
        name + '?token=' + this.token;
    },
    getDownloadLink(name) {
      return mainApi.defaults.baseURL + '/storage/download/' +
        this.surveyId + '/' + this.selectedRow._id + '/' +
        name + '?token=' + this.token;
    },
    promtFileDelete(name) {
      this.$dialog
        .confirm({
          title: 'Atenție',
          body: 'Sigur doriți să ștergeți: <b>' + name + '</b>'
        })
        .then(async () => {
          await this.deleteFile(name);
        })
        .catch(() => {});
    },
    async deleteFile(name) {
      try {
        await this.$store.dispatch('DELETE_CURRENT_SURVEY_RESPONSE_FILE', name);

        this.$notify({
          group: 'success',
          text: `👌 Succes!`,
          duration: 1000
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.filesLoaded = true;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}
</style>
