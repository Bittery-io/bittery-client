<template>
  <q-card class="q-ma-md shadow-10 bg-grey-2" v-if="this.userLndDto">
    <qr-code-popup :show="showQrCodePopup" :qr-code="userLndDto.lndConnectUrl"></qr-code-popup>
    <q-card-section>
    <header-qchip text="Your Lightning Network node" icon="mdi-flash"></header-qchip>
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
              <q-icon style="width:50px;" color="primary" name="mdi-alarm-light"/>
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
      <div class="row">
        <div class="col-12">
          <q-input
            type="text"
            onkeypress="return false;"
            name="email"
            square
            :value="this.userLndDto.lndUrl"
            label="LND address">
            <template v-slot:before>
              <q-icon style="width:50px; color: gold" name="mdi-flash"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-input
            type="text"
            onkeypress="return false;"
            name="email"
            square
            :value="this.userLndDto.lndRestAddress"
            label="LND node address (REST)">
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-api"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row">
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
      <div class="row">
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
      <div class="row">
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
            <template v-slot:after>
              <q-btn
                flat
                color="primary"
                icon="mdi-arrow-right-bold-box-outline"
                @click="openUrl(userLndDto.rtlAddress)"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-input
            type="text"
            name="email"
            square
            onkeypress="return false;"
            v-model="this.userLndDto.lndConnectUrl"
            label="LND Connect URI">
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-wallet"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-field readonly borderless label="Zap QR code" stack-label>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-qrcode"/>
            </template>
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
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";
  import QrCode from 'components/utils/QrCode.vue';
  import { get } from 'src/api/http-service';
  import { showNotificationInfo } from 'src/api/notificatios-api';
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
    methods: {
      downloadTls() {
        get(this.$axios, '/api/lnd/files/tls', (res: any) => {
          this.downloadFile(res.data, 'tls.cert');
        }, () => {
        });
      },
      downloadMacaroon() {
        get(this.$axios, '/api/lnd/files/macaroon', (res: any) => {
          this.downloadFile(res.data, 'admin.macaroon');
        }, () => {
        });
      },
      downloadFile(fileBlob: any, fileName: string) {
        const file = new Blob([fileBlob], { type: 'binary' });
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
