<template>
  <q-card class="shadow-10 bg-grey-2" v-if="this.userLndDto">
    <qr-code-popup :show="showQrCodePopup" :qr-code="userLndDto.lndConnectUrl"></qr-code-popup>
    <q-card-section>
    <header-qchip :text="$q.platform.is.mobile ? 'Your LN node' : 'Your Lightning Network node'" icon="mdi-flash"></header-qchip>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-12">
          <q-field label="Status" stack-label borderless>
            <q-chip :color="getColorDependingOfStatus(this.userLndDto.lndStatus)" style="margin-left: 0;"
                    text-color="white">
              {{this.userLndDto.lndStatus}}
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-lightbulb-on"/>
            </template>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-field label="Type" stack-label borderless>
            <q-chip square color="primary" outline style="margin-left: 0;" text-color="white">BITTERY HOSTED</q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-order-bool-descending"/>
            </template>
          </q-field>
        </div>
      </div>
      <div class="row" v-show="isNotTurnedOff">
        <div class="col-12">
          <q-input
            type="text"
            onkeypress="return false;"
            name="email"
            square
            :value="this.userLndDto.lndUrl"
            label="LND address">
            <q-tooltip>
              The public address of your personal LN node.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px; color: gold" name="mdi-flash"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-show="isNotTurnedOff">
        <div class="col-12">
          <q-input
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
          <q-input
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
          <q-input
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
          <q-input
            type="text"
            name="email"
            square
            onkeypress="return false;"
            v-model="this.userLndDto.rtlAddress"
            label="RTL address">
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-web"/>
            </template>
            <q-tooltip>
              Lightning Network node management console. Manage your node funds, channels and settings.
            </q-tooltip>
            <template v-slot:after>
              <q-btn
                flat
                color="primary"
                icon="mdi-arrow-right-bold-box-outline"
                @click="openUrlNewTab(userLndDto.rtlAddress)"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-show="isNotTurnedOff">
        <div class="col-12">
          <q-input
            :type="isPwd ? 'password' : 'text'"
            square
            onkeypress="return false;"
            v-model="this.userLndDto.rtlInitPassword"
            label="RTL initital password">
            <q-tooltip>
              Unique initial password for logging in RTL. Change the password as soon as possible directly in RTL.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-lock"/>
            </template>
            <template v-slot:after>
              <q-btn
                flat
                color="primary"
                :icon="isPwd ? 'visibility_off' : 'visibility'"
                @click="isPwd = !isPwd"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-show="isNotTurnedOff">
        <div class="col-12">
          <q-input
            type="text"
            name="email"
            square
            onkeypress="return false;"
            v-model="this.userLndDto.lndConnectUrl"
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
          <q-field readonly borderless label="Zap QR code" stack-label>
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
            <qr-code class="q-mt-xs" :mini="true" id="mini-user-qr-code" :text="userLndDto.lndConnectUrl"></qr-code>
          </q-field>
        </div>
      </div>
      <div class="row" v-show="!isNotTurnedOff">
        <div class="col-12">
          <q-field readonly borderless label="" stack-label>
            <q-banner  class="text-primary  bg-orange q-mb-xs">
              <template v-slot:avatar>
                <q-icon name="error" color="primary" />
              </template>
              Due to limited resources your personal LND node is currently turned off. Request turn on and you will queued to turning on soon. We will notify you with e-mail.
            </q-banner>
          </q-field>
        </div>
      </div>
      <div class="row" v-show="!isNotTurnedOff">
        <div class="col-12">
          <q-field readonly borderless label="" stack-label>
              <q-btn
                :disable="requestLndButtonDisabled"
                label="Request LND turn on"
                class="full-width"
                color="primary"
                icon="alarm_add"
                @click="requestLndRun"/>
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

  export default GlobalMixin.extend({
    components: { QrCode, QrCodePopup, HeaderQchip },
    name: 'UserLndForm',
    mixins: [ LndFormMixin ],
    props: {
      userLndDto: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        isPwd: true,
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
      requestLndRun() {
        post(this.$axios, '/api/lnd/request', {}, (res: any) => {
          this.requestLndButtonDisabled = true;
          showNotificationInfo('LND turn on requested.', 'You will be notified by e-mail.')
        }, () => {
          this.requestLndButtonDisabled = true;
          showNotificationError('LND turn on request failed.', 'Your request is probably in queue already. Please wait for e-mail notification.');
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
