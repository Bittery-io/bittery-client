<template>
  <q-page padding>
    <initialize-new-lnd-wallet-info-popup :show="showPopup"></initialize-new-lnd-wallet-info-popup>
    <div class="text-center" :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row">
        <div class="col-grow">
          <h2 class="text-center" style="margin-bottom: 0;">Initialize LN Node wallet <q-icon name="mdi-wallet-plus"></q-icon></h2>
          <h5 class="text-center" style="margin-top: 1%;">Generate and save <b>24 words mnemonic seed</b>.<br>
            Secure your LN Node wallet with strong <b>password</b>.
          </h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-auto justify-center">
          <initialize-new-lnd-wallet-form></initialize-new-lnd-wallet-form>
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
