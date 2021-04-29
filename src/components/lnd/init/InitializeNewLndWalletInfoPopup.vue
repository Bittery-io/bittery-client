<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
    <q-card>
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-head-question-outline" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-primary text-bold text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
             What is the LN Node Wallet?
            </div>
            <div class="text-primary text-orange-9 text-uppercase text-bold text-center q-pt-xs q-pb-xs" :class="isMobile ? 'text-h6' : 'text-h5'">
              24 words mnemonic + password
            </div>
            <div class="text-primary text-center text-subtitle2 q-pt-xs">
              • LN Node wallet manages funds of Bitcoin Lightning Network. It is required.<br>
              • 24 words mnemonic seed is encoded public/private key pair. <span class="text-red text-bold">You must keep it.</span><br>
              • Password protects access to your LN Node.
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn outline @click="close()" text-color="primary">Close</q-btn>
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

  export default GlobalMixin.extend({
    name: 'InitializeNewLndWalletInfoPopup',
    components: { Loader },
    props: {
      show: {
        type: Boolean,
        required: true,
      },
    },
    data() {
      return {
        showPopup: false,
        showLoading: false,
        restartButtonDisabled: false,
        restartClicked: false,
      };
    },
    watch: {
      show() {
        this.showPopup = true;
      },
    },
    methods: {
      close() {
        this.showPopup = false;
      },
    },
  });
</script>
