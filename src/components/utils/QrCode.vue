<template>
  <canvas :id="id" :style="mini ? `max-width:100px; max-height:100px;` :
                  (this.$q.platform.is.mobile ? `max-width:${screenWidth * 0.8}px; max-height:${screenWidth * 0.8}px;` :
                  `max-width:${width}px; max-height:${height}px;`)"/>
</template>

<script lang="ts">

  import GlobalMixin from 'src/mixins/global-mixin';
  import QRCode from 'qrcode';

  export default GlobalMixin.extend({
    name: 'QrCode',
    props: {
      text: {
        type: String,
        required: false,
      },
      id: {
        type: String,
        required: true,
        default: 'qrcodeid',
      },
      width: {
        type: Number,
        required: false,
        default: 70,
      },
      height: {
        type: Number,
        required: false,
        default: 70,
      },
      mini: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    mounted() {
      const canvas = document.getElementById(this.id)
      QRCode.toCanvas(canvas, this.text, function (error) {
        if (error) console.error(error)
        console.log('success!');
      })
    },
  });
</script>
