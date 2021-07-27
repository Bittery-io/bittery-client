<template>
  <q-page>
    <div class="row items-center justify-center" :style="`height:${screenHeight - 50}px`">
      <div class="col-auto">
        <div class="row justify-center">
          <div class="col-12 text-center">
            <div :class="isMobile ? 'text-h3' : 'text-h2'">Setup your LN Node <q-icon name="mdi-flash" color="yellow-7"/></div>
            <div :class="isMobile ? 'text-h5' : 'text-h4'">Selected plan: <b>{{selectedPlan}}</b></div>
            <div :class="isMobile ? 'text-subtitle1' : 'text-h5'" >
              <b>Optionally</b> customize node settings before setup.<br>
              Your node will be <b>ready to use</b> just after setup.</div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 q-pa-xs justify-center q-pt-md">
            <customize-new-buy-node-card></customize-new-buy-node-card>
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
        return 'Bittery Standard';
      } else {
        return 'Bittery Encrypted';
      }
    },
  },
});
</script>
