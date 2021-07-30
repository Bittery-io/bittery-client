<template>
  <q-card class="shadow-10 bg-grey-2" v-if="this.expiredUserLndDto">
    <q-card-section>
      <header-qchip :text="$q.platform.is.mobile ? 'Your LN node' : 'Your Lightning Network node'" icon="mdi-flash"></header-qchip>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-auto">
          <q-field dense label="Status" stack-label borderless>
            <q-chip dense square
                    color="red-8"
                    style="margin-left: 0;"
                    class="text-subtitle2"
                    text-color="white">
              EXPIRED
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-lightbulb-on"/>
            </template>
            <q-tooltip>
              Your node is expired - turned off and archived.
            </q-tooltip>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-auto">
          <q-field dense label="Expiration date" stack-label borderless>
            <q-chip color="grey"
                    class="text-subtitle2"
                    square
                    dense
                    style="margin-left: 0;"
                    text-color="white">
              {{ expirationDate }}
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-clock"/>
            </template>
            <q-tooltip>
              Your node expiration date. This is the date when node was turned off and archived.
            </q-tooltip>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-input dense
                   type="text"
                   onkeypress="return false;"
                   square
                   :value="this.expiredUserLndDto.publicKey"
                   label="Public key">
            <q-tooltip>
              The public address of your personal LN node.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-card-bulleted"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row justify-end">
        <div class="col-auto justify-end">
          <q-field dense readonly borderless label="" stack-label>
            <q-btn
              label="RENEW SUBSCRIPTION"
              class="full-width"
              color="red-8"
              icon="mdi-bitcoin"
              @click="$router.push('/account')">
            </q-btn>
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
import QrCodePopup from 'components/utils/QrCodePopup.vue';
import HeaderQchip from 'components/utils/HeaderQchip.vue';
import { formatDate } from 'src/api/date-service';

export default GlobalMixin.extend({
  components: { QrCode, QrCodePopup, HeaderQchip },
  name: 'ExpiredLndForm',
  props: {
    expiredUserLndDto: {
      type: Object,
      required: true,
    },
  },
  computed: {
    expirationDate() {
      return formatDate(this.expiredUserLndDto.expirationDate);
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
