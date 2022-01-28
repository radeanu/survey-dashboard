<template>
  <v-skeleton-loader
    v-if="!loaded"
    class="mx-5"
    type="table-heading, list-item-two-line, image, table-tfoot"
  />

  <VirtualList
    v-else
    class="flex-1 overflow-auto"
    data-key="_id"
    :keeps="50"
    :data-sources="rowsToDisplay"
    :data-component="responsesListItem"
    :extra-props="{ onItemClick }"
  />
</template>

<script>
import VirtualList from 'vue-virtual-scroll-list'
import ResponsesListItem from "./responses-list-item.vue";

export default {
  components: {
    VirtualList
  },
  data() {
    return {
      tempItem: {},
      loaded: false,
      responsesListItem: ResponsesListItem,
    };
  },
  computed: {
    rowsToDisplay() {
      return this.$store.getters.GET_SURVEY_ROWS_TO_DISPLAY;
    },
    selectedRow() {
      return this.$store.getters.GET_SELECTED_ROW;
    },
  },
  watch: {
    selectedRow(val) {
      if (val._id !== +this.$route.params.rowId) {
        this.$router.push({
          name: 'FormView',
          params: {
            rowId: val._id.toString()
          },
          query: this.$route.query
        });
      }
    }
  },
  async beforeMount() {
    await this.$store.dispatch('FETCH_SURVEY_BY_PARAMS', this.$route.params);
    await this.$store.dispatch('FETCH_SURVEY_RESPONSES');
    this.loaded = true;
    this.$emit('loaded', true);

    if (this.$route.params.rowId) {
      this.$store.commit('SET_SELECTED_ROW_BY_ID', +this.$route.params.rowId);
    }
  },
  methods: {
    async onItemClick(item) {
      // if (localStorage.getItem('changed') === 'true') {
      //   this.tempItem = item;
      //   this.confirmRowSwitch();
      // } else {

      if (+this.$route.params.rowId !== +item._id) {
        this.$router.push({
          name: 'FormView',
          params: {
            rowId: item._id.toString()
          },
          query: this.$route.query
        });
        this.$store.commit('SET_SELECTED_ROW_BY_ID', item._id);
      }
    },
    confirmRowSwitch() {
      this.$dialog.confirm({
        title: 'Atenție',
        body: 'Au fost făcute modificări, sigur doriți să închideți'
      }).then(() => {
        this.$store.commit('SET_SELECTED_ROW', this.tempItem);
        localStorage.setItem('changed', 'false');
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
