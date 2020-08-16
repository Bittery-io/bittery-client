<template>
  <q-page padding>
    <div :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row justify-center text-center items-center">
        <div class="col-auto">
          <q-card class="shadow-10 bg-grey-2">
            <q-card-section :class="{ 'q-pa-lg': !$q.platform.is.mobile }">
              <bittery-logo></bittery-logo>
              <div class="text-primary q-pt-md text-h5"
                   :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.8}px` : `width: ${screenWidth * 0.18}px`">
                Reset your password
              </div>
              <div class="text-primary text-subtitle1">
                Please provide new password for your account
              </div>
            </q-card-section>
            <q-card-section style="padding-top: 0; margin-top:0">
              <confirm-reset-password-form></confirm-reset-password-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import BitteryLogo from 'components/utils/BitteryLogo.vue';
  import LoginForm from 'components/login/LoginForm.vue';
  import GlobalMixin from "../../mixins/global-mixin";
  import ConfirmResetPasswordForm from 'components/password-reset/ConfirmResetPasswordForm.vue';

  export default GlobalMixin.extend({
    name: 'ConfirmResetPasswordPage',
    components: { BitteryLogo, LoginForm, ConfirmResetPasswordForm },
  });
</script>
