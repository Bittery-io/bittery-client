<template>
  <q-card class="shadow-10 bg-grey-2" v-if="this.customLndDto">
    <q-card-section>
      <header-qchip :text="$q.platform.is.mobile ? 'Your LN node' : 'Your Lightning Network node'" icon="mdi-flash"></header-qchip>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-auto">
          <q-field label="Status" stack-label borderless>
            <q-chip :color="getColorDependingOfStatus(this.customLndDto.lndStatus)" style="margin-left: 0;"
                    text-color="white">
              {{this.customLndDto.lndStatus}}
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-lightbulb-on"/>
            </template>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          <q-field label="Type" stack-label borderless>
            <q-chip square color="primary" outline style="margin-left: 0;" text-color="white">USER HOSTED</q-chip>
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
            :value="this.customLndDto.lndUrl"
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
            :value="this.customLndDto.lndRestAddress"
            label="LN Node address (REST)">
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-api" />
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
            label="LN Node TLS certificate">
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
            :value="customLndDto.macaroonHex"
            label="LND custom macaroon (hex)">
            <template v-slot:before>
              <q-icon color="primary" style="width:50px" name="mdi-file-lock" />
            </template>
          </q-input>
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
  import QrCodePopup from 'components/utils/QrCodePopup.vue';
  import LndFormMixin from './mixins/lnd-form-mixin';
  import HeaderQchip from 'components/utils/HeaderQchip.vue';

  export default GlobalMixin.extend({
    components: { QrCode, QrCodePopup, HeaderQchip },
    mixins: [ LndFormMixin ],
    name: 'CustomLndForm',
    props: {
      customLndDto: {
        type: Object,
        required: true,
      },
    },
    methods: {
      downloadTls() {
        get(this.$axios, '/api/lnd/files/tls/custom', (res: any) => {
          this.downloadFile(res.data, 'tls.cert');
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
