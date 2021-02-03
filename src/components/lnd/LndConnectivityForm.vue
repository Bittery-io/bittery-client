<template>
  <q-card class="shadow-10 bg-grey-2" v-if="this.userLndDto.lndStatus === 'RUNNING'">
    <qr-code-popup :show="showQrCodePopup" :qr-code="userLndDto.lndConnectUri"></qr-code-popup>
    <q-card-section>
      <header-qchip text="LND Connectivity" icon="mdi-contactless-payment"></header-qchip>
    </q-card-section>
    <q-card-section>
      <div class="row" v-if="this.userLndDto.lndInfo && this.userLndDto.lndInfo.uri">
        <div class="col-12">
          <q-input dense
            type="text"
            onkeypress="return false;"
            name="email"
            square
            :value="this.userLndDto.lndInfo.uri"
            label="Lightning Address">
            <q-tooltip>
              The public address of your personal LN node.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px; color: gold" name="mdi-flash"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-show="this.userLndDto.lndRestAddress">
        <div class="col-12">
          <q-input dense
            type="text"
            onkeypress="return false;"
            name="email"
            square
            :value="this.userLndDto.lndRestAddress"
            label="LND node address (REST)">
            <q-tooltip>
              Your personal LN node REST API url.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-api"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-show="isNotTurnedOff">
        <div class="col-12">
          <q-input dense
            type="text"
            name="email"
            square
            onkeypress="return false;"
            value="tls.cert"
            label="LND node TLS certificate">
            <template v-slot:before>
              <q-icon color="primary" style="width:50px" name="mdi-attachment" />
            </template>
            <q-tooltip>
              TLS certificate for secure connection with your LN node.
            </q-tooltip>
            <template v-slot:after>
              <q-btn
                flat
                color="primary"
                icon="mdi-download"
                @click="downloadTls"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-show="isNotTurnedOff">
        <div class="col-12">
          <q-input dense
            type="text"
            name="email"
            square
            onkeypress="return false;"
            value="admin.macaroon"
            label="LND node admin macaroon">
            <template v-slot:before>
              <q-icon color="primary" style="width:50px" name="mdi-attachment" />
            </template>
            <q-tooltip>
              Do not share macaroon to anyone.
            </q-tooltip>
            <template v-slot:after>
              <q-btn
                flat
                color="primary"
                icon="mdi-download"
                @click="downloadMacaroon"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-show="isNotTurnedOff">
        <div class="col-12">
          <q-input dense
            type="text"
            name="email"
            square
            onkeypress="return false;"
            v-model="this.userLndDto.lndConnectUri"
            label="LND Connect URI">
            <q-tooltip>
              ZAP wallet connection URI.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-wallet"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-show="isNotTurnedOff">
        <div class="col-12">
          <q-field dense readonly borderless label="Zap QR code" stack-label>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-qrcode"/>
            </template>
            <q-tooltip>
              ZAP wallet connection QR code (scan on mobile).
            </q-tooltip>
            <template v-slot:after>
              <q-btn
                flat
                color="primary"
                icon="mdi-magnify-plus"
                @click="showQrCodePopup = !showQrCodePopup"/>
            </template>
            <qr-code class="q-mt-xs" :mini="true" id="mini-user-qr-code" :text="userLndDto.lndConnectUri"></qr-code>
          </q-field>
        </div>
      </div>
      </q-card-section>
  </q-card>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import QrCode from 'components/utils/QrCode.vue';
import { get, post } from 'src/api/http-service';
import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
import LndFormMixin from 'components/lnd/mixins/lnd-form-mixin';
import QrCodePopup from 'components/utils/QrCodePopup.vue';
import HeaderQchip from 'components/utils/HeaderQchip.vue';
import UnlockLndPopup from 'components/lnd/UnlockLndPopup.vue';

export default GlobalMixin.extend({
  components: { QrCode, QrCodePopup, HeaderQchip, UnlockLndPopup },
  name: 'LndConnectivityForm',
  mixins: [ LndFormMixin ],
  props: {
    userLndDto: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      requestLndButtonDisabled: false,
    };
  },
  computed: {
    isNotTurnedOff() {
      return this.userLndDto.lndStatus !== 'TURNED_OFF';
    },
  },
  methods: {
    downloadTls() {
      get(this.$axios, '/api/lnd/files/tls', (res: any) => {
        this.downloadFile(res.data.fileBase64, 'tls.cert');
      }, () => {
      });
    },
    downloadMacaroon() {
      get(this.$axios, '/api/lnd/files/macaroon', (res: any) => {
        this.downloadFile(res.data.fileBase64, 'admin.macaroon');
      }, () => {
      });
    },
    downloadFile(fileBase64: any, fileName: string) {
      const file = new Blob([Buffer.from(fileBase64, 'base64')]);
      if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file, fileName);
      } else { // Others
        const a = document.createElement("a");
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
        }, 0);
        showNotificationInfo(`File downloaded successfully.`, `File name: ${fileName}`);
      }
    }
  },
});

</script>
