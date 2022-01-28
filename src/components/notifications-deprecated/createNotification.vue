<template>
  <v-card class="overflow-a" max-height="70vh" elevation="0">
    <v-card-text>
      <FormulateForm
        v-slot="{isLoading}"
        v-model="formValues"
        name="notification"
        class="ma-3"
        :schema="parsedSchema"
        @submit="submitHandler"
      >
        <FormulateInput
          type="submit"
          :disabled="isLoading"
          :label="isLoading ? 'Se salvează...' : 'Salvează'"
        />
      </FormulateForm>
      {{ formValues }}
    </v-card-text>
  </v-card>
</template>

<script>
import { createNotification, uploadNotificationFiles } from '../../services/notification';
import moment from 'moment'

export default {
  props: {
    perGeneral: {
      type: Boolean,
      deafult: false
    }
  },
  data() {
    return {
      // FIXME refactor this
      // formValues: {},
      // keyNames: this.$store.getters.GET_DATA_TABLE_COLUMNS.filter(el=>el.text == 'Denumirea companiei'),
      // options: this.$store.getters.GET_SURVEY.settings.typeDosar !== 'voucher' ?  [
      //   { label: 'Contract semnat.', value: 'Contract semnat.' },
      //   { label: 'Transferat 70%.', value: 'Transferat 70%.' },
      //   { label: 'Transferat 30%.', value: 'Transferat 30%.' },
      // ] : [
      //   { label: 'Transferat', value: 'Transferat' },
      // ]
    };
  },
  computed: {
    surveyId() {
      return this.$route.params?.surveyId ?? 0;
    },
    parsedSchema() {
      return this.notificationFormSchema.filter(item => {
        return item.hasOwnProperty('display')
          ? item.display
          : true
      });
    },
    selectedRow() {
      return this.$store.getters.GET_SELECTED_ROW
    },
    notificationFormSchema() {
      return [
        {
          type: 'text',
          disabled: !this.perGeneral,
          name: 'contractNumber',
          label: 'Numărul contractului',
          value: !this.perGeneral
            ? this.selectedRow._orderId
            : ''
        },
        {
          type: 'text',
          class:'pr-10',
          disabled: !this.perGeneral,
          name: 'companyName',
          label: 'Denumirea companiei',
          value: ''
        },
        {
          type: 'text',
          name: 'idno',
          label: 'IDNO',
          disabled: !this.perGeneral,
          value: this.notificationIdno
        },
        {
          type: 'email',
          name: 'emailToSend',
          label: 'Email pentru notificare',
          placeholder: 'mail@odimm.md'
        },
        {
          type: !this.perGeneral ? 'select' : 'text',
          name: 'term',
          label: 'Starea actuala a dosarului.',
          placeholder: 'Alege',
          options: this.options
        },
        {
          type: 'date',
          name: 'refDate',
          label: 'Data de referinta '
        },
        {
          type: 'date',
          name: 'notificationDate',
          label: `Selectează o dată pentru notificare `,
          value:''

        },
        {
          type: 'hidden',
          name: 'createDate',
          value:''

        },
        {
          type: 'textarea',
          name: 'comments',
          label: 'Comentariu'
        },
        {
          type: 'file',
          multiple: true,
          name: 'attachments',
          label: 'Încarcă anexe'
        }
      ]
    },
    notificationIdno() {
      return !this.perGeneral ? this.selectedRow.idno : ''
    }
  },
  watch: {
    'formValues.refDate': {
      handler() {
        if (this.$store.getters.GET_SURVEY.settings.typeDosar == 'voucher') {
          this.formValues.notificationDate =  this.addMonths(new Date(this.formValues.refDate),3)
        }else{
          this.formValues.notificationDate =  this.addMonths(new Date(this.formValues.refDate),2)
        }
      },
      deep: true
    }
  },
  methods: {
    async submitHandler(data) {
      try {
        data.refDate =  moment(data.refDate).format('DD.MM.YYYY');
        data.notificationDate =  moment(data.notificationDate).format('DD.MM.YYYY');

        data.uploads = JSON.stringify({
          files: []
        })
        data.survey_id = this.surveyId;
        data.recordId = this.selectedRow?.id || null;

        const createdNotification = await createNotification(data);

        if (this.formValues.attachments) {
          const formData = new FormData();
          formData.append('notificationId', createdNotification.data.id);

          this.formValues.attachments.fileList.forEach(file => {
            formData.append('files', file);
          });

          await uploadNotificationFiles(formData);
        }

        this.$notify({
          group: 'success',
          text: `👌 Succes!`,
          duration: 1500
        });
      } catch (error) {
        console.error(error);
      } finally {
        this.formValues.name = {};
      }
    },
    addMonths(date, months) {
      return  moment(date).add(months, 'months').format('YYYY-MM-DD');
    }

  }
};
</script>

<style lang="scss" scoped>
  .double-wide {
    display: flex;
  }
  .double-wide .formulate-input {
    flex-grow: 1;
    width: calc(50% - .5em);
  }
  .double-wide .formulate-input:first-child {
    margin-right: .5em;
  }
  .double-wide .formulate-input:last-child {
    margin-left: .5em;
  }
</style>
