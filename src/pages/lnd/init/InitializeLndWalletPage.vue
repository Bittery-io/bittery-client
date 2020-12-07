<template>
  <q-page padding>
    <div class="text-center" :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row">
        <div class="col-grow">
          <h2 class="text-center" style="margin-bottom: 0;">Initialize LND wallet <q-icon name="mdi-wallet-plus"></q-icon></h2>
          <h5 class="text-center" style="margin-top: 1%;">Create LND personal wallet</h5>
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

export default GlobalMixin.extend({
  name: 'InitializeLndWalletPage',
  components: { InitializeNewLndWalletForm },
});
</script>
