<template>
  <div class="d-flex gap-10 w-full">
    <template v-if="currEvalTab.meta.multipleSubmits">
      <div class="d-flex justify-center w-full">
        <v-btn
          small
          block
          elevation="0"
          color="primary"
          :ripple="false"
          @click="$emit('save', true)"
        >
          <span v-if="mediumWidth">Acceptă</span>
          <v-icon class="ml-2">
            mdi-check
          </v-icon>
        </v-btn>
      </div>
      <div class="d-flex justify-center w-full">
        <v-btn
          elevation="0"
          small
          block
          color="accent"
          :ripple="false"
          @click="$store.commit('UPDATE_VIEW_MODE', 'copy')"
        >
          <span v-if="mediumWidth">Editează ca nou</span>
          <v-icon class="ml-2">mdi-content-save-edit</v-icon>
        </v-btn>
      </div>
    </template>
    <div class="d-flex justify-center w-full">
      <v-btn
        elevation="0"
        small
        block
        color="info"
        :ripple="false"
        @click="$store.commit('UPDATE_VIEW_MODE', 'edit')"
      >
        <span v-if="mediumWidth">Editează</span>
        <v-icon class="ml-2">mdi-pencil</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      windowWidth: window.innerWidth
    };
  },
  computed: {
    currEvalTab() {
      return this.$store.getters.GET_CURRENT_EVAL_TAB
    },
    mediumWidth() {
      return this.windowWidth > 1600
    }
  },
  created() {
    window.addEventListener('resize', this.onResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    }
  }
};
</script>

<style lang="scss" scoped></style>
