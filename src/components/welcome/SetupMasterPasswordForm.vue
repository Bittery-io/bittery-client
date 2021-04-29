<template>
  <div class="q-pa-xs">
    <loader :show="showLoading"></loader>
    <error-popup header="Payments setup failed"
                 :error-message="errorBannerMessage"
                 :show="errorBannerMessage !== ''">
    </error-popup>
    <confirm-setup-master-password-popup :show="showConfirmMasterPasswordPopup"
                                         :master-password="masterPassword"
                                          @masterPasswordSet="onMasterPasswordSet">
    </confirm-setup-master-password-popup>
    <master-password-successfully-set-popup :show="showMasterPasswordSuccessfullySetPopup">

    </master-password-successfully-set-popup>
    <q-stepper
      v-model="step"
      bordered
      class="bg-grey-2"
      vertical
      :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.93}px` : `width: ${screenWidth * 0.45}px`"
      color="primary"
      animated>
      <q-step
        :name="1"
        title="Setup master password"
        icon="info"
        class="text-left"
        :done="step > 1">
        <div class="text-body1 q-pb-md">
          Bitcoin consist of multiple components like seeds, files or keys which require <b>private and safe</b> storage. <br>
          The <b>master password</b> will be used for encrypting your sensitive Bitcoin data used for providing you payment services.
          All the data will be <b>client-side</b> encrypted.<br>
          Bittery will <b>not know</b> your password and will never be able to use it for decrypting your data. <br>
          Only you will be able to decrypt the data.<br>
        </div>
        <warning-info-banner text="Bittery will not store your password and will not be able to restore it in case you lose it."></warning-info-banner>

        <vue-form :state='passwordState' @submit.prevent="() => {}">
          <div class="row q-pt-xs">
            <div class="col-12">
              <validate>
                <q-input
                  outlined
                  square
                  bg-color="accent"
                  name="masterPassword"
                  ref="masterPassword"
                  v-model="masterPassword"
                  label="Master password"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[ val => (passwordState.masterPassword !== undefined && passwordState.masterPassword.$valid) || 'Password is required',
                            val => (masterPassword.trim() !== '') || 'Password cannot be empty',
                            val => masterPasswordIsCorrect || 'Master password must have at least 10 letters, one number and special character',
                          ]"
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
          <div class="row q-pt-xs">
            <div class="col-12">
              <validate>
                <q-input
                  outlined
                  square
                  bg-color="accent"
                  name="masterPasswordRepeat"
                  ref="masterPasswordRepeat"
                  v-model="masterPasswordRepeat"
                  min-length="10"
                  label="Master password repeat"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[ val => (
                        passwordState.masterPasswordRepeat !== undefined &&
                        passwordState.masterPasswordRepeat.$valid) || 'Please repeat your password',
                         val => (
                        passwordState.masterPasswordRepeat !== undefined &&
                        masterPassword === masterPasswordRepeat) || 'Passwords don\'t match',
                        val => (masterPasswordRepeat.trim() !== '') || 'Password cannot be empty']"
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
        </vue-form>
        <q-stepper-navigation class="text-center">
          <q-btn @click="showConfirmMasterPasswordPopup = !showConfirmMasterPasswordPopup"
                 icon="mdi-key" :disable="masterPassword === '' || (masterPassword !== masterPasswordRepeat)"
                 color="primary" label="Setup master password" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import ErrorPopup from 'components/utils/ErrorPopup.vue';
import Loader from 'components/utils/Loader.vue';
import WarningInfoBanner from 'components/utils/WarningInfoBanner.vue';
import ConfirmSetupMasterPasswordPopup from 'pages/welcome/ConfirmSetupMasterPasswordPopup.vue';
import MasterPasswordSuccessfullySetPopup from 'pages/welcome/MasterPasswordSuccessfullySetPopup.vue';

export default GlobalMixin.extend({
  name: 'SetupMasterPasswordForm',
  components: { MasterPasswordSuccessfullySetPopup, ConfirmSetupMasterPasswordPopup, WarningInfoBanner, ErrorPopup, Loader },
  data() {
    return {
      step: 1,
      passwordState: {},
      showConfirmMasterPasswordPopup: false,
      showMasterPasswordSuccessfullySetPopup: false,
      masterPassword: '',
      masterPasswordRepeat: '',
      isPwd: true,
      passwordRegexp: new RegExp(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{10,}$/),
    };
  },
  computed: {
    masterPasswordIsCorrect() {
      return this.passwordRegexp.test(this.masterPassword);
    },
  },
  methods: {
    onMasterPasswordSet() {
      this.sleep(200)
      this.showMasterPasswordSuccessfullySetPopup = true;
    }
  }
});

</script>
