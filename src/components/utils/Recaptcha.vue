<template>
  <div class="g-recaptcha" id="recaptcha" data-sitekey="6LdZB6kZAAAAAFOzV7n5GyDE97LZUNp4YNlDKraf"></div>
</template>

<script>
  import $ from "jquery";

  export default {
    components: {},
    name: 'Recaptcha',
    props: ['resetRecaptcha'],
    data() {
      return {
      };
    },
    mounted() {
      if (typeof grecaptcha !== 'undefined') {
        this.renderCaptcha();
      } else {
        $(window).on('load', () => {
          this.renderCaptcha();
        });
      }
    },
    methods: {
      async renderCaptcha() {
        await this.sleep(200);
        grecaptcha.render('recaptcha', {
          sitekey: '6LdZB6kZAAAAAFOzV7n5GyDE97LZUNp4YNlDKraf',
          callback: (responseCode) => {
            this.$emit('captchaCode', responseCode);
          },
        });
      },
    },
    watch: {
      resetRecaptcha() {
        if (this.resetRecaptcha) {
          grecaptcha.reset();
        }
      },
    },
  };
</script>
<style>
  .g-recaptcha-outer{
    text-align: center;
    border-radius: 2px;
    background: #f9f9f9;
    border-style: solid;
    border-color: #37474f;
    border-width: 1px;
    border-bottom-width: 2px;
  }
  .g-recaptcha-inner{
    width: 154px;
    height: 82px;
    overflow: hidden;
    margin: 0 auto;
  }
  .g-recaptcha{
    position:relative;
    left: -2px;
    top: -1px;
  }
</style>
