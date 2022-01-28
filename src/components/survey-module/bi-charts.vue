<template>
  <div class="full flex">
    <div class="flex flex-column pa-2 gap-10 custom-border">
      <v-tooltip right>
        <template #activator="{ on, attrs }">
          <v-icon
            class="pointer"
            color="actioncolor"
            raised
            :ripple="false"
            v-bind="attrs"
            v-on="on"
            @click="$router.go(-1)"
          >
            mdi-arrow-left
          </v-icon>
        </template>
        <span>Înapoi</span>
      </v-tooltip>

      <a v-if="biReportSource" :href="biReportSource" target="_blank">
        <v-tooltip right>
          <template #activator="{ on, attrs }">
            <v-icon
              color="actioncolor"
              class="pointer"
              :ripple="false"
              raised
              v-bind="attrs"
              v-on="on"
            >
              mdi-download
            </v-icon>
          </template>
          <span>Descarcă aplicația</span>
        </v-tooltip>
      </a>
    </div>

    <div class="full">
      <iframe :src="biSource" frameborder="0" allowfullscreen="true" />

      <div v-if="!suportBI && checked" class="full">
        <h3 class="red--text pa-5 text-center">
          Pentru acest formular nu a fost creat un raport în PowerBI
        </h3>
      </div>
    </div>
  </div>
</template>

<script>
import { getSurveyById } from '../../services';

export default {
  data() {
    return {
      biSource: '',
      biReportSource: '',
      suportBI: false,
      checked: false
    };
  },
  async beforeMount() {
    try {
      this.checked = false;
      const { data } = await getSurveyById(this.$route.params.surveyId);
      this.suportBI = !!data.settings.biSource;
      this.biSource = data.settings.biSource;
      this.biReportSource = data.settings.biReportSource;
    } catch (error) {
      console.error(error);
    } finally {
      this.checked = true;
    }
  }
};
</script>

<style lang="scss" scoped>
iframe {
  width: 100%;
  height: 100%;
}

.custom-border {
  border-right: 1px solid #e0e0e0;
}

a {
  text-decoration: none;
}
</style>
