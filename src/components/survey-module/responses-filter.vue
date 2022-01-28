<template>
  <v-menu
    :close-on-content-click="false"
    class="body-2"
    min-width="350"
    elevation="0"
    offset-y
  >
    <template #activator="{on, attrs}">
      <v-icon
        title="Filtru"
        color="actioncolor"
        :ripple="false"
        v-bind="attrs"
        raised
        v-on="on"
      >
        mdi-filter
      </v-icon>
    </template>

    <div class="d-flex flex-column">
      <div class="pa-2">
        <v-chip color="primary" small>
          Total găsite: {{ $store.getters.GET_SURVEY_ROWS_TO_DISPLAY.length }}
        </v-chip>
      </div>

      <div class="flex-1 pa-2 pt-0">
        <div v-for="(filter) in filters" :key="filter._id" class="subtitle-2 font-weight-regular mt-2">
          <div class="filter-item" @click="filter._open = !filter._open">
            <div class="d-flex align-center">
              <v-icon>{{ filter._open ? 'mdi-menu-down' : 'mdi-menu-right' }}</v-icon>
              <div :class="{ crop: filter.item.name && filter.item.name.length > 40 }">{{ filter.item.name }}</div>
            </div>

            <div class="filter-exact-switcher" @click.stop="filter._exact = !filter._exact">
              <v-icon v-if="filter._exact" small color="primary">mdi-check-bold</v-icon>
              <v-icon v-else small>mdi-checkbox-blank-outline</v-icon>
              <span class="ml-1">Strict</span>
            </div>
          </div>

          <template v-if="filter._open">
            <div v-for="(children) in filter.item.children" :key="children._id" class="pl-4">
              <div class="d-flex">
                <v-checkbox
                  v-model="filter._selectedItems"
                  class="ma-0"
                  dense
                  hide-details
                  :ripple="false"
                  :label="children.name"
                  :value="children.name"
                />
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="pa-2 d-flex justify-end">
        <v-btn
          small
          color="secondary lighten-2"
          depressed
          @click="configFilters(), applyFilters()"
        >
          Resetează
        </v-btn>
        <v-btn
          class="ml-2"
          small
          depressed
          color="primary"
          @click="applyFilters"
        >
          Aplică
        </v-btn>
      </div>
    </div>
  </v-menu>
</template>

<script>
export default {
  data() {
    return {
      filters: []
    }
  },
  computed: {
    rows() {
      return this.$store.getters.GET_SURVEY_ROWS;
    },
    surveyFilters() {
      return this.$store.getters.GET_SURVEY?.settings?.filters || []
    }
  },
  beforeMount() {
    this.configFilters();
  },
  methods: {
    applyFilters() {
      const filtersToApply = this.filters.filter(f => f._selectedItems.length);
      this.$store.commit('APPLY_FILTERS', filtersToApply);
    },
    configFilters() {
      this.filters = this.surveyFilters.map((value, index) => {
        return {
          item: {
            name: value.name,
            value: value.value,
            children: this.getRowFilterUniqueValues(value.value)
          },
          _id: 'filter_'+index,
          _open: false,
          _exact: false,
          _selectedItems: [],
        };
      });
    },
    getRowFilterUniqueValues(filterValue) {
      const values = this.rows.reduce((acc, row) => {
        Array.isArray(row[filterValue])
          ? acc.push(...row[filterValue])
          : acc.push(row[filterValue])
        return acc;
      }, []);

      const childrens = [...new Set(values)].map((item, ind) => ({
        name: item,
        _id: `${ind}-${filterValue}`,
        _selected: false,
      }));

      return childrens;
    }
  },

};
</script>

<style lang="scss" scoped>
.filter-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  border: 1px solid #e2e2e2;
  background-color: #f1f1f1;

  &:hover {
    color: rgb(0, 0, 0);
  }
}

.filter-exact-switcher {
  display: flex;
  align-items: center;
  padding: 5px;
  border-left: 1px solid #e4e4e4;

  &:hover {
    background-color: rgb(222, 222, 222);
  }
}

.crop {
  width: 230px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.v-menu__content {
  font-size: 0.875rem !important;
  background-color: #ffffff;
}

::v-deep .v-treeview--dense .v-treeview-node__root {
  min-height: 30px !important;
}

.v-treeview {
  height: 400px;
  overflow: auto;
}

::v-deep .v-treeview-node__level {
  width: 15px !important;
}
</style>
