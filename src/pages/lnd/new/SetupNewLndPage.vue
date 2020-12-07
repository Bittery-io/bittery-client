<template>
  <q-page padding>
    <div class="text-center" :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center" style="margin-bottom: 0;">Bittery LN hosting
            <q-img
              src="statics/lnd.png" :style="$q.platform.is.mobile ? 'width: 20%' : 'width: 8%'">
            </q-img>
          </h2>
          <h5 class="text-center" style="margin-top: 1%;">Setup your personal, private <b>Lightning Network</b> node.<br>
            Accept instant and super cheap Bitcoin payments.</h5>
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
    </div>

  </q-page>
</template>

<script lang="ts">
import GlobalMixin from "../../../mixins/global-mixin";
import SetupNewLndForm from 'components/lnd/new/SetupNewLndForm.vue';
import LnNodeBuyCard from 'components/lnd/new/LnNodeBuyCard.vue';

export default GlobalMixin.extend({
  name: 'SetupNewLndPage',
  components: { SetupNewLndForm, LnNodeBuyCard },
  data() {
    return {
      step: 1,
    };
  },
});
</script>
