<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <loader :show="showLoading"></loader>
    <q-card class="bg-grey-2">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-restart" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-primary text-bold text-center" v-if="turnedOff" :class="isMobile ? 'text-h6' : 'text-h5'">
             Do you really want to turn on your LN Node?
            </div>
            <div class="text-primary text-bold text-center" v-else :class="isMobile ? 'text-h6' : 'text-h5'">
              Do you really want to restart your LN Node?
            </div>
            <div class="text-primary text-center text-subtitle2 q-pt-xs">
              <span class="text-red">• It will require unlocking with master password after restart.</span><br>
              • It will be unusable and offline for few minutes. <br>
              • It will disable your off-chain payment services. <br>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn glossy outline @click="close()" text-color="primary">Close</q-btn>
        <q-btn glossy @click="restartClicked=true" v-if="!restartClicked" color="primary" icon="mdi-restart" text-color="white" :disable="restartButtonDisabled">{{ turnedOff ? 'Turn on' : 'Restart'}}</q-btn>
        <q-btn glossy @click="restartLnd()" v-else color="red" icon="mdi-restart" text-color="white" :disable="restartButtonDisabled">Confirm</q-btn>
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
    name: 'ConfirmLndRestartPopup',
    components: { Loader },
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      lndId: {
        type: String,
        required: true,
        default: undefined,
      },
      turnedOff: {
        type: Boolean,
        required: false,
        default: false,
      }
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
        this.restartClicked = false;
      },
    },
    methods: {
      close() {
        this.showPopup = false;
      },
      async restartLnd() {
        this.restartButtonDisabled = true;
        this.showLoading = true;
        await sleep(100);
        get(this.$axios, `/api/lnd/${this.lndId}/restart`, async (res: any) => {
          showNotificationInfo('LND successfully restarted.', 'Unlock is now required.')
          await sleep(2000);
          this.showLoading = false;
          await sleep(100);
          // @ts-ignore
          this.$router.go('/ln/overview');
        }, async () => {
          showNotificationError('LND unlock failed!', 'Error occurred on LND restarting');
          await sleep(100);
          this.showLoading = false;
          await sleep(100);
          this.close();
        })
      }
    },
  });
</script>
