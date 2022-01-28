<template>
  <div class="pa-2">
    <v-switch
      v-model="showAll"
      class="pl-7 w-max-content pt-0 pb-1"
      color="primary"
      label="Arată toate"
      dense
      inset
      hide-details
      flat
      :ripple="false"
    />
    <v-expansion-panels v-if="loaded" v-model="open" class="max-h-65vh">
      <v-expansion-panel v-for="(notification, i) in notificationData" :key="'notf__' + i">
        <v-expansion-panel-header disable-icon-rotate>
          <div class="d-flex gap-10 align-center justify-space-between mr-5">
            <span class="font-weight-medium d-flex gap-10 align-center">
              <v-chip color="primary" small>
                {{ notification.contractNumber }}
              </v-chip>
              <i>{{ notification.companyName }}</i>

            </span>
            <div>
              <v-icon>mdi-email-send</v-icon>
              <span class="ml-2">
                {{ notification.notificationDate }}
              </span>
            </div>
          </div>

          <template #actions>
            <v-icon v-if="notification.status === 'Progres'" color="info">
              mdi-progress-clock
            </v-icon>
            <v-icon v-if="notification.status === 'Complete'" color="primary">
              mdi-check-bold
            </v-icon>
          </template>
        </v-expansion-panel-header>

        <v-expansion-panel-content>
          <NotificationDetails
            v-if="i === open"
            :notification="notification"
            @deleted="open = -1"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>

      <template v-if="!notificationData.length">
        <span
          class="text-red-600 d-flex justify-center"
        >Nu a fost găsită nici o notificare</span>
      </template>
    </v-expansion-panels>
  </div>
</template>

<script>
import NotificationDetails from './notificationDetails';

export default {
  components: {
    NotificationDetails
  },
  props: {
    perGeneral: {
      type: Boolean,
      deafult: false
    }
  },
  data() {
    return {
      open: -1,
      showAll: false,
      loaded: false
    };
  },
  computed: {
    notificationData() {
      return this.showAll || this.perGeneral
        ? this.$store.getters.GET_SURVEY_RECORD_NOTIFICATIONS
        : this.currentRecordNotificationsData
    },
    currentRecordNotificationsData() {
      return this.$store.getters.GET_SURVEY_RECORD_NOTIFICATIONS.filter(item =>
        item.recordId === this.$store.getters.GET_SELECTED_ROW._id
      );
    }
  },
  async beforeMount() {
    this.showAll = this.perGeneral ? true : false;
    const surveyId = this.$route.params.surveyId ? this.$route.params.surveyId : 0;
    await this.$store.dispatch('FETCH_SURVEY_RECORD_NOTIFICATION', surveyId);
    this.loaded = true;
  },
  methods: {
    async downloadFile(name) {
      await this.$store.dispatch('DOWNLOAD_FILE', name);
    },
  }
};
</script>

<style lang="scss" scoped>
.active {
  cursor: pointer;
}
.selected {
  background-color: #e4e4e4;
}

.v-expansion-panel-header--active {
  min-height: 48px !important;
}

.v-expansion-panel-header {
  padding-top: 10px !important;
}

::v-deep .v-expansion-panel-content__wrap {
  padding: 0 !important;
}

.max-h-65vh {
  max-height: 65vh !important;
  overflow: auto;
}



.v-input--selection-controls {
  margin-top: 0 !important;
}

.w-max-content {
  width: max-content;
}
</style>
