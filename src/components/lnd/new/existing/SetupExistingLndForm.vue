<template>
  <div class="q-pa-xs">
    <loader :show="showLoading"></loader>
    <q-stepper
      :style="$q.platform.is.mobile ? `` : `width: ${screenWidth * 0.45}px`"
      v-model="step"
      vertical
      color="primary"
      bordered
      :class="isMobile ? 'mobile-stepper-full': ''"
      class="bg-grey-2"
      animated
    >
      <q-step
        :name="1"
        title="Overview"
        icon="info"
        class="text-left text-body1"
        :done="step > 1">
        Bittery connects to your Lightning Network node in order to provide payment services. <br>
        Please provide required (minimum trust) connection details to Bittery.<br>
        <div class="text-bold">
          Bittery has no possibility to access your LN funds. It's technically impossible.
        </div>
        Your LN node must be accessible through the Internet in order to be used with Bittery.<br>
        <q-stepper-navigation>
          <q-btn @click="step = 2" glossy color="primary" label="SETUP" icon="mdi-cog" :class="isMobile ? 'full-width' : ''"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="2"
        title="Provide LN node REST API address"
        icon="info"
        class="text-left text-body1"
        :done="step > 2">
        Provide your LN node REST API address <i>(e.g. mycustomnode:443 or 78.8.236.172:443).</i> <br>
        Your node <b>must support</b> encrypted communication (TLS).
        <div class="row q-pt-xs">
          <div class="col-12">
            <vue-form :state='lnRestState' @submit.prevent="() => {}">
              <validate>
                <q-input
                  outlined
                  bg-color="accent"
                  type="string"
                  ref="lndRestAddress"
                  name="lndRestAddress"
                  square
                  :dense="isMobile"
                  v-model="lndRestAddress"
                  required
                  label="Your LN node REST API address"
                  :rules="[ val => (lnRestState.lndRestAddress !== undefined && lnRestState.lndRestAddress.$valid) || 'REST API address is required',
                            val => (lnRestState.lndRestAddress !== undefined && !(lndRestAddress.toUpperCase().startsWith('HTTP') || lndRestAddress.includes('://'))) || 'Please skip the http/https prefix in the address.']">
                  <template v-slot:before>
                    https://
                  </template>
                </q-input>
              </validate>
            </vue-form>
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn glossy outline @click="step = 1" color="primary" label="Previous step" :class="isMobile ? 'full-width' : 'q-ml-sm'"
                 icon="mdi-arrow-left-bold"/>
          <q-btn glossy @click="step = 3" color="primary" :disabled="lndRestAddress === '' || lndRestAddress.toUpperCase().startsWith('HTTP')"
                 label="NEXT STEP" :class="isMobile ? 'q-mt-xs full-width' : 'q-ml-sm'"
                 icon-right="mdi-arrow-right-bold"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="3"
        title="Provide custom macaroon"
        icon="info"
        class="text-left text-body1"
        :done="step > 3">
        Generate <b>custom macaroon file</b>.
        The macaroon gives Bittery <b>minimum</b> permissions to deliver payment services (read/write invoices, read node general info <b>only</b>).
        <q-banner rounded class="text-white text-bold bg-primary q-mt-lg">
          <q-icon name="info" size="lg" color="white" />
          Run below command with lncli (Lightning Network cli) and copy the result.
          <q-input
            outlined
            square
            class="q-mt-xs"
            bg-color="grey-3"
            type="text"
            :dense="isMobile"
            onkeypress="return false;"
            value="lncli bakemacaroon info:read invoices:read invoices:write offchain:read"
            label="Macaroon bake command">
          </q-input>
          <div class="text-bold text-red q-pt-xs text-body2">
            NOTE: This macaroon doesn't give permissions to withdraw any funds from your LN node.
          </div>
        </q-banner>
        <div class="row q-pt-md">
          <div class="col-12">
            <vue-form :state='macaroonHexState' @submit.prevent="() => {}">
              <validate>
                <q-input
                  outlined
                  bg-color="accent"
                  type="string"
                  name="macaroonHex"
                  ref="macaroonHex"
                  square
                  :dense="isMobile"
                  v-model="macaroonHex"
                  label="Macaroon value"
                  required
                  :rules="[ val => (
                            macaroonHexState.macaroonHex !== undefined &&
                            macaroonHexState.macaroonHex.$valid) || 'Custom macaroon is required otherwise Bittery will not be able to utilize your LN node' ,
                            val => isMacaroonHex || 'Given macaroon is not correctly HEX encoded'
                            ]">
                  <template v-slot:prepend>
                    <q-icon color="primary" name="mdi-card-text-outline"/>
                  </template>
                </q-input>
              </validate>
            </vue-form>
          </div>
        </div>
        <q-stepper-navigation>
          <q-btn glossy outline @click="step = 2" color="primary" label="Previous step" :class="isMobile ? 'full-width' : 'q-ml-sm'"
                 icon="mdi-arrow-left-bold"/>
          <q-btn glossy @click="step = 4" color="primary" :disabled="!(macaroonHex !== '' && isMacaroonHex)" label="NEXT STEP"
                 :class="isMobile ? 'q-mt-xs full-width' : 'q-ml-sm'"
                 icon-right="mdi-arrow-right-bold"/>
        </q-stepper-navigation>
      </q-step>
      <q-step
        :name="4"
        title="Upload tls.cert"
        icon="info"
        class="text-left text-body1"
        :done="step > 4">
        Upload your LN node <b>tls.cert</b> file.<br>
        TLS certificate is required in order to securely connect to your Lightning Network node. <br>
        <file-reader label="Upload LN node tls.cert file"
                     file-name-filter="tls.cert"
                     file-type-filter="application/pkix-cert"
                     size-kb-limit="2"
                     class="q-pt-md"
                     @onFileUploaded="tlsCertFileUploaded"></file-reader>
        <q-stepper-navigation>
          <q-btn glossy outline @click="step = 3" color="primary" label="Previous step" :class="isMobile ? 'full-width' : 'q-ml-sm'"
                 icon="mdi-arrow-left-bold"/>
          <q-btn glossy @click="setupExistingLndNode"
                 color="primary"
                 label="SETUP YOUR LN NODE"
                 icon="mdi-cog-box"
                 :disabled="tlsCertFileText === ''"
                 :class="isMobile ? 'q-mt-xs full-width' : 'q-ml-sm'"/>

        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts">
  import GlobalMixin from "../../../../mixins/global-mixin";
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
        lndRestAddress: '',
        macaroonHex: '',
        tlsCertFileText: '',
        lnRestState: {},
        macaroonHexState: {},
      };
    },
    computed: {
      isMacaroonHex() {
        // @ts-ignore
        return /^[a-fA-F0-9]+$/.test(this.macaroonHex);
      },
    },
    methods: {
      tlsCertFileUploaded(fileTextData: string) {
        // @ts-ignore
        this.tlsCertFileText = fileTextData;
      },
      setupExistingLndNode() {
          // @ts-ignore
        this.errorBannerMessage = '';
          // @ts-ignore
        this.showLoading = true;
        post(this.$axios, '/api/lnd/external', {
          // @ts-ignore
          macaroonHex: this.macaroonHex,
          // @ts-ignore
          tlsCertFileText: this.tlsCertFileText,
          // @ts-ignore
          lndRestAddress: `https://${this.lndRestAddress}`,
        }, async (err: any) => {
          this.showLoading = false;
          await this.sleep(200); // small sleep required
          showNotificationInfo('Custom LND node added', 'Your node information successfully saved');
          await this.$router.push('/ln/overview');
        }, (err: any) => {
          let caption: string = 'Internal server error.';
          switch (err.response.data.errorCode) {
            case 0:
              caption = 'User already has LND';
              break;
            case 2:
              caption = 'Connection to node failed. Please verify the node is reachable and connection details you provided are correct (getting node info failed).';
          }
          this.showLoading = false;
          showNotificationError('Adding LND failed', caption);
          console.log(err);
        });
      },
    },
  });

</script>
