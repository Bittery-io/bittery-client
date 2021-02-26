<template>
  <q-page>
    <div class="row justify-center text-center items-center" :style="'height:' + innerScreenHeight + 'px !important;'">
      <div class="col-auto">
        <q-card class="shadow-10 bg-grey-2" :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.9}px` : `width: ${screenWidth * 0.2}px`">
          <q-card-section :class="{ 'q-pa-lg': !$q.platform.is.mobile }">
            <bittery-logo-animated></bittery-logo-animated>
            <div class="text-primary q-pt-md text-h5"
                 :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.8}px` : `width: ${screenWidth * 0.18}px`">
              Reset your password
            </div>
            <div class="text-primary text-body1">
              Please provide your registration e-mail address
            </div>
          </q-card-section>
          <q-card-section style="padding-top: 0; margin-top:0">
            <reset-password-form></reset-password-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import BitteryLogoAnimated from 'components/utils/BitteryLogoAnimated.vue';
  import LoginForm from 'components/login/LoginForm.vue';
  import GlobalMixin from "../../mixins/global-mixin";
  import ResetPasswordForm from 'components/password-reset/ResetPasswordForm.vue';

  export default GlobalMixin.extend({
    name: 'ResetPasswordPage',
    components: { BitteryLogoAnimated, LoginForm, ResetPasswordForm },
  });
</script>
