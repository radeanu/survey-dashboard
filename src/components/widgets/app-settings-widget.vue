<template>
  <v-menu
    elevation="0"
    offset-x
    left
    :close-on-content-click="false"
  >
    <template #activator="{on, attrs}">
      <v-icon
        color="primary"
        raised
        :ripple="false"
        v-bind="attrs"
        v-on="on"
      >
        mdi-cog
      </v-icon>
    </template>
    <v-list dense outlined :subheader="true">
      <v-subheader>
        <v-icon v-if="GET_USER().role === 'group'">
          mdi-account-group
        </v-icon>
        <v-icon v-else>
          mdi-account
        </v-icon>
        {{ GET_USER().login }}
      </v-subheader>
      <v-list-item-group>
        <div class="btn d-flex" @click="logout">
          <v-icon>mdi-power</v-icon>
          <span>Ieșire</span>
        </div>
        <div class="btn d-flex">
          <v-icon
            color="#018053"
            :small="THEME_IS_DARK()"
            @click="TOGGLE_DARK_THEME"
          >
            mdi-brightness-6
          </v-icon>
          <v-icon
            color="black"
            :small="!THEME_IS_DARK()"
            @click="TOGGLE_DARK_THEME"
          >
            mdi-brightness-6
          </v-icon>
        </div>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  methods: {
    ...mapGetters(['GET_USER', 'THEME_IS_DARK']),
    ...mapMutations(['TOGGLE_DARK_THEME']),
    async logout() {
      await this.$store.commit('LOGOUT');
    }
  }
};
</script>

<style lang="scss" scoped>
.v-subheader {
  display: flex;
  gap: 10px;
}
.btn {
  cursor: pointer;
  padding: 2px 8px;
}
.v-input--switch {
  margin: 0;
}

.v-sheet.v-card {
  border-radius: 0;
}

.d-flex {
  gap: 20px;
}
</style>
