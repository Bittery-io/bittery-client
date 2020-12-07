<template>
  <q-page padding>
    <div class="text-center" :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center" style="margin-bottom: 0;">Start your LN node
          </h2>
          <h5 class="text-center" style="margin-top: 1%;">
            <b>Lightning Network</b> node.<br>
            Accept instant and super cheap Bitcoin payments.</h5>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12 col-xs-12 q-pa-xs justify-center">
          <customize-new-buy-node-card></customize-new-buy-node-card>
        </div>
      </div>
    </div>

  </q-page>
</template>

<script lang="ts">
import GlobalMixin from "../../../mixins/global-mixin";
import SetupNewLndForm from 'components/lnd/new/SetupNewLndForm.vue';
import LnNodeBuyCard from 'components/lnd/new/LnNodeBuyCard.vue';
import CustomizeNewBuyNodeCard from 'components/lnd/new/CustomizeNewBuyNodeCard.vue';

export default GlobalMixin.extend({
  name: 'SetupNewLndPage',
  components: { CustomizeNewBuyNodeCard, LnNodeBuyCard },
  data() {
    return {
      step: 1,
    };
  },
});
</script>
