<template>
  <div>
    <v-icon
      class="pointer"
      color="primary"
      raised
      :ripple="false"
      @click="showForm"
    >
      mdi-account-plus
    </v-icon>
    <v-dialog
      v-model="showDialog"
      persistent
      max-width="400px"
    >
      <v-card>
        <v-card-title class="card-title-actions">
          <span class="headline">
            Înregistrare cont nou
          </span>
          <div
            class="icon-close"
            @click="showDialog = false"
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

        <v-card-text class="px-5 py-3">
          <v-progress-circular
            v-if="loading"
            class="d-block ma-auto"
            color="primary"
            indeterminate
            height="30"
          />

          <FormulateForm
            v-if="!loading"
            v-model="formValues"
            class="w-full"
            :schema="formShema"
            @submit="handleSubmit"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { getRegisterSchema, registerNewUser } from '../services/user';

export default {
  data: () => ({
    formShema: [],
    formValues: {},
    loading: false,
    showDialog: false
  }),
  methods: {
    showForm() {
      this.showDialog = true;
      this.loading = true;
      this.formShema = getRegisterSchema();
      this.loading = false;
    },
    async handleSubmit() {
      this.loading = true;
      await registerNewUser({
        ...this.formValues,
        rights: JSON.parse(this.formValues.rights)
      });
      this.loading = false;
      this.resetValues();
      this.$notify({
        group: 'success',
        text: `👌 Succes!`,
        duration: 1500
      });
    },
    resetValues() {
      this.formValues = {};
      this.errorMessage = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.formulate-input .formulate-input-element {
  max-width: fit-content !important;
}

.formulate-input-element
  .formulate-input-element--group
  .formulate-input-group {
  max-width: fit-content !important;
}

.v-card__title {
  padding: 10px 20px !important;
}

.link {
  border-bottom: 1px solid;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  color: var(--v-primary-base);
}
</style>
