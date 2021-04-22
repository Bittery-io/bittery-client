<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
    <loader :show="showLoading" :message="loaderHeader"></loader>
    <q-card>
      <q-card-section style="padding-bottom: 0 !important;">
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-key" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-h5 text-primary text-center">
              Provide your <b>master password</b>
            </div>
            <div class="text-subtitle2 text-primary text-center">
              {{subheader}}
            </div>
            <vue-form :state='masterPasswordState' @submit.prevent="() => {}">
              <validate>
                <q-input
                  class="q-pt-md"
                  outlined
                  square
                  bg-color="accent"
                  name="password"
                  ref="password"
                  v-model="password"
                  label="Master password"
                  :type="isPwd ? 'password' : 'text'"
                  :rules="[ val => (
                            masterPasswordState.password !== undefined &&
                            masterPasswordState.password.$valid) || 'Master password is required',
                            val => passwordMatchingPasswordProof || 'Your master password is incorrect']"
                  required>
                  <template v-slot:prepend>
                    <q-icon color="primary" name="mdi-key"/>
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"/>
                  </template>
                </q-input>
              </validate>
            </vue-form>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn @click="confirmPassword" color="primary" :disable="!passwordMatchingPasswordProof">Submit</q-btn>
        <q-btn outline @click="close()" text-color="primary">Close</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">
import Loader from 'components/utils/Loader.vue';
import GlobalMixin from '../../mixins/global-mixin';
import { getPasswordProof } from 'src/api/session-service';
import { isPasswordMatchingProof } from 'src/api/password-proof-service';

export default GlobalMixin.extend({
  name: 'ProvideMasterPasswordPopup',
  components: { Loader },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    subheader: {
      type: String,
      required: false,
      default: '',
    },
    loaderHeader: {
      type: String,
      required: false,
      default: 'Encrypting data',
    },
  },
  data() {
    return {
      isPwd: true,
      showPopup: false,
      password: '',
      masterPasswordState: {},
      unlockButtonDisabled: false,
    };
  },
  watch: {
    show() {
      this.showPopup = true;
    },
  },
  computed: {
    passwordMatchingPasswordProof() {
      return isPasswordMatchingProof(this.password, getPasswordProof());
    },
  },
  methods: {
    close() {
      this.password = '';
      this.showPopup = false;
    },
    async confirmPassword() {
      this.showLoading = true;
      await this.sleep(1500);
      this.showLoading = false;
      await this.sleep(100);
      this.$emit('passwordConfirmed', this.password);
      this.close();
    },
  },
});
</script>