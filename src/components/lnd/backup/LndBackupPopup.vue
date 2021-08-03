<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false" :position="isMobile ? 'bottom' : 'standard'">
    <loader :show="showLoading"></loader>
    <provide-master-password-popup :show="showConfirmMasterPasswordPopup"
                                   subheader="It is required for decrypting your LN Node backup components"
                                   @passwordConfirmed="onPasswordConfirmed"
                                   loader-header="Decrypting backup components">
    </provide-master-password-popup>
    <q-card class="bg-grey-2 text-subtitle2">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-folder-download" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-primary text-bold" :class="isMobile ? 'text-h6' : 'text-h5'">
              Download latest LN Node backup
            </div>
            <div class="text-subtitle2 text-primary text-center">
              Choose the components of your LN Node backup
            </div>
          </div>
        </div>
        <div class="row q-pt-md q-pl-lg q-pr-lg">
          <div class="col-auto">
            <q-checkbox dense v-model="lnSeedBackup" label="LN Node password"></q-checkbox>
          </div>
        </div>
        <div class="row q-pl-lg q-pr-lg q-pt-xs">
          <div class="col-auto">
            <q-checkbox dense v-model="lnNodePasswordBackup" label="LN Node wallet seed"></q-checkbox>
          </div>
        </div>
        <div class="row q-pl-lg q-pr-lg q-pt-xs">
          <div class="col-auto">
            <q-checkbox dense v-model="lnScbBackup" label="Static channel backup"></q-checkbox>
          </div>
        </div>
        <div class="row q-pl-lg q-pr-lg q-pt-xs">
          <div class="col-auto">
            <q-checkbox dense v-model="adminMacaroonBackup" label="admin.macaroon"></q-checkbox>
          </div>
        </div>
        <div class="row q-pl-lg q-pr-lg q-pt-xs">
          <div class="col-auto">
            <q-checkbox dense v-model="tlsCertBackup" label="tls.cert"></q-checkbox>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="center" class="text-primary">
        <q-btn outline @click="close()" text-color="primary">Close</q-btn>
        <q-btn @click="showConfirmMasterPasswordPopup = !showConfirmMasterPasswordPopup"
               color="primary"
               :disable="!(lnSeedBackup || lnNodePasswordBackup || lnScbBackup || adminMacaroonBackup || tlsCertBackup)">
          <q-icon left name="mdi-download" />
          Download
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">

import GlobalMixin from 'src/mixins/global-mixin';
import Loader from 'components/utils/Loader.vue';
import BitteryLogo from 'components/utils/BitteryLogo.vue';
import BitteryLogoAnimated from 'components/utils/BitteryLogoAnimated.vue';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import ProvideMasterPasswordPopup from 'components/welcome/ProvideMasterPasswordPopup.vue';
import { get } from 'src/api/http-service';
import { decryptSymmetricCtr } from 'src/api/encryption-service';
import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
import { LndFullBackupDto } from 'src/dto/lnd/backup/lnd-full-backup-dto';
import { sleep } from 'src/api/sleep-service';

export default GlobalMixin.extend({
  name: 'LndBackupPopup',
  components: { ProvideMasterPasswordPopup, BitteryLogoAnimated, BitteryLogo, Loader },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    lndId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showPopup: false,
      showLoading: false,
      lnSeedBackup: true,
      lnNodePasswordBackup: true,
      adminMacaroonBackup: true,
      lnScbBackup: true,
      tlsCertBackup: true,
      showConfirmMasterPasswordPopup: true,
    };
  },
  watch: {
    show() {
      this.showPopup = true;
    },
  },
  methods: {
    close() {
      this.showPopup = false;
    },
    async onPasswordConfirmed(password: string) {
      this.showLoading = true;
      get(this.$axios, `/api/lnd/${this.lndId}/full-backup?seed=${this.lnSeedBackup}&macaroon=${this.adminMacaroonBackup}&password=${this.lnNodePasswordBackup}&scb=${this.lnScbBackup}&tls=${this.tlsCertBackup}`, (res: any) => {
        const lndFullBackupDto: LndFullBackupDto = res.data;
        let zip = new JSZip();
        if (lndFullBackupDto.allStaticChannelsBackupDto) {
          zip.file(`static_channel_backup_${lndFullBackupDto.allStaticChannelsBackupDto.creationDate}`, lndFullBackupDto.allStaticChannelsBackupDto.scb);
        }
        if (lndFullBackupDto.lnPassword) {
          const lndPasswordDecrypted: string = decryptSymmetricCtr(lndFullBackupDto.lnPassword, password);
          zip.file('ln_node_password.txt', lndPasswordDecrypted);
        }
        if (lndFullBackupDto.adminMacaroon) {
          const adminMacaroonBase64Decrypted: string = decryptSymmetricCtr(lndFullBackupDto.adminMacaroon, password);
          zip.file('admin.macaroon', new Blob([Buffer.from(adminMacaroonBase64Decrypted, 'base64')]));
        }
        if (lndFullBackupDto.lnSeed) {
          const lnSeedDecrypted: string = decryptSymmetricCtr(lndFullBackupDto.lnSeed, password);
          zip.file('ln_node_wallet_seed.txt', lnSeedDecrypted);
        }
        if (lndFullBackupDto.tlsCert) {
          zip.file('tls.cert', lndFullBackupDto.tlsCert);
        }
        zip.generateAsync({type: "blob"}).then(async (content) => {
          const fileName: string = `ln_node_backup_${new Date().toISOString()}.zip`;
          FileSaver.saveAs(content, fileName);
          showNotificationInfo('LN Node full backup downloaded', `Successfully saved ${fileName}`);
          this.showLoading = false;
          await sleep(30);
          this.showPopup = false;
        });
      }, (err: any) => {
        showNotificationError('Getting LN Node backup failed', 'Unexpected server error occurred');
        this.showLoading = false;
        console.log(err);
      })
    }
  },
});
</script>
