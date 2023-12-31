<template>
  <div class="row q-pa-xs">
    <div class="col-grow">
      <registered-popup :show="registered"></registered-popup>
      <loader :show="showLoading"></loader>
      <error-popup header="Registration failed"
                   :error-message="errorBannerMessage"
                   :show="errorBannerMessage !== ''">
      </error-popup>
      <vue-form :state='registerformstate' @submit.prevent="onSubmit">
        <div class="row q-pa-xs" >
          <div class="col-grow">
            <validate>
              <q-input
                outlined
                square
                bg-color="accent"
                type="email"
                name="email"
                v-model="email"
                label="E-mail address"
                required
                :rules="[ val => (
                        registerformstate.email !== undefined &&
                        registerformstate.email.$valid) || 'Given e-mail address is incorrect']">
                <template v-slot:prepend>
                  <q-icon color="primary" name="mdi-account "/>
                </template>
              </q-input>
            </validate>
          </div>
        </div>
        <div class="row q-pa-xs q-pt-md">
          <div class="col-grow">
            <validate>
                <q-input
                  outlined
                  square
                  bg-color="accent"
                  name="password"
                  ref="password"
                  v-model="password"
                  label="Password"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[ val => (
                          registerformstate.password !== undefined &&
                          registerformstate.password.$valid) || 'Password is required',
                          val => passwordIsCorrect || 'Password must have at least 8 characters including 1 digit and 1 special character',
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
        <div class="row q-pa-xs q-pt-md" >
          <div class="col-grow">
            <validate>
              <q-input
                outlined
                square
                bg-color="accent"
                name="password2"
                ref="password2"
                v-model="password2"
                label="Repeat password"
                :type="isPwd2 ? 'password' : 'text'"
                :rules="[ val => (
                        registerformstate.password2 !== undefined &&
                        registerformstate.password2.$valid) || 'Please repeat your password',
                         val => (
                        registerformstate.password2 !== undefined &&
                        registerformstate.password !== undefined &&
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
            <Recaptcha @captchaCode="onCaptchaProvided" :reset-recaptcha="resetRecaptcha"></Recaptcha>
          </div>
        </div>
        <div class="row q-pt-md">
          <div class="col-grow">
            <q-btn glossy type="submit"
                   color="primary"
                   icon="mdi-account-plus"
                   label="Sign up"
                   :disabled="!(registerformstate.password !== undefined &&
                                registerformstate.password2 !== undefined &&
                                registerformstate.email !== undefined &&
                                registerformstate.password.$valid &&
                                registerformstate.password2.$valid &&
                                password.trim() !== '' &&
                                password2.trim() !== '' &&
                                password.trim().length >= 6 &&
                                registerformstate.email.$valid &&
                                captchaCode !== '' &&
                                password === password2 &&
                                !registerButtonLocked)">
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

  import { post } from 'src/api/http-service';
  import GlobalMixin from 'src/mixins/global-mixin';
  import Loader from 'components/utils/Loader.vue';
  import ErrorPopup from 'components/utils/ErrorPopup.vue';
  import RegisteredPopup from 'components/register/RegisteredPopup.vue';
  import Recaptcha from 'components/utils/Recaptcha.vue';
  import sha256 from 'js-sha256';

  export default GlobalMixin.extend({
    components: { Loader, ErrorPopup, RegisteredPopup, Recaptcha },
    data: () => ({
      registerformstate: {},
      password: '',
      password2: '',
      email: '',
      captchaCode: '',
      registered: false,
      registerButtonLocked: false,
      isPwd: true,
      isPwd2: true,
      resetRecaptcha: true,
      //todo poprawic
      registerPasswordRegexp: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[\[\]$&+,:;=?@#<>.^*()%!-\\'` ~_-])[A-Za-z\d\[\]$&+,:;=?@#<>.^*()%!-\\'` ~_-]{8,}$/),
    }),
    name: 'RegisterForm',
    computed: {
      passwordIsCorrect() {
        return this.registerPasswordRegexp.test(this.password);
      },
    },
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
        this.resetRecaptcha = false;
        this.errorBannerMessage = '';
        this.showLoading = true;
        this.registerButtonLocked = true;
        post(this.$axios,
          '/api/user/register',
          {
            // @ts-ignore
            password: sha256(this.password),
            // @ts-ignore
            repeatPassword: sha256(this.password2),
            email: this.email.trim(),
            captchaCode: this.captchaCode,
          },
          (resp: any) => {
            console.log(resp);
            this.showLoading = false;
            this.registered = true;
          },
          (err: any) => {
            this.resetRecaptcha = true;
            this.handleRequestError(err, (errorCode: any) => {
              switch (errorCode) {
                case 0:
                  this.errorBannerMessage = 'E-mail is already taken. Please choose different e-mail.';
                  break;
                case 1:
                  this.errorBannerMessage = 'E-mail is already taken. Please choose different e-mail.';
                  break;
                case 2:
                  this.errorBannerMessage = 'E-mail is incorrect. Please fix it.';
                  break;
                case 9:
                  this.errorBannerMessage = 'We are sorry but registration is currently disabled. We will notify you when it will be available again.';
                  break;
                default:
                  this.errorBannerMessage = 'Unexpected server error.';
              }
            });
            this.registerButtonLocked = false;
            this.showLoading = false;
            console.log(err);
          });
      },
    },
  });
</script>
