<template>
  <q-page>
    <div class="row items-center justify-center" :style="`height:${screenHeight - 50}px`">
      <div class="col-auto">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center" :class="isMobile ? 'text-h3' : 'text-h2'">Setup Lightning Network (LN)<q-icon name="mdi-flash" color="yellow-7"/></div>
            <div class="text-h5 text-center q-pb-md">LN <span class="text-bold">is required</span> to accept instant and cheap Bitcoin payments.</div>
          </div>
        </div>
        <div class="row justify-center">
          <div class="col-lg-6 col-xs-12 q-pa-xs">
            <clickable-route-card text="I have own Lightning Network Node" route="/ln/setup/existing"
                                  badge-text="Privacy & Control" badge-icon="mdi-security"></clickable-route-card>
          </div>
          <div class="col-lg-6 col-xs-12 q-pa-xs">
            <clickable-route-card text="I don't have Lightning Network Node" route="/ln/setup/new"></clickable-route-card>
          </div>
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
