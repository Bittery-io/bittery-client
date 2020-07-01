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
    },
    watch: {
      show() {
        if (this.show) {
          this.$q.loading.show({
            message: 'Proszę czekać',
          });
        } else if (this.$q.loading.isActive) {
          this.$q.loading.hide();
        }
      },
    },
  });
</script>
