<template>
  <div class="row">
    <div class="col-grow">
      <registered-popup :show="registered"></registered-popup>
      <loader :show="showLoading"></loader>
      <error-popup header="Registration failed"
                   :error-message="errorBannerMessage"
                   :show="errorBannerMessage !== ''">
      </error-popup>
      <vue-form :state='registerformstate' @submit.prevent="onSubmit">
        <div class="row" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">
          <div class="col-grow">
            <validate>
              <q-input
                outlined
                square
                bg-color="accent"
                type="email"
                name="email"
                v-model="email"
                label="Adres e-mail"
                required
                :rules="[ val => (
                        registerformstate.email !== undefined &&
                        registerformstate.email.$valid) || 'Poprawny adres e-mail jest wymagany']">
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
                name="password"
                ref="password"
                v-model="password"
                label="Hasło"
                type="password"
                :rules="[ val => (
                        registerformstate.password !== undefined &&
                        registerformstate.password.$valid) || 'Hasło jest wymagane.',
                          val => (
                        registerformstate.password2 !== undefined &&
                        registerformstate.password !== undefined &&
                        password2 === password) || 'Hasła muszą być takie same.',
                         val => (password.trim() !== '') || 'Hasło nie może być puste.']"
                required>
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
                label="Powtórz hasło"
                type="password"
                :rules="[ val => (
                        registerformstate.password2 !== undefined &&
                        registerformstate.password2.$valid) || 'Powtórzone hasło jest wymagane.',
                         val => (
                        registerformstate.password2 !== undefined &&
                        registerformstate.password !== undefined &&
                        password2 === password) || 'Hasła muszą być takie same.',
                        val => (password2.trim() !== '') || 'Hasło nie może być puste.']"
                required>
              </q-input>
            </validate>
          </div>
        </div>
        <div class="row justify-center">
          <div class="col-auto justify-center">
            <Recaptcha @captchaCode="onCaptchaProvided"></Recaptcha>
          </div>
        </div>
        <div class="row" :class="{ 'q-pt-md': !$q.platform.is.mobile }">
          <div class="col-grow">
            <q-btn type="submit"
                   color="primary"
                   icon="mdi-account-plus"
                   label="Zarejestruj się"
                   :disabled="!(registerformstate.password !== undefined &&
                                registerformstate.password2 !== undefined &&
                                registerformstate.email !== undefined &&
                                registerformstate.password.$valid &&
                                registerformstate.password2.$valid &&
                                password.trim() !== '' &&
                                password2.trim() !== '' &&
                                registerformstate.email.$valid &&
                                captchaCode !== '' &&
                                vatFormatIsCorrect &&
                                password === password2 &&
                                !registerButtonLocked)">
            </q-btn>
          </div>
        </div>
        <div class="row q-pt-md">
          <div class="col-grow">
            <q-chip clickable icon="mdi-information" class="shadow-10" @click="$router.push('/login')" color="grey-8"
                    text-color="white">
              Masz już konto? Zaloguj się.
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
    }),
    name: 'RegisterForm',
    watch: {
      // These watchers are for password validation, when one changes -> check second.
      password() {
        if (this.password2 !== '') {
          this.$refs.password2.validate();
        }
      },
      password2() {
        if (this.password !== '') {
          this.$refs.password.validate();
        }
      },
    },
    computed: {
      vatFormatIsCorrect() {
        return true;
      },
    },
    methods: {
      onCaptchaProvided(captchaCode: string) {
        this.captchaCode = captchaCode;
      },
      onSubmit() {
        this.errorBannerMessage = '';
        this.showLoading = true;
        this.registerButtonLocked = true;
        post(this.$axios,
          '/api/user/register',
          {
            password: this.password,
            repeatPassword: this.password2,
            email: this.email.trim(),
            captchaCode: this.captchaCode,
          },
          (resp) => {
            console.log(resp);
            this.showLoading = false;
            this.registered = true;
          },
          (err) => {
            this.handleRequestError(err, (errorCode) => {
              switch (errorCode) {
                case 0:
                  this.errorBannerMessage = 'E-mail is already taken.';
                  break;
                case 1:
                  this.errorBannerMessage = 'E-mail is already taken.';
                  break;
                case 2:
                  this.errorBannerMessage = 'E-mail is incorrect.';
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
