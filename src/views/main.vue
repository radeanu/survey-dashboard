<template>
  <v-app>
    <notifications
      v-for="(type, ind) in notificationTypes"
      :key="'not-' + ind"
      :group="type"
      position="top right"
      :classes="'notifications-' + type"
    />

    <AlertDialog v-if="$store.getters.SHOW_PROMT_DIALOG" />
    <AppToolbar />
    <router-view />
  </v-app>
</template>

<script>
import AppToolbar from '../components/app-toolbar.vue';

export default {
  components: {
    AppToolbar
  },
  data: () => {
    return {
      notificationTypes: ['success', 'error', 'warn']
    };
  },
  async beforeMount() {
    this.$store.commit('SET_PROMT_DIALOG', false);
    this.$store.commit('INIT_THEME');
  }
};
</script>

<style lang="scss">
.v-application {
  height: 100%;
  width: 100%;
}
</style>
