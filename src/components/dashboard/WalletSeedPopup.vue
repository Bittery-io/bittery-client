<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" class="bg-primary" :position="isMobile ? 'bottom' : 'standard'">
    <q-card class="bg-primary">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-white">
            <q-icon size="xl" name="mdi-format-list-numbered-rtl" color="text-white"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-white text-bold text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              <span class="vertical-middle">{{header}}</span>
            </div>
            <q-banner rounded class="text-white text-bold bg-primary q-mt-md">
              <q-icon name="info" size="lg" color="white" />{{subheader}}<br>
              <q-input
                outlined
                class="q-mt-xs"
                bg-color="grey-3"
                :type="isMnemonicPwd ? 'password' : 'text'"
                onkeypress="return false;"
                square
                :value="seed"
                label="Your 24 words mnemonic">
                <template v-slot:prepend>
                  <q-icon color="primary" name="mdi-format-list-numbered-rtl"/>
                </template>
                <template v-slot:after>
                  <q-btn
                    flat
                    color="grey"
                    :icon="isMnemonicPwd ? 'mdi-eye' : 'mdi-eye-off'"
                    @click="isMnemonicPwd = !isMnemonicPwd"/>
                </template>

              </q-input>
              <div class="text-bold text-red q-pt-xs text-body2">
                REMEMBER: Knowing the seed equals having Bitcoin. Don't share this seed to anyone.
              </div>
            </q-banner>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn glossy outline @click="close()" text-color="white">Close</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">

import GlobalMixin from 'src/mixins/global-mixin';
import { get } from 'src/api/http-service';
import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
import Loader from 'components/utils/Loader.vue';
import { sleep } from 'src/api/sleep-service';
import ProvideMasterPasswordPopup from 'components/welcome/ProvideMasterPasswordPopup.vue';

export default GlobalMixin.extend({
  name: 'WalletSeedPopup',
  components: { Loader },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    seed: {
      type: String,
      required: true,
    },
    header: {
      type: String,
      required: true,
    },
    subheader: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      showPopup: false,
      showLoading: false,
      isMnemonicPwd: true,
    };
  },
  mounted() {
  },
  computed: {
  },
  watch: {
    show() {
      this.showPopup = true;
    },
  },
  methods: {
    close() {
      // niepoprawne ale odswieza strone - wiec okej
      this.$router.go('/dashboard');
    },
  },
});
</script>
