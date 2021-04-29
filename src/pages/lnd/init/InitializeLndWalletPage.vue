<template>
  <q-page>
    <div class="row items-center justify-center text-center" :style="`height:${screenHeight - 50}px`">
      <div class="col-auto">
        <initialize-new-lnd-wallet-info-popup :show="showPopup"></initialize-new-lnd-wallet-info-popup>
        <div class="row">
          <div class="col-grow">
            <div class="text-center" :class="isMobile ? 'text-h3' : 'text-h2'">Initialize LN Node wallet
              <q-icon name="mdi-wallet-plus"></q-icon>
            </div>
            <div class="text-h5 text-center">Generate and save <b>24 words mnemonic seed</b>.<br>
              Secure your LN Node wallet with strong <b>password</b>.
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto justify-center">
            <initialize-new-lnd-wallet-form></initialize-new-lnd-wallet-form>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import GlobalMixin from "../../../mixins/global-mixin";
import InitializeNewLndWalletForm from 'components/lnd/init/InitializeNewLndWalletForm.vue';
import InitializeNewLndWalletInfoPopup from 'components/lnd/init/InitializeNewLndWalletInfoPopup.vue';

export default GlobalMixin.extend({
  name: 'InitializeLndWalletPage',
  components: { InitializeNewLndWalletInfoPopup, InitializeNewLndWalletForm },
  data() {
    return {
      showPopup: false,
    };
  },
  mounted() {
    this.showPopup= true;
  }
});
</script>
