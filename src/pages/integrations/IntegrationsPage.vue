<template>
  <q-page padding>
    <div :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row justify-center">
        <div class="col-lg-12">
          <h2 class="text-center" style="margin-bottom: 0;">Bittery integrations</h2>
          <h5 class="text-center" style="margin-top: 1%;">Setup Bitcoin payments in third party applications</h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-lg-6 col-xs-12 q-pa-xs">
          <clickable-route-card text="Custom website" route="/ln/setup/existing"
                                badge-text="Payment button"
                                badge-icon="mdi-gesture-tap-button">
          </clickable-route-card>
        </div>
        <div class="col-lg-6 col-xs-12 q-pa-xs">
          <clickable-route-card text="Shopify" route="/ln/setup/new"></clickable-route-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import ClickableRouteCard from 'components/utils/ClickableRouteCard.vue';
import GlobalMixin from "../../mixins/global-mixin";

export default GlobalMixin.extend({
  name: 'IntegrationsPage',
  components: { ClickableRouteCard },
  data() {
    return {
      step: 1,
    };
  },
});
</script>
