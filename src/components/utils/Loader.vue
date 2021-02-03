<template>
  <div></div>
</template>
<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({
    name: 'Loader',
    props: {
      show: {
        type: Boolean,
        required: true,
        default: false,
      },
      message: {
        type: String,
        required: false,
        default: 'Please wasssit'
      }
    },
    watch: {
      show() {
        if (this.show) {
          this.$q.loading.show({
            message: this.message,
            backgroundColor: '#01ff90',
          });
        } else if (this.$q.loading.isActive) {
          this.$q.loading.hide();
        }
      },
    },
  });
</script>
