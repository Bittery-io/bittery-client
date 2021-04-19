<template>
  <q-page padding>
    <div :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row justify-center">
        <div class="col-lg-12">
          <h2 class="text-center" style="margin-bottom: 0;">Setup Lightning Network (LN)<q-icon name="mdi-flash" color="yellow-7"/></h2>
          <h5 class="text-center" style="margin-top: 1%;">LN <span class="text-bold">is required</span> to accept instant and cheap Bitcoin payments.</h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-lg-6 col-xs-12 q-pa-xs">
          <clickable-route-card text="I have own Lightning Network Node" route="/ln/setup/existing"
                                badge-text="Recommended" badge-icon="mdi-security"></clickable-route-card>
        </div>
        <div class="col-lg-6 col-xs-12 q-pa-xs">
          <clickable-route-card text="I don't have Lightning Network Node" route="/ln/setup/new"></clickable-route-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import ClickableRouteCard from 'components/utils/ClickableRouteCard.vue';
  import GlobalMixin from "../../mixins/global-mixin";
  import LnInfoChip from 'pages/lnd/LnInfoChip.vue';

  export default GlobalMixin.extend({
    name: 'SetupLndPage',
    components: { LnInfoChip, ClickableRouteCard },
    data() {
      return {
        step: 1,
      };
    },
  });
</script>
