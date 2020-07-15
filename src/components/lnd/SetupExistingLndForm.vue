<template>
  <div class="q-pa-xs">
    <loader :show="showLoading"></loader>
    <q-stepper
      :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.93}px` : `width: ${screenWidth * 0.35}px`"
      v-model="step"
      vertical
      color="primary"
      bordered
      class="bg-grey-2"
      animated
    >
      <q-step
        :name="1"
        title="Overview"
        icon="info"
        class="text-left text-subtitle1"
        :done="step > 1">
        Bitcoin LN node is a single user dedicated service which allows <br> to send/receive
        Bitcoin payments using Lightning Network. <br>
        Bittery communicates with LN node during Bitcoin payments processing this is why you must provide your node information. <br>
        <div class="text-bold">
          Bittery has no possibility to access your LN funds. It's technically impossible.
        </div>
        Your own Lightning Network must be accessible through the internet in order to be used with Bittery.<br>
        <q-stepper-navigation>
          <q-btn @click="step = 2" color="primary" label="PROCEED"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="2"
        title="Provide LND address"
        icon="info"
        class="text-left text-subtitle1"
        :done="step > 2">
        Provide your LND REST address (e.g. mycustomnode:8080 or 78.8.236.172:8080). <br>
        Your node must support encrypted communication (TLS).
        <div class="text-subtitle1 q-pt-md q-pb-md text-bold text-center">
          Step 1/3: Provide your LND REST address.
        </div>
        <div class="row">
          <div class="col-12">
              <q-input
                outlined
                bg-color="accent"
                type="string"
                name="amount"
                square
                v-model="lndRestAddress"
                label="LND REST address">
                <template v-slot:before>
                  https://
                </template>
              </q-input>
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn outline @click="step = 1" color="primary" label="Previous step"/>
          <q-btn @click="step = 3" color="primary" :disabled="lndRestAddress === ''" label="NEXT STEP" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Generate custom macaroon"
        icon="info"
        class="text-left text-subtitle1"
        :done="step > 3">
        Generate custom macaroon for Bittery. Required macaroon is minimum in order to give Bittery ability to generate new invoices (required by BTCPay).
        <q-banner rounded class="text-white text-bold bg-primary q-mt-lg">
          <q-icon name="info" size="lg" color="white" />
          Run below command with lncli (Lightning Network cli) and copy the result.
          <q-input
            outlined
            square
            class="q-mt-xs"
            bg-color="grey-3"
            type="text"
            onkeypress="return false;"
            value="lncli bakemacaroon info:read invoices:read invoices:write"
            label="Macaroon generation command">
          </q-input>
        </q-banner>
        <div class="text-subtitle1 q-pt-md q-pb-md text-bold text-center">
          Step 2/3: Provide generated macaroon encoded (hex) value.
        </div>
        <div class="row">
          <div class="col-12">
            <q-input
              outlined
              bg-color="accent"
              type="string"
              name="macaroon"
              square
              v-model="macaroonHex"
              label="Macaroon value">
            </q-input>
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn outline @click="step = 2" color="primary" label="Previous step"/>
          <q-btn @click="step = 4" color="primary" :disabled="macaroonHex === ''" label="NEXT STEP" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="4"
        title="Upload LND tls.cert"
        icon="info"
        class="text-left text-subtitle1"
        :done="step > 4">
        TLS certificate is required in order to connect securely to your Lightning Network node. <br>
        <div class="text-subtitle1 q-pt-md q-pb-md text-bold text-center">
          Step 3/3: Upload your LND tls.cert file.
        </div>
        <file-reader label="Upload tls.cert file" file-name-filter="tls.cert"
                     file-type-filter="application/pkix-cert" size-kb-limit="2" class="q-pt-md"
                     @onFileUploaded="tlsCertFileUploaded"></file-reader>
        <q-stepper-navigation>
          <q-btn outline @click="step = 3" color="primary" label="Previous step"/>
          <q-btn @click="setupExistingLndNode" color="primary" label="SAVE" :disabled="tlsCertFileText === ''" class="q-ml-sm"/>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";
  import ErrorPopup from 'components/utils/ErrorPopup.vue';
  import Loader from 'components/utils/Loader.vue';
  import FileReader from 'components/utils/FileReader.vue';
  import { post } from 'src/api/http-service';
  import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';

  export default GlobalMixin.extend({
    name: 'SetupNewLndForm',
    components: { ErrorPopup, Loader, FileReader },
    data() {
      return {
        step: 1,
        lndRestAddress: 'emergencja:445/lnd-rest/btc',
        macaroonHex: '0201036c6e64023d030a10aba9f16d82c6fb182f6e802cfd21ef721201301a0c0a04696e666f1204726561641a170a08696e766f6963657312047265616412057772697465000006205de3834d0334a41f200fef0c1bb303b4de98bd4802c84764014a9354025d726a',
        tlsCertFileText: '',
      };
    },
    methods: {
      tlsCertFileUploaded(fileTextData: string) {
        this.tlsCertFileText = fileTextData;
      },
      setupExistingLndNode() {
        this.errorBannerMessage = '';
        this.showLoading = true;
        post(this.$axios, '/api/lnd/existing', {
          macaroonHex: this.macaroonHex,
          tlsCertFileText: this.tlsCertFileText,
          lndRestAddress: `https://${this.lndRestAddress}`,
        }, async (err: any) => {
          this.showLoading = false;
          await this.sleep(200); // small sleep required
          showNotificationInfo('Custom LND node added', 'Your node information successfully saved');
          await this.$router.push('/bitcoin/overview');
        }, (err: any) => {
          let caption: string = 'Internal server error.';
          switch (err.response.data.errorCode) {
            case 0:
              caption = 'User already has LND';
              break;
            case 2:
              caption = 'Connection to node failed. Please verify the node is reachable and connection details you provided are correct.';
          }
          this.showLoading = false;
          showNotificationError('Adding LND failed', caption);
          console.log(err);
        });
      },
    },
  });

</script>
