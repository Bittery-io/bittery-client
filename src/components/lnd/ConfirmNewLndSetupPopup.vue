<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <loader :show="showLoading" message="Please wait and don't close the window. LN Node setup can take up to 5 minutes."></loader>
    <error-popup header="LND setup failed"
                 :error-message="errorBannerMessage"
                 :show="errorBannerMessage !== ''">
    </error-popup>
    <q-card class="bg-grey-2">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-flash" :color="type === 'ENCRYPTED' ? 'yellow-10': 'yellow-7'"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-primary text-bold text-center" :class="isMobile ? 'text-h6' : 'text-h5'">
              Ready to setup your Lightning node?
            </div>
            <div class="text-subtitle1 text-center">
              Selected plan: <b>{{selectedPlan}}</b><br>
            </div>
            <div class="text-subtitle2 text-center">
              Your node will be ready to use just after setup finish.
            </div>

          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn glossy outline @click="close()" text-color="primary" :disable="buttonsDisabled">Close</q-btn>
        <q-btn glossy @click="setupNewLndNode"  color="primary" icon="mdi-flash" text-color="white" :disable="buttonsDisabled">Setup</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">

  import GlobalMixin from 'src/mixins/global-mixin';
  import { get, post } from 'src/api/http-service';
  import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
  import Loader from 'components/utils/Loader.vue';
  import { sleep } from 'src/api/sleep-service';
  import { CreateLndDto } from 'src/dto/lnd/create-lnd-dto';
  import { HostedLndType } from 'src/dto/lnd/hosted-lnd-type';
  import ErrorPopup from 'components/utils/ErrorPopup.vue';

  export default GlobalMixin.extend({
    name: 'ConfirmNewLndSetupPopup',
    components: { Loader, ErrorPopup },
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      type: {
        type: String,
        required: true,
        default: undefined,
      },
    },
    data() {
      return {
        showPopup: false,
        showLoading: false,
        restartClicked: false,
        buttonsDisabled: false,
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
      async setupNewLndNode() {
        this.buttonsDisabled = true;
        this.errorBannerMessage = '';
        this.showLoading = true;
        // no alias, will be random
        post(this.$axios, '/api/lnd', new CreateLndDto(<HostedLndType>this.type), async () => {
          this.showLoading = false;
          await this.sleep(200); // small sleep required
          showNotificationInfo('LN Node setup succeed', 'Your personal Lightning Network Node is now online');
          // @ts-ignore
          await sleep(2500);
          await this.$router.push('/ln/overview');
        }, async (err: any) => {
          showNotificationError('LN Node setup failed', 'Your personal Lightning Network Node is online');
          await sleep(100);
          this.showLoading = false;
          await sleep(100);
          console.log(err);
          this.close();
        });
      },
    },
    computed: {
      selectedPlan() {
        if (this.type === 'STANDARD') {
          return 'Bittery Standard';
        } else {
          return 'Bittery Encrypted';
        }
      },
    },
  });
</script>
