<template>
  <q-card class="shadow-10 bg-grey-2" v-if="this.userLndDto">
    <loader :show="showLoading"></loader>
    <unlock-lnd-popup :show="showLndUnlockPopup" :lnd-id="userLndDto.lndId"></unlock-lnd-popup>
    <qr-code-popup :show="showQrCodePopup" :qr-code="userLndDto.lndConnectUri"></qr-code-popup>
    <confirm-lnd-restart-popup :show="showConfirmLndRestartPopup" :lnd-id="userLndDto.lndId"></confirm-lnd-restart-popup>
    <q-card-section>
     <header-qchip :text="$q.platform.is.mobile ? 'Your LN Node' : 'Your Lightning Network Node'" icon="mdi-flash"></header-qchip>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-12">
          <q-field dense label="Status" stack-label borderless>
            <q-chip dense square
                    :color="getColorDependingOfStatus(this.userLndDto.lndStatus)"
                    style="margin-left: 0;"
                    text-color="white">
              {{getLabelDependingOfStatus(this.userLndDto.lndStatus)}}
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-lightbulb-on"/>
            </template>
            <q-tooltip>
              Your LN Node working status.
            </q-tooltip>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-field dense label="Type" stack-label borderless>
            <q-chip dense square color="primary" outline style="margin-left: 0;"
                    text-color="white">{{ this.userLndDto.hostedLndType }}</q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-order-bool-descending"/>
            </template>
            <q-tooltip>
              Your LN Node type.
            </q-tooltip>
          </q-field>
        </div>
      </div>
      <div class="row" v-show="this.userLndDto.rtlAddress">
        <div class="col-12">
          <q-input dense
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
              Ride The Lightning is the LN Node management tool. Manage your node funds, channels and settings.
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
      <div class="row" v-show="this.userLndDto.rtlOneTimeInitPassword">
        <div class="col-12">
          <q-input dense
            :type="isPwd ? 'password' : 'text'"
            square
            onkeypress="return false;"
            v-model="this.userLndDto.rtlOneTimeInitPassword"
            label="RTL initital password">
            <q-tooltip>
              Unique initial password for logging to RTL. Change the password as soon as possible directly in RTL.
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
      <div class="row justify-end">
        <div class="col-auto justify-end">
          <q-field readonly borderless label="" stack-label v-if="userLndDto && userLndDto.lndStatus === 'RUNNING'">
            <q-btn
              label="RESTART"
              color="primary"
              icon="mdi-restart"
              @click="showConfirmLndRestartPopup = !showConfirmLndRestartPopup"/>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-field readonly borderless label="" stack-label v-if="userLndDto && userLndDto.lndStatus === 'INIT_REQUIRED'">
            <q-btn
              :disable="userLndDto && !userLndDto.lndId"
              label="INITIALIZE LN WALLET"
              class="full-width"
              color="primary"
              icon="mdi-lock-open"
              @click="$router.push(`/lnd/setup/${userLndDto.lndId}/init/wallet`)"/>
          </q-field>
          <q-field readonly borderless label="" stack-label v-if="userLndDto && userLndDto.lndStatus === 'UNLOCK_REQUIRED'">
            <q-btn
              :disable="userLndDto && !userLndDto.lndId"
              label="UNLOCK LN NODE"
              class="full-width"
              color="primary"
              icon="mdi-lock-open"
              @click="showLndUnlockPopup = !showLndUnlockPopup"/>
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
  import ConfirmLndRestartPopup from 'components/lnd/ConfirmLndRestartPopup.vue';
  import Loader from 'components/utils/Loader.vue';

  export default GlobalMixin.extend({
    components: { QrCode, QrCodePopup, HeaderQchip, UnlockLndPopup, ConfirmLndRestartPopup, Loader },
    name: 'LndSummaryForm',
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
        showLndUnlockPopup: false,
        requestLndButtonDisabled: false,
        showConfirmLndRestartPopup: false,
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
      },
      onRestartClicked() {
        console.log('siemka');
        this.showLoading = true;
      },
      onRestartResponseReceived() {
        console.log('siemka2');
        this.showLoading = false;
      }
    },
  });

</script>
