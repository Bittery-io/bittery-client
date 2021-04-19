<template>
  <q-card class="shadow-10 bg-grey-2" v-if="this.userLndDto.lndStatus === 'RUNNING'">
    <provide-master-password-popup :show="showMasterPasswordPopup"
                                   subheader="Password will be used for your data decryption"
                                   :loader-header="provideMasterPasswordPopupLoaderHeader"
                                   @passwordConfirmed="onMasterPasswordConfirmed">
    </provide-master-password-popup>
    <qr-code-popup :show="showQrCodePopup" :qr-code="userLndDto.lndConnectUri"></qr-code-popup>
    <q-card-section>
      <header-qchip text="LN Node Connectivity" icon="mdi-contactless-payment"></header-qchip>
    </q-card-section>
    <q-card-section>
      <div class="row" v-if="this.userLndDto.lndUri">
        <div class="col-12">
          <q-input dense
            type="text"
            onkeypress="return false;"
            name="email"
            square
            :value="this.userLndDto.lndUri"
            label="Lightning Address">
            <q-tooltip>
              The public address of your personal LN Node.
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
            label="LN Node address (REST)">
            <q-tooltip>
              Your personal LN Node REST API url.
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
            label="LN Node TLS certificate">
            <template v-slot:before>
              <q-icon color="primary" style="width:50px" name="mdi-attachment" />
            </template>
            <q-tooltip>
              TLS certificate for secure connection with your LND.
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
            label="LN Node admin macaroon [ENCRYPTED]">
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
      <div class="row" v-show="this.userLndDto.lndRestAddress">
        <div class="col-12">
          <q-input dense
                   onkeypress="return false;"
                   square
                   :type="lnPassword === 'initial_value' ? 'password' : 'text'"
                   :value="lnPassword"
                   label="LN Node password [ENCRYPTED]">
            <q-tooltip>
              Your personal LN Node unlocking password.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-key"/>
            </template>
            <template v-slot:after>
              <q-btn
                flat
                color="primary"
                icon="mdi-eye"
                @click="showLnPassword"/>
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
            label="LN Node Connect URI">
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
import ProvideMasterPasswordPopup from 'components/welcome/ProvideMasterPasswordPopup.vue';
import { decryptSymmetricCtr } from 'src/api/encryption-service';

export default GlobalMixin.extend({
  components: { ProvideMasterPasswordPopup, QrCode, QrCodePopup, HeaderQchip },
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
      showMasterPasswordPopup: false,
      provideMasterPasswordPopupLoaderHeader: '',
      encryptedAction: '',
      lnPassword: 'initial_value',
    };
  },
  computed: {
    isNotTurnedOff() {
      return this.userLndDto.lndStatus !== 'TURNED_OFF';
    },
  },
  methods: {
    onMasterPasswordConfirmed(masterPassword: string) {
      if (this.encryptedAction === 'macaroon') {
        get(this.$axios, `/api/lnd/${this.userLndDto.lndId}/files//macaroon`, (res: any) => {
          const encryptedMacaroon: string = res.data.encryptedArtefact;
          const decryptedMacaroonFile: string = decryptSymmetricCtr(encryptedMacaroon, masterPassword);
          this.downloadFile(decryptedMacaroonFile, 'admin.macaroon', 'base64');
        }, () => {
          showNotificationError('Downloading admin.macaroon failed', 'Internal server error occurred');
        });
      } else if (this.encryptedAction === 'password') {
        get(this.$axios, `/api/lnd/${this.userLndDto.lndId}/password`, (res: any) => {
          this.lnPassword = decryptSymmetricCtr(res.data.encryptedArtefact, masterPassword);
        }, () => {
          showNotificationError('Downloading admin.macaroon failed', 'Internal server error occurred');
        });
      }
    },
    downloadTls() {
      get(this.$axios, `/api/lnd/${this.userLndDto.lndId}/files//tls`, (res: any) => {
        this.downloadFile(res.data, 'tls.cert', 'binary');
      }, () => {
      });
    },
    downloadMacaroon() {
      this.provideMasterPasswordPopupLoaderHeader = 'Decrypting admin.macaroon file';
      this.showMasterPasswordPopup = !this.showMasterPasswordPopup;
      this.encryptedAction = 'macaroon';
    },
    showLnPassword() {
      this.provideMasterPasswordPopupLoaderHeader = 'Decrypting your LN Node password';
      this.showMasterPasswordPopup = !this.showMasterPasswordPopup;
      this.encryptedAction = 'password';
    },
    downloadFile(fileBase64: any, fileName: string, fileType: string) {
      const file = new Blob([Buffer.from(fileBase64, fileType)]);
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
