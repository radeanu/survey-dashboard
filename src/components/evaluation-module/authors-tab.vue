<template>
  <v-slide-group
    class="gap-5"
    show-arrows
    mandatory
    @change="changeTab($event)"
  >
    <v-slide-item
      v-for="(response, index) in $store.getters.GET_CURRENT_EVAL_TAB_RESPONSES"
      :key="'Aut' + index"
      v-slot="{active, toggle}"
    >
      <v-chip
        class="pa-3"
        :input-value="active"
        :class="active ? 'tab__active' : ''"
        :ripple="false"
        @click="toggle"
      >
        <v-tooltip bottom>
          <template #activator="{on, attrs}">
            <v-icon
              v-bind="attrs"
              :color="userRolesColor[response.authoreRole]"
              class="shorten"
              v-on="on"
            >
              {{ getFirstLetterIcon(response.authoreRole) }}
            </v-icon>
          </template>
          <span>{{ response.created_at }}</span>
        </v-tooltip>
        <span class="ml-2">
          {{ response.author }}
        </span>
        <span
          v-if="response.score"
          class="pl-2"
        >{{
          response.score
        }}</span>
      </v-chip>
    </v-slide-item>
  </v-slide-group>
</template>

<script>
export default {
  data() {
    return {
      userRolesColor: {
        admin: '#ff0000',
        executor: '#0025ff',
        committee: '#c68e00',
        manager: '#018053'
      }
    };
  },
  beforeDestroy() {
    this.$store.commit('RESET_CURRENT_EVAL_TAB_RESPONSE');
  },
  methods: {
    changeTab(nr) {
      this.$store.commit('SET_CURRENT_EVAL_TAB_RESPONSE', nr);
      this.$store.commit('SET_VIEW_MODE');
    },
    getFirstLetterIcon(str) {
      return 'mdi-alpha-' + str[0] + '-circle-outline';
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .v-tooltip,
.v-tooltip__content {
  padding: 5px !important;
  background-color: black !important;
}

::v-deep .v-slide-group__content {
  gap: 10px;
}

.tab__active {
  background-color: var(--v-primary-base);
  color: aliceblue;
}

.shorten {
  background-color: white !important;
  border-radius: 100% !important;
}
</style>
