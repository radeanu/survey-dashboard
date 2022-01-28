<template>
  <div class="app-toolbar">
    <div class="app-toolbar-items">
      <div
        v-for="item in userMenuItems"
        :key="item.label"
        class="app-toolbar-item overline"
        :class="{
          'toolbar-item-active': $route.name === item.pathName
        }"
        @click="handleMenuClick(item.pathName)"
      >
        <v-icon color="primary">{{ item.icon }}</v-icon>
        <span class="ml-3">{{ item.label }}</span>
      </div>
    </div>

    <div class="d-flex gap-20">
      <v-chip
        v-if="suportBISource"
        color="orange"
        class="pointer subtitle-2"
        outlined
        small
        @click="showCharts"
      >
        <span class="pr-2 subtitle-1">Statistică</span>
        <v-icon
          class="pr-3"
          color="orange darken-2"
          size="20"
          right
        >
          mdi-chart-bar
        </v-icon>
      </v-chip>

      <AppUserRegistration v-if="$store.getters.GET_USER.rights.canRegisterNewUser" />

      <AppSettingsWidget />
    </div>
  </div>
</template>

<script>
import AppSettingsWidget from './widgets/app-settings-widget.vue';
import AppUserRegistration from './app-user-registration.vue';

export default {
  components: {
    AppUserRegistration,
    AppSettingsWidget,
  },
  data: () => {
    return {
      importSurveyDialog: false,
      menuItems: [
        {
          icon: 'mdi-home',
          label: 'Formularele',
          pathName: 'Dashboard',
        },
        // {
        //   icon: 'mdi-cogs',
        //   label: 'Administrare',
        //   pathName: 'SurveyAdmin',
        //   roles: ['admin']
        // }
      ]
    };
  },
  computed: {
    suportBISource() {
      return (
        this.$route.name === 'FormView' &&
        !!this.$store.getters.GET_SURVEY?.settings?.biSource
      );
    },
    route() {
      return this.$route
    },
    user() {
      return this.$store.getters.GET_USER;
    },
    userMenuItems() {
      return this.menuItems.filter(item => {
        if (item.hasOwnProperty('roles')) {
          return item.roles.includes(this.user.role)
        }

        return true;
      })
    }
  },
  methods: {
    showCharts() {
      this.$router.push(`/charts/${this.$route.params.surveyId}`);
    },
    handleMenuClick(name) {
      if (this.$route.name !== name) {
        this.$router.push({
          name
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.app-toolbar {
  display: flex;
  align-items: center;
  padding-inline: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.app-toolbar-items {
  display: flex;
  flex: 1;
}

.app-toolbar-item {
  font-size: 0.9em !important;
  cursor: pointer;
  align-items: center;
  padding-inline: 15px;
  display: flex;
  height: 55px;
  color: var(--v-primary-base);

  &:hover {
    background-color: #0180531a;
  }

  span {
    letter-spacing: 1px;
  }
}

.toolbar-item-active {
  border-bottom: 3px solid var(--v-primary-base);
}
</style>
