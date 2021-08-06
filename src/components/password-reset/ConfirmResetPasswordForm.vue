<template>
  <div class="row">
    <div class="col-grow">
      <loader :show="showLoading"></loader>
      <error-popup header="Login failed"
                   :error-message="errorBannerMessage"
                   :show="errorBannerMessage !== ''">
      </error-popup>
      <password-reset-succeed-popup :show="showPopup"></password-reset-succeed-popup>
      <vue-form :state='resetpasswordformstate' @submit.prevent="onSubmit">
        <div class="row" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">
          <div class="col-grow">
            <validate>
              <q-input
                outlined
                square
                bg-color="accent"
                name="password"
                ref="password"
                v-model="password"
                label="New password"
                :type="isPwd ? 'password' : 'text'"
                :rules="[ val => (
                        resetpasswordformstate.password !== undefined &&
                        resetpasswordformstate.password.$valid) || 'Password is required',
                        val => (password.trim().length >= 6) || 'Password must have at least 6 characters',
                        val => (password.trim() !== '') || 'Password cannot be empty',]"
                required>
                <template v-slot:prepend>
                  <q-icon color="primary" name="mdi-lock"/>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>
            </validate>
          </div>
        </div>
        <div class="row" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">
          <div class="col-grow">
            <validate>
              <q-input
                outlined
                square
                bg-color="accent"
                name="password2"
                ref="password2"
                v-model="password2"
                label="Repeat new password"
                :type="isPwd2 ? 'password' : 'text'"
                :rules="[ val => (
                        resetpasswordformstate.password2 !== undefined &&
                        resetpasswordformstate.password2.$valid) || 'Please repeat your password',
                         val => (
                        resetpasswordformstate.password2 !== undefined &&
                        resetpasswordformstate.password !== undefined &&
                        password2 === password) || 'Passwords don\'t match',
                        val => (password2.trim() !== '') || 'Password cannot be empty']"
                required>
                <template v-slot:prepend>
                  <q-icon color="primary" name="mdi-lock"/>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd2 ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd2 = !isPwd2"
                  />
                </template>
              </q-input>
            </validate>
          </div>
        </div>
        <div class="row justify-center">
          <div class="col-auto justify-center">
            <Recaptcha @captchaCode="onCaptchaProvided"></Recaptcha>
          </div>
        </div>
        <div class="row">
          <div class="col-grow q-pt-md">
            <q-btn glossy type="submit"
                   color="primary"
                   icon="mdi-lock-reset"
                   label="CHANGE PASSWORD"
                   :disabled="!(resetpasswordformstate.password !== undefined &&
                                resetpasswordformstate.password2 !== undefined &&
                                resetpasswordformstate.password.$valid &&
                                resetpasswordformstate.password2.$valid &&
                                password.trim() !== '' &&
                                password2.trim() !== '' &&
                                captchaCode !== '' &&
                                password === password2 &&
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
  import { post } from 'src/api/http-service';
  import GlobalMixin from "../../mixins/global-mixin";
  import PasswordResetSucceedPopup from 'components/password-reset/PasswordResetSucceedPopup.vue';
  import { showNotificationError } from 'src/api/notificatios-api';
  import Recaptcha from 'components/utils/Recaptcha.vue';
  import { PasswordResetConfirmDto } from 'src/dto/password-reset-confirm-dto';

  export default GlobalMixin.extend({
    components: { ErrorPopup, Loader, PasswordResetSucceedPopup, Recaptcha },
    name: 'ConfirmResetPasswordForm',
    data: () => ({
      resetpasswordformstate: {},
      password: '',
      password2: '',
      resetPasswordButtonLocked: false,
      showPopup: false,
      isPwd: true,
      isPwd2: true,
      captchaCode: '',
    }),
    watch: {
      // These watchers are for password validation, when one changes -> check second.
      password() {
        if (this.password2 !== '') {
          // @ts-ignore
          this.$refs.password2.validate();
        }
      },
      password2() {
        if (this.password !== '') {
          // @ts-ignore
          this.$refs.password.validate();
        }
      },
    },
    methods: {
      onCaptchaProvided(captchaCode: string) {
        this.captchaCode = captchaCode;
      },
      onSubmit() {
        this.resetPasswordButtonLocked = true;
        this.showLoading = true;
        this.errorBannerMessage = '';
        post(this.$axios,
          `/api/user/password/reset/confirm`,
          new PasswordResetConfirmDto(
            this.password,
            this.password2,
            <string>this.$route.query.email,
            this.captchaCode,
            <string>this.$route.query.resetKey,
          ),
          async (resp: any) => {
            console.log(resp);
            this.showLoading = false;
            await this.sleep(200); // small sleep required
            this.showPopup = true;
          },
          (err: any) => {
            this.showLoading = false;
            console.log(err);
          });
      },
    },
  });
</script>
