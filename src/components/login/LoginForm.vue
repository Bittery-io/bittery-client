<template>
  <div class="row">
    <div class="col-grow">
      <loader :show="showLoading"></loader>
      <error-popup header="Login failed"
                   :error-message="errorBannerMessage"
                   :show="errorBannerMessage !== ''">
      </error-popup>
      <vue-form :state='loginformstate' @submit.prevent="onSubmit">
        <div class="row" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">
          <div class="col-grow">
            <validate>
              <q-input
                outlined
                bg-color="accent"
                square
                type="text"
                name="email"
                v-model="email"
                label="Adres e-mail"
                required
                :rules="[ val => (
                        loginformstate.email !== undefined &&
                        loginformstate.email.$valid) || 'Adres email jest wymagany']">
              </q-input>
            </validate>
          </div>
        </div>
        <div class="row" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">
          <div class="col-grow">
            <validate>
              <q-input
                outlined
                bg-color="accent"
                square
                name="password"
                v-model="password"
                label="Hasło"
                type="password"
                :rules="[ val => (
                        loginformstate.password !== undefined &&
                        loginformstate.password.$valid) || 'Hasło jest wymagane.']"
                required>
              </q-input>
            </validate>
          </div>
        </div>
        <div class="row" :class="{ 'q-pt-md': !$q.platform.is.mobile }">
          <div class="col-grow">
            <q-btn type="submit"
                   color="primary"
                   icon="mdi-login"
                   label="ZALOGUJ SIĘ"
                   :disabled="!(loginformstate.email !== undefined &&
                                !loginformstate.password !== undefined &&
                                 loginformstate.password.$valid &&
                                 !loginButtonLocked)">
            </q-btn>
          </div>
        </div>
        <div class="row q-pt-md">
          <div class="col-grow">
            <q-chip clickable icon="mdi-information" class="shadow-10" @click="$router.push('/register')" color="grey-8" text-color="white">
              Nie masz konta? Zarejestruj się!
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
  import { showNotificationError } from 'src/api/notificatios-api';

  export default GlobalMixin.extend({
    components: { ErrorPopup, Loader },
    data: () => ({
      loginformstate: {},
      email: '',
      password: '',
      loginButtonLocked: false,
      emailInitialValid: true,
      passwordInitialValid: true,
    }),
    name: 'LoginForm',
    watch: {
      email() {
        this.emailInitialValid = false;
      },
      password() {
        this.passwordInitialValid = false;
      },
    },
    methods: {
      onSubmit() {
        this.loginButtonLocked = true;
        this.showLoading = true;
        this.errorBannerMessage = '';
        post(this.$axios,
          '/api/user/login',
          new LoginUserDto(
            this.email.trim(),
            this.password,
          ),
          async (resp: any) => {
            console.log(resp);
            this.showLoading = false;
            await this.sleep(200); // small sleep required
            setSessionInStorage(resp.data);
            await this.$router.push('/bitcoin/overview');
          },
          (err: any) => {
            this.handleRequestError(err, (errorCode: any) => {
              switch (errorCode) {
                case 0:
                  this.errorBannerMessage = 'Given password is incorrect.';
                  break;
                case 1:
                  this.errorBannerMessage = 'User is not registered.';
                  break;
                default:
                  this.errorBannerMessage = 'Unexpected server error';
              }
            });
            this.showLoading = false;
            this.loginButtonLocked = false;
            console.log(err);
          });
      },
    },
  });
</script>
