<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
    <loader :show="showLoading"></loader>
    <q-card class="bg-grey-2">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-folder-download" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-h5 text-primary text-bold text-center">
              Download your LN Node backup
            </div>
            <div class="text-subtitle1 text-primary text-center">
              Choose the components of your LN Node backup
            </div>
          </div>
        </div>
        <div class="row q-pt-md q-pl-lg q-pr-lg">
          <div class="col-auto">
            <q-checkbox dense v-model="lnSeedBackup" label="Node password"></q-checkbox>
          </div>
        </div>
        <div class="row q-pl-lg q-pr-lg q-pt-xs">
          <div class="col-auto">
            <q-checkbox dense v-model="lnNodePasswordBackup" label="Node seed"></q-checkbox>
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
        <q-btn @click="extendSubscription()" color="primary" :disable="!(lnSeedBackup || lnNodePasswordBackup || lnScbBackup || adminMacaroonBackup || tlsCertBackup)">
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

export default GlobalMixin.extend({
  name: 'LndBackupPopup',
  components: { BitteryLogoAnimated, BitteryLogo, Loader },
  props: {
    show: {
      type: Boolean,
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
    async extendSubscription() {
      let zip = new JSZip();
      zip.file("idlist.txt", `PMID:29651880\r\nPMID:29303721`);
      zip.generateAsync({type: "blob"}).then(function(content) {
        FileSaver.saveAs(content, "download.zip");
      });
    }
  },
});
</script>
