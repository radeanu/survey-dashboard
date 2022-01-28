<template>
  <v-slide-group
    show-arrows
    mandatory
    @change="$emit('change', $event)"
  >
    <v-slide-item
      v-for="(tab, index) in evaluationTabs"
      :key="'Tab' + index"
      v-slot="{active, toggle}"
    >
      <v-btn
        class="mx-1"
        :input-value="active"
        :class="active ? 'active-tab' : ''"
        :ripple="false"
        text
        @click="toggle"
      >
        {{ tab.meta.name }}
        <v-chip
          v-if="+selectedRow[tab.meta.value] > 0 && tab.meta.score"
          color="primary"
          class="ml-2 pa-1"
          x-small
        >
          {{ selectedRow[tab.meta.value] }}
        </v-chip>
      </v-btn>
    </v-slide-item>
  </v-slide-group>
</template>

<script>
import { evalForm } from '~shared/types';
const { evalDescription } = evalForm;

export default {
  data() {
    return {
      evalDescription
    };
  },
  computed: {
    evaluationTabs() {
      return this.$store.getters.GET_EVAL_TABS
    },
    selectedRow() {
      return this.$store.getters.GET_SELECTED_ROW;
    }
  },
};
</script>

<style lang="scss" scoped>
.active-tab {
  background: none;
  border-radius: 0;
  border-bottom: 2px solid var(--v-primary-base);
}
</style>
