<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <q-card class="bg-grey-2">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-email-check" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-bold text-primary text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              Reset password e-mail sent
            </div>
            <div class="text-primary text-primary text-center text-subtitle2">
              We've sent you reset password instructions on your e-mail. Please check your inbox.
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto">
            <q-btn glossy @click="closeAndGoToLoginView()" color="primary" text-color="white">Sign in</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">

  import GlobalMixin from 'src/mixins/global-mixin';

  export default GlobalMixin.extend({
    name: 'PasswordResetSentPopup',
    components: {},
    props: {
      show: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        showPopup: false,
      };
    },
    watch: {
      show() {
        this.showPopup = true;
      },
    },
    methods: {
      close() {
        this.showPopup = false;
        this.$router.push('/login');
      },
    },
  });
</script>
