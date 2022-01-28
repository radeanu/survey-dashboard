<template>
  <div
    class="menu-items"
    :class="closeIconPosition === 'left' ? 'flex-row' : 'flex-row-reverse'"
  >
    <v-icon
      class="pointer"
      color="accent"
      title="Închide"
      @click="$emit('close', true)"
    >
      mdi-close
    </v-icon>

    <div class="actions">
      <slot />
      <v-spacer />
      <slot name="right" />
      <v-progress-circular
        v-if="loading"
        class="d-block ma-auto mr-0"
        color="primary"
        indeterminate
        size="20"
      />
    </div>
    <div
      v-if="itemIterator.display"
      class="align-center d-flex flex-nowrap gap-10 justify-end pr-2"
    >
      <v-icon
        class="pointer"
        color="black"
        title="Precedent"
        @click="$emit('previous', true)"
      >
        mdi-chevron-left
      </v-icon>
      <span class="max-width">{{ itemIterator.current }} -
        {{ itemIterator.total }}</span>
      <v-icon
        class="pointer"
        color="black"
        title="Următorul"
        @click="$emit('next', true)"
      >
        mdi-chevron-right
      </v-icon>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    closeIcon: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    closeIconPosition: {
      type: String,
      default: () => {
        return 'right';
      }
    },
    itemIterator: {
      type: Object,
      default: () => {
        return {
          display: false,
          current: 0,
          total: 0
        };
      }
    },
    loading: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data: () => {
    return {
      checkDossier: false
    };
  },
  watch: {
    itemIterator(newVal) {
      return newVal
    }
  },
  beforeMount() {
    const { rights } = this.$store.getters.GET_USER;
    this.checkDossier = rights.canCheckDossier;
  }
};
</script>

<style lang="scss" scoped>
.menu-items {
  display: flex;
  height: 30px;
  width: 100%;
  border-bottom: 1px solid #e0e0e0;
  background-color: #f1f1f1;
  gap: 5px;
  padding: 0 5px;
}

.actions {
  display: flex;
  gap: 10px;
  padding-left: 10px;
  width: 100%;
  align-self: center;
  align-items: center;
}

.max-width {
  width: max-content;
}
</style>
