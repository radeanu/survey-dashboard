<template>
  <v-menu
    left
    offset-x
    :close-on-content-click="false"
  >
    <template #activator="menu">
      <v-btn
        v-bind="menu.attrs"
        small
        outlined
        color="primary"
        v-on="menu.on"
      >
        Adaugă anexe
      </v-btn>
    </template>

    <v-card
      width="250"
      class="pa-2"
    >
      <FormulateForm
        name="fileUploader"
        @submit="submitFileUploader"
      >
        <FormulateInput
          ref="fileupload"
          v-model="inputFile"
          label="Alege un fișier sau mai multe"
          upload-behavior="delayed"
          validation="required"
          :validation-messages="{
            required: 'Acest câmp este obligatoriu'
          }"
          type="file"
          multiple
        />
        <FormulateInput
          type="submit"
          label="Încarcă"
        />
      </FormulateForm>
    </v-card>
  </v-menu>
</template>

<script>
import { mainApi } from '../../api-instances';

export default {
  props: {
    targetApiUrl: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      inputFile: {}
    };
  },
  methods: {
    async submitFileUploader() {
      this.$emit('start', true);
      const formData = new FormData();
      const files = Array.from(this.inputFile.fileList);

      files.forEach(file => {
        formData.append('files', file);
      });

      try {
        const { data } = await mainApi.post(this.targetApiUrl, formData);
        this.$notify({
          group: 'success',
          text: `👌 Succes!`,
          duration: 1000
        });

        this.$emit('success', data.files);
      } catch (error) {
        console.error(error);
      } finally {
        this.inputFile = {};
        this.$emit('finish', true);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.formulate-input:last-child {
  margin-bottom: 0 !important;
}
</style>
