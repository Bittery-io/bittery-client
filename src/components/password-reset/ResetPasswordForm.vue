<template>
  <div class="row">
    <div class="col-grow">
      <loader :show="showLoading"></loader>
      <error-popup header="Login failed"
                   :error-message="errorBannerMessage"
                   :show="errorBannerMessage !== ''">
      </error-popup>
      <password-reset-sent-popup :show="showPopup"></password-reset-sent-popup>
      <vue-form :state='resetpasswordformstate' @submit.prevent="onSubmit">
        <div class="row" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">
          <div class="col-grow">
            <validate>
              <q-input
                outlined
                bg-color="accent"
                square
                type="email"
                name="email"
                v-model="email"
                label="E-mail address"
                required
                :rules="[ val => (
                        resetpasswordformstate.email !== undefined &&
                        resetpasswordformstate.email.$valid) || 'Given e-mail address is incorrect']">
                <template v-slot:prepend>
                  <q-icon color="primary" name="mdi-email"/>
                </template>
              </q-input>
            </validate>
          </div>
        </div>
        <div class="row">
          <div class="col-grow">
            <q-btn type="submit"
                   color="primary"
                   icon="mdi-lock-reset"
                   label="RESET PASSWORD"
                   :disabled="!(resetpasswordformstate.email !== undefined &&
                                 resetpasswordformstate.email.$valid &&
                                 !resetPasswordButtonLocked)">
            </q-btn>
          </div>
        </div>
        <div class="row q-pt-md">
          <div class="col-grow">
            <q-chip clickable icon="mdi-information" class="shadow-10" @click="$router.push('/login')" color="grey-8"
                    text-color="white">
              Already have account? Sign in.
            </q-chip>
          </div>
        </div>
      </vue-form>
    </div>
  </div>
</template>
<script lang="ts">

  import ErrorPopup from 'components/utils/ErrorPopup.vue';
  import Loader from 'components/utils/Loader.vue';
  import { LoginUserDto } from 'src/dto/login-user-dto';
  import { post } from 'src/api/http-service';
  import { setSessionInStorage } from 'src/api/session-service';
  import GlobalMixin from "../../mixins/global-mixin";
  import PasswordResetSentPopup from 'components/password-reset/PasswordResetSentPopup.vue';
  import { PasswordResetDto } from 'src/dto/password-reset-dto';
  import { showNotificationError } from 'src/api/notificatios-api';

  export default GlobalMixin.extend({
    components: { ErrorPopup, Loader, PasswordResetSentPopup },
    name: 'ResetPasswordForm',
    data: () => ({
      resetpasswordformstate: {},
      email: '',
      resetPasswordButtonLocked: false,
      emailInitialValid: true,
      showPopup: false,
    }),
    watch: {
      email() {
        this.emailInitialValid = false;
      },
    },
    methods: {
      onSubmit() {
        this.resetPasswordButtonLocked = true;
        this.showLoading = true;
        this.errorBannerMessage = '';
        post(this.$axios,
          '/api/user/password/reset',
          new PasswordResetDto(
            this.email.trim(),
          ),
          async (resp: any) => {
            console.log(resp);
            this.showLoading = false;
            await this.sleep(200); // small sleep required
            this.showPopup = true;
          },
          (err: any) => {
            this.showLoading = false;
            showNotificationError('Password reset failed', 'Unexpected server error');
            console.log(err);
          });
      },
    },
  });
</script>
