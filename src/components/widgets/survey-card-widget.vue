<template>
  <v-card
    width="300"
    elevation="2"
    :loading="isLoading"
    loader-height="5"
  >
    <v-img
      :src="survey.settings.image"
      height="200px"
      contain
      @load="isLoading = false"
    />
    <v-card-title>{{ survey.settings.shortName }}</v-card-title>
    <v-card-subtitle class="">
      Înregistrări: {{ survey.submitedCount }}
    </v-card-subtitle>

    <v-card-actions>
      <v-btn
        color="primary"
        text
        @click="viewData"
      >
        Deschide
      </v-btn>
      <v-spacer />
      <v-icon
        color="primary"
        @click="goTo"
      >
        mdi-open-in-new
      </v-icon>
      <a
        :id="survey.settings.shortName"
        :href="survey.settings.url"
        hidden
        target="_blank"
      />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    survey: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      isLoading: true
    };
  },
  beforeMount() {
    this.isLoading = true;
  },
  methods: {
    goTo() {
      document.getElementById(this.survey.settings.shortName).click();
    },
    viewData() {
      this.$router.push('/' + this.survey.id);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-card:hover {
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2),
    0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12) !important;
}
</style>
