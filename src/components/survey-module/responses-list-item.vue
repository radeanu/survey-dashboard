<template>
  <div
    class="item__wrapper"
    :class="{
      'item__active': +$route.params.rowId === source._id
    }"
    @click="onItemClick(source, index)"
  >
    <div
      class="item__highlight"
      :style="itemStyle"
    />
    <div
      class="item__details"
      v-html="source._listTemplate"
    />
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: Number,
      default: 0
    },
    source: {
      type: Object,
      default() {
        return {}
      }
    },
    onItemClick: {
      type: Function,
      default: null
    },
  },
  computed: {
    colorsRule() {
      return this.$store.getters.GET_SURVEY.settings.colorsRule;
    },
    itemStyle() {
      const style = {}

      if (this.colorsRule) {
        const checkRules = this.colorsRule.map(({ color, rule }) => ({
          color,
          valid: eval(rule)(this.source)
        }));

        const validRules = checkRules.filter(({ valid }) => valid);
        if (validRules.length) {
          style.backgroundColor = validRules[0].color;
        }
      }

      return style
    }
  },
};
</script>

<style lang="scss" scoped>
.item__wrapper {
  display: flex;
  cursor: pointer;
}

.item__highlight {
  width: 15px;
  border-right: 1px solid #e6e6e6;
}

.item__details {
  padding: 5px;
  flex: 1;
  border-bottom: 1px solid #e0e0e0;
}

.item__active {
  background-color: #dddddd;
}
</style>
