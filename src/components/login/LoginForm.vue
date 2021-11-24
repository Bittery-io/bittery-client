<template>
  <div class="row">
    <div class="col-grow">
      <loader :show="showLoading"></loader>
      <error-popup header="Login failed"
                   :error-message="errorBannerMessage"
                   :show="errorBannerMessage !== ''">
      </error-popup>
      <mainnet-popup :show="showMainnetPopup" :is-after-login="true"></mainnet-popup>
      <vue-form :state='loginformstate' @submit.prevent="onSubmit">
        <div class="row q-pa-xs" >
          <div class="col-grow">
            <validate>
              <q-input
                outlined
                bg-color="accent"
                square
                type="text"
                name="email"
                v-model="email"
                label="E-mail address"
                required
                :rules="[ val => (
                        loginformstate.email !== undefined &&
                        loginformstate.email.$valid) || 'E-mail address is required']">
                <template v-slot:prepend>
                  <q-icon color="primary" name="mdi-account "/>
                </template>
              </q-input>
            </validate>
          </div>
        </div>
        <div class="row q-pa-xs" >
          <div class="col-grow">
            <validate>
              <q-input
                outlined
                bg-color="accent"
                square
                name="password"
                v-model="password"
                label="Password"
                :type="isPwd ? 'password' : 'text'"
                :rules="[ val => (
                        loginformstate.password !== undefined &&
                        loginformstate.password.$valid) || 'Password is required']"
                required>
                <template v-slot:prepend>
                  <q-icon color="primary" name="mdi-lock "/>
                </template>
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"/>
                </template>
              </q-input>
            </validate>
          </div>
        </div>
        <div class="row q-pa-xs">
          <div class="col-grow">
            <q-btn glossy type="submit"
                   color="primary"
                   icon="mdi-login"
                   label="SIGN IN"
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
              Don't have account yet? Sign up.
            </q-chip>
          </div>
        </div>
        <div class="row q-pa-xs">
          <div class="col-grow">
            <q-chip clickable icon="mdi-account-lock" class="shadow-10" @click="$router.push('/password/reset')" color="grey-8" text-color="white">
              Forgot your password?
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
  import sha256 from 'js-sha256';
  import MainnetPopup from 'components/MainnetPopup.vue';

  export default GlobalMixin.extend({
    components: { MainnetPopup, ErrorPopup, Loader },
    data: () => ({
      loginformstate: {},
      email: 'peerzet3@gmail.com',
      password: 'asdf',
      loginButtonLocked: false,
      emailInitialValid: true,
      passwordInitialValid: true,
      isPwd: true,
      showMainnetPopup: false,
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
            // @ts-ignore
            sha256(this.password),
          ),
          async (resp: any) => {
            this.showLoading = false;
            await this.sleep(200); // small sleep required
            setSessionInStorage(resp.data);
            this.showMainnetPopup = true;
            await this.sleep(200); // small sleep required
            //this is now moved to testnet popup
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
