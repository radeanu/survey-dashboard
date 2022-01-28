<template>
  <AppDialogWidget
    max-width="1000"
    icon="mdi-bell-ring"
    tooltip="Setări notificări"
    :tooltip-pos="perGeneral ? 'bottom' : 'top'"
    title="Notificări"
    :persistent="true"
    :show="false"
  >
    <v-expansion-panels
      v-model="open"
      accordion
      focusable
      tile
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div class="d-flex gap-10 align-center">
            <v-icon>
              mdi-format-list-bulleted-square
            </v-icon>
            <span class="font-weight-medium">
              Lista notificărilor
            </span>
          </div>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <NotificationsList v-if="open === 0" :per-general="perGeneral" />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>
          <div class="d-flex gap-10 align-center">
            <v-icon>
              mdi-plus
            </v-icon>
            <span class="font-weight-medium d-flex gap-10 align-center">
              {{
                `Înregistrează o notificare ${
                  !perGeneral ? 'pentru dosarul curent' : ''
                }`
              }}
            </span>
          </div>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <CreateNotification v-if="open === 1" :per-general="perGeneral" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </AppDialogWidget>
</template>

<script>
import AppDialogWidget from '../widgets/app-dialog-widget.vue';
import NotificationsList from './notificationsList';
import CreateNotification from './createNotification';

export default {
  components: {
    NotificationsList,
    CreateNotification,
    AppDialogWidget
  },
  props: {
    perGeneral: {
      type: Boolean,
      deafult: false,
    }
  },
  data() {
    return {
      showList: false,
      open: -1
    };
  },
};
</script>

<style lang="scss" scoped>
.v-expansion-panel-header--active {
  min-height: 48px !important;
}

.v-expansion-panel-header {
  padding-top: 10px !important;
}

::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}


</style>
