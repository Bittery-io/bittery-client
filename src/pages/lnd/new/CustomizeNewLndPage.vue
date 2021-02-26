<template>
  <q-page padding>
    <div class="text-center" :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center" style="margin-bottom: 0;">Setup your LN Node <q-icon name="mdi-flash" color="yellow-7"/></h2>
          <h4 style="margin-top:0;margin-bottom:0;">Selected plan: <b>{{selectedPlan}}</b></h4>
          <h5 class="text-center" style="margin-top: 1%;">
            <b>Optionally</b> customize node settings before setup.<br>
            Your node will be <b>ready to use</b> just after setup.</h5>
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
  computed: {
    selectedPlan() {
      if (this.$route.params.lndType === 'STANDARD') {
        return 'Standard Lightning Node';
      } else {
        return 'Encrypted Lightning Node';
      }
    },
  },
});
</script>
