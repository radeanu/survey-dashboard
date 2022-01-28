<template>
  <div class="max-h-45vh">
    <div class="d-flex justify-space-between pl-5">
      <div class="d-flex gap-20 pa-2">
        <div>
          <div class="py-1">
            <span class="title-res">
              Nr. contract:
            </span>
            <span class="font-weight-medium">
              {{ notification.contractNumber }}
            </span>
          </div>
          <div class="py-1">
            <span class="title-res">
              Compania:
            </span>
            <span class="font-weight-medium">
              {{ notification.companyName }}
            </span>
          </div>
        </div>
        <div>
          <div class="py-1">
            <span class="title-res">
              IDNO:
            </span>
            <span class="font-weight-medium">
              {{ notification.idno }}
            </span>
          </div>
          <div class="py-1">
            <span class="title-res">
              Email pe data:
            </span>
            <span class="font-weight-medium">
              {{ notification.notificationDate }}
            </span>
          </div>
        </div>
        <div>
          <div class="py-1">
            <span class="title-res">
              Starea curenta:
            </span>
            <span class="font-weight-medium">
              {{ notification.term }}
            </span>
          </div>
          <div class="py-1">
            <span class="title-res">
              Status:
            </span>
            <span class="font-weight-medium">
              {{ notification.status }}
            </span>
          </div>
        </div>
      </div>
      <div class="ma-auto mr-6">
        <v-icon
          class="pointer pr-5"
          color="error"
          @click="deleteNotification"
        >
          mdi-delete-forever
        </v-icon>

        <v-icon
          v-if="notification.status !== 'Complete'"
          class="pointer"
          color="primary"
          @click="markNotificationAsComplete"
        >
          mdi-check-bold
        </v-icon>
      </div>
    </div>

    <v-divider v-if="notification.status !== 'Complete'" />

    <div class="pl-7 d-flex">
      <div class="w-half pr-1">
        <div>
          <span class="title-res">
            Data de referință:
          </span>
          <span class="font-weight-medium">
            {{ notification.refDate }}
          </span>
        </div>

        <div class="py-2">
          <span class="title-res">
            Comentarii:
          </span>
          <div
            v-for="({date, comment}, inx) in JSON.parse(notification.comments)"
            :key="'a' + inx"
            class="d-flex pl-5 gap-10"
          >
            <span class="font-weight-medium">
              {{ date }}
            </span>
            <span class="text--secondary font-italic">
              {{ comment }}
            </span>
          </div>
        </div>

        <div>
          <p class="title-res">
            Anexele incarcate:
          </p>
          <div v-for="(file, index) in notificationFiles.files" :key="index">
            <div class="d-flex align-center flex-nowrap">
              <v-icon
                v-if="$store.getters.USER_CAN_DELETE_FILES && notification.status !== 'Complete'"
                class="pointer pr-2"
                title="Șterge"
                color="accent"
                @click="deleteFile(file)"
              >
                mdi-delete-forever
              </v-icon>
              <a
                :href="getPreviewUrl(file)"
                title="Vezi"
                target="_blank"
                rel="noopener noreferrer"
                data-title="A new page"
              >
                <v-icon class="pointer" color="primary">
                  mdi-eye-outline
                </v-icon>
              </a>

              <a
                :href="getDownloadLink(file)"
                title="Descarcă"
                target="_blank"
                rel="noopener noreferrer"
                data-title="A new page"
              >
                <v-icon class="pointer" color="primary">
                  mdi-download
                </v-icon>
              </a>
              <span>{{ file }}</span>
            </div>
          </div>
        </div>
      </div>

      <v-divider v-if="notification.status !== 'Complete'" vertical />

      <div v-if="notification.status !== 'Complete'" class="w-half">
        <FormulateForm
          v-slot="{isLoading}"
          v-model="notificationEditForm"
          name="updateNotification"
          class="ma-3"
          @submit="submitHandler"
        >
          <FormulateInput
            type="date"
            label="Modifica data pentru notificare"
            name="notificationDate"
            :value="notification.notificationDate.split('.').reverse().join('-')"
          />
          <FormulateInput
            type="file"
            label="Încarcă anexe"
            name="attachments"
            multiple
          />
          <FormulateInput
            type="textarea"
            name="comments"
            label="Comentariu"
            class="note"
          />
          <FormulateInput
            type="submit"
            :disabled="isLoading"
            :label="isLoading ? 'Loading...' : 'Salveaza'"
          />
        </FormulateForm>
      </div>
    </div>
  </div>
</template>

<script>
import { mainApi } from '../../api-instances';

export default {
  props: {
    notification: {
      type: Object,
      default: () => {
        return {};
      }
    },
  },
  data() {
    return {
      notificationEditForm: {}
    };
  },
  computed: {
    notificationFiles() {
      return JSON.parse(this.notification.uploads)
    },
    token() {
      return this.$cookies.get('token');
    },
  },
  methods: {
    async deleteFile(fileName) {
      try {
        this.$dialog
          .confirm({
            title: 'Atenție',
            body: 'Sigur doriți să ștergeți: <b>' + fileName + '</b>'
          })
          .then(async () => {
            await this.$store.dispatch('DELETE_NOTIFICATION_FILE', {
              notificationId: this.notification.id,
              fileName
            });

            this.$notify({
              group: 'success',
              text: `👌 Succes!`,
              duration: 1500
            });
          })
          .catch(() => {});
      } catch (error) {
        console.error(error);
      }
    },
    async submitHandler() {
      try {
        await this.$store.dispatch('UPDATE_NOTIFICATION_BY_RECORD_ID', {
          newData: this.notificationEditForm,
          notification: this.notification
        });

        if (this.notificationEditForm.attachments) {
          const formData = new FormData();
          formData.append('notificationId', this.notification.id);

          this.notificationEditForm.attachments.fileList.forEach(file => {
            formData.append('files', file);
          });

          await this.$store.dispatch('ADD_NOTIFICATION_FILES', formData);
        }

        this.$notify({
          group: 'success',
          text: `👌 Succes!`,
          duration: 1500
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.notificationEditForm = {};
      }
    },
    getPreviewUrl(fileName) {
      return mainApi.defaults.baseURL + '/storage/notifications/preview/' +
        this.notification.id + '/' + fileName + '/' + '?token=' + this.token;
    },
    getDownloadLink(fileName) {
      return mainApi.defaults.baseURL + '/storage/notifications/download/' +
        this.notification.id + '/' + fileName + '/' + '?token=' + this.token;
    },
    async deleteNotification() {
      try {
        this.$dialog
          .confirm({
            title: 'Atenție',
            body: 'Sigur doriți să ștergeți această notificare ?'
          })
          .then(async () => {
            await this.$store.dispatch('DELETE_NOTIFICATION', {
              notificationId: this.notification.id
            });

            this.$notify({
              group: 'success',
              text: `👌 Succes!`,
              duration: 1500
            });

            this.$emit('deleted', true);
          })
          .catch(() => {});
      } catch (error) {
        console.error(error);
      }
    },
    async markNotificationAsComplete() {
      try {
        await this.$store.dispatch('MARK_NOTIFICATION_AS_COMPLETE', {
          notificationId: this.notification.id
        });

        this.$notify({
          group: 'success',
          text: `👌 Succes!`,
          duration: 1500
        });
      } catch (error) {
        console.error(error);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.max-h-45vh {
  overflow: auto;
  max-height: 40vh !important;
}

.w-half {
  width: 50%;
}

a {
	text-decoration: none;
}
</style>