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
            <div class="text-h5 text-primary text-bold text-center">
             How do I receive Bitcoin payments?
            </div>
            <div class="text-h5 text-primary text-orange-9 text-uppercase text-bold text-center q-pt-xs q-pb-xs" v-if="userHasElectrum">
              LN Node wallet + Electrum wallet
            </div>
            <div class="text-h5 text-primary text-orange-9 text-uppercase text-bold text-center q-pt-xs q-pb-xs" v-else>
              LN Node wallet + standard wallet
            </div>
            <div class="text-primary text-center text-subtitle2 q-pt-xs">
              • <span class="text-bold">off-chain</span> payments are received to the LN NODE WALLET<br>
              <span v-if="userHasElectrum">• <span class="text-bold">on-chain</span> (transactions) payments are received to your ELECTRUM WALLET<br></span>
              <span v-else>• <span class="text-bold">on-chain</span> (transactions) payments are received to the STANDARD WALLET<br></span>
              <span v-if="userHasElectrum">• Bittery cannot move funds controlled by your Electrum wallet</span>
              <span v-else>• STANDARD WALLET seed is encoded public/private key pair. <span class="text-red text-bold">You must keep it.</span></span>
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
    name: 'SetupNewPaymentsPopup',
    components: { Loader },
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      userHasElectrum: {
        type: Boolean,
        required: false,
        default: false,
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
