<template>
  <q-page padding>
    <div class="text-center" :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center" style="margin-bottom: 0;">LN Node hosting
            <q-img
              src="statics/lnd.png" :style="$q.platform.is.mobile ? 'width: 20%' : 'width: 8%'">
            </q-img>
          </h2>
          <h5 class="text-center" style="margin-top: 1%;">Choose your personal, private <b>Lightning Network Node</b> hosting plan.<br>
            Use Bitcoin second layer - <span class="text-bold">instant and super cheap</span> off-chain transactions.</h5>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6 col-xs-12 q-pa-xs justify-center">
          <ln-node-buy-card
            title="Standard Lightning Node"
            type="STANDARD"
          ></ln-node-buy-card>
        </div>
        <div class="col-lg-6 col-xs-12 q-pa-xs justify-center">
          <ln-node-buy-card
            title="Encrypted Lightning Node"
            type="ENCRYPTED"
          ></ln-node-buy-card>
        </div>
      </div>
      <div class="row q-pt-md justify-center">
        <div class="col-auto">
          <ln-info-chip></ln-info-chip>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import GlobalMixin from "../../../mixins/global-mixin";
import SetupNewLndForm from 'components/lnd/new/SetupNewLndForm.vue';
import LnNodeBuyCard from 'components/lnd/new/LnNodeBuyCard.vue';
import LnInfoChip from 'pages/lnd/LnInfoChip.vue';

export default GlobalMixin.extend({
  name: 'SetupNewLndPage',
  components: { LnInfoChip, SetupNewLndForm, LnNodeBuyCard },
  data() {
    return {
      step: 1,
    };
  },
});
</script>
