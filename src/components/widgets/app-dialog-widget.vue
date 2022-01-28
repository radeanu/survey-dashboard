<template>
  <div>
    <v-tooltip
      :bottom="tooltipPos === 'bottom'"
      :top="tooltipPos === 'top'"
    >
      <template #activator="{on, attrs}">
        <v-icon
          class="pointer"
          :color="iconColor ? iconColor : 'primary'"
          v-bind="attrs"
          v-on="on"
          @click="open"
        >
          {{ icon }}
        </v-icon>
      </template>
      <span>{{ tooltip }}</span>
    </v-tooltip>

    <v-dialog
      v-model="display"
      max-width="95vh"
      max-height="95vh"
      :scrollable="scrollable"
      :persistent="persistent"
    >
      <v-card
        v-if="display"
        max-height="98vh"
        class="overflow-h"
        elevation="0"
      >
        <v-card-title class="card-title-actions">
          <span class="headline">
            {{ title }}
          </span>
          <div
            class="icon-close"
            @click="close"
          >
            <v-icon
              color="accent"
              raised
              :ripple="false"
            >
              mdi-close
            </v-icon>
          </div>
        </v-card-title>

        <v-card-text class="pa-0">
          <v-skeleton-loader
            v-if="loading"
            class="mx-5"
            type="list-item-avatar-two-line, list-item-avatar-two-line, list-item-avatar-two-line"
          />
          <slot v-else />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: 'none'
    },
    maxWidth: {
      type: String,
      default: 'none'
    },
    maxHeight: {
      type: String,
      default: 'none'
    },
    icon: {
      required: true,
      type: String,
      default: 'mdi-checkbox-blank-circle'
    },
    iconColor: {
      type: String,
      default: 'mdi-checkbox-blank-circle'
    },
    tooltipPos: {
      type: String,
      default: 'bottom'
    },
    tooltip: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    persistent: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    scrollable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      display: this.show ? true : false
    };
  },

  methods: {
    close() {
      this.display = false
      this.$emit('close', true);
    },
    open() {
      this.display = true
      this.$emit('open', true);
    }
  },
};
</script>

<style lang="scss" scoped>
.v-card__subtitle,
.v-card__title {
  padding: 10px 12px !important;
  font-size: 1.2em !important;
  font-weight: 300;
}
</style>
