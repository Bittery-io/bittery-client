<template>
  <q-page>
    <div class="row items-center justify-center">
      <div class="col-auto">
        <div class="row q-pt-md">
          <div class="col-12 justify-center">

            <div class="text-center" :class="isMobile ? 'text-h3' : 'text-h2'"> <img
              src="statics/BITTERY-2.gif"
              :style="isMobile ? 'width:150px; height:75px;' : 'width:220px; height:100px;'"
            /></div>
            <div class="text-h5 text-center q-pb-md" style="margin-top: 1%;">Bittery professional subscription plan.<br>
              Payment services backed by <span class="text-bold">personal Lightning Network Node</span> and Bittery tooling.
            </div>
          </div>
        </div>
        <div class="row justify-center">
          <div class="col-lg-4 col-xs-12 q-pa-xs justify-center">
            <ln-node-buy-card
              title="Standard"
              type="STANDARD"
            ></ln-node-buy-card>
          </div>
          <div class="col-lg-4 col-xs-12 q-pa-xs justify-center">
            <ln-node-buy-card
              title="Encrypted"
              type="ENCRYPTED"
            ></ln-node-buy-card>
          </div>
        </div>
        <div class="row q-pt-md q-pb-md justify-center">
          <div class="col-auto">
            <ln-info-chip></ln-info-chip>
          </div>
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
