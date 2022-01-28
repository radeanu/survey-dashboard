<template>
  <div
    :id="id"
    class="ace-editor"
  />
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: 'ace-editor'
    },
    value: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      editor: null
    }
  },
  watch: {
    value(val) {
      this.editor.getSession().setValue(JSON.stringify(val, null, 2));
    }
  },
  mounted() {
    this.editor = ace.edit(this.id, {
      wrap: true,
      fontSize: 14,
      maxLines: 50,
      cursorStyle: 'smooth',
      mode: 'ace/mode/json',
      showPrintMargin: false,
      foldStyle: 'markbegin',
      theme: 'ace/theme/github',
      value: JSON.stringify(this.value, null, 2)
    });

    this.editor.on('change', () => {
      this.$emit('change', this.editor.getSession().getValue());
    })
  }
};
</script>

<style lang="scss" scoped>
</style>
