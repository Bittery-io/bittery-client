<template>
  <div>
  </div>
</template>
<script lang="ts">
import GlobalMixin from 'src/mixins/global-mixin';
import { QSpinnerPie } from 'quasar'

  export default GlobalMixin.extend({
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
        default: 'Please wait'
      }
    },
    watch: {
      show() {
        if (this.show) {
          const config = this.isMobile ?
            {
              spinner: QSpinnerPie,
              spinnerColor: 'primary',
              message: `<div class="text-subtitle2 bg-primary" style="padding: 3%; border: 1px solid white">${this.message}</div>`,
              backgroundColor: 'primary',
            } :
            {
              spinnerColor: 'primary',
              spinner: QSpinnerPie,
              message: `<div class="text-h6 bg-primary" style="padding: 3%;border: 1px solid white;">${this.message}</div>`,
              backgroundColor: 'primary',
            };
          this.$q.loading.show(config);
        } else if (this.$q.loading.isActive) {
          this.$q.loading.hide();
        }
      },
    },
  });
</script>
