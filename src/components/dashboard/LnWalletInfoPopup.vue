<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
    <q-card>
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-wallet" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-h5 text-primary text-bold text-center">
              <q-icon  size="md" name="mdi-flash" color="yellow-7"/>
              <span class="vertical-middle"> Your LN Node wallet</span>
            </div>
            <div class="text-primary text-left text-subtitle2 q-pt-xs">
              • Your LN Node wallet receives off-chain payments (Lightning Network)<br>
              • It is part of your Lightning Network Node<br>
              • This wallet doesn't contain funds of opened LN channels<br>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn @click="close()" outline text-color="orange-8">
          <q-icon left name="mdi-eye" />
          Show seed
        </q-btn>
        <q-btn outline @click="close()" text-color="primary">Close</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">

import GlobalMixin from 'src/mixins/global-mixin';
import { get } from 'src/api/http-service';
import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
import Loader from 'components/utils/Loader.vue';
import { sleep } from 'src/api/sleep-service';

export default GlobalMixin.extend({
  name: 'LnWalletInfoPopup',
  components: { Loader },
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
      userBtcWalletDto: null,
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
  },
});
</script>
