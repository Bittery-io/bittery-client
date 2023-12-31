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
      :class="isMobile ? 'mobile-stepper-full' : ''"
      class="bg-grey-2"
      vertical
      :style="isMobile ? '' : `width: ${screenWidth * 0.45}px`"
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
                            val => masterPasswordIsCorrect || 'Master password must have at least 10 letters, 1 capital letter, 1 digit and 1 special character',
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
          <div class="row" :class="isMobile ? 'q-pt-md' : `q-pt-xs`">
            <div class="col-12">
              <validate>
                <q-input
                  outlined
                  square
                  bg-color="accent"
                  name="masterPasswordRepeat"
                  ref="masterPasswordRepeat"
                  v-model="masterPasswordRepeat"
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
          <div class="row" :class="isMobile ? 'q-pt-md' : `q-pt-xs`">
            <div class="col-12 text-bold text-body1">
              <validate>
                <q-checkbox v-model="understandRules" label="I understand I cannot lose my master password because there is no technical possibility to reset, restore or remind it">
                </q-checkbox>
              </validate>
            </div>
          </div>
        </vue-form>
        <q-stepper-navigation class="text-center">
          <q-btn glossy @click="showConfirmMasterPasswordPopup = !showConfirmMasterPasswordPopup"
                 icon="mdi-key" :disable="!masterPasswordIsCorrect || !understandRules || (masterPassword === '' || (masterPassword !== masterPasswordRepeat))"
                 color="primary" label="Setup master password"
                 :class="isMobile ? 'full-width q-mt-xs' : ''"/>
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
      masterPassword: process.env.MASTER_PASSWORD ?? '',
      masterPasswordRepeat: process.env.MASTER_PASSWORD ?? '',
      isPwd: true,
      understandRules: Boolean(process.env.UNDERSTAND_MASTER_PASSWORD_CHECKBOX) === true,
      //10 characters, 1 number, 1 capital letter and 1 special character
      passwordRegexp: new RegExp(/^(?=[^A-Z\s]*[A-Z])(?=[^a-z\s]*[a-z])(?=[^\d\s]*\d)(?=\w*[\W_])\S{10,}$/),
    };
  },
  computed: {
    masterPasswordIsCorrect() {
      if (Boolean(process.env.IS_DEV)) {
        return true;
      } else {
        // @ts-ignore
        return this.passwordRegexp.test(this.masterPassword);
      }
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
