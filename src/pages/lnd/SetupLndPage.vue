<template>
  <q-page>
    <div class="fixed-center">
      <div class="row justify-center">
        <div class="col-lg-12">
          <h2 class="text-center" style="margin-bottom: 0;">Setup Bitcoin LN <q-icon name="mdi-flash" color="yellow-7"/></h2>
          <h5 class="text-center" style="margin-top: 1%;">Please proceed setting up your Lightning Network node</h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-lg-6 col-xs-12 q-pa-xs">
          <clickable-route-card text="I have own LN node" route="/lnd/setup/existing"></clickable-route-card>
        </div>
        <div class="col-lg-6 col-xs-12 q-pa-xs">
          <clickable-route-card text="I don't have LN node" route="/lnd/setup/new"></clickable-route-card>
        </div>
      </div>
      <div class="row q-pt-md justify-center">
        <div class="col-auto">
          <a target="_blank" href='https://github.com/lightningnetwork/lnd'>
            <q-chip clickable class="shadow-10 " icon="info" color="grey-8" text-color="white"
                    :style="$q.platform.is.mobile ? `height: 100%` : ''">
              Lightning Network Daemon <br v-if="$q.platform.is.mobile"> https://github.com/lightningnetwork/lnd
            </q-chip>
          </a>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import ClickableRouteCard from 'components/utils/ClickableRouteCard.vue';
  import GlobalMixin from "../../mixins/global-mixin";

  export default GlobalMixin.extend({
    name: 'SetupLndPage',
    components: { ClickableRouteCard },
    data() {
      return {
        step: 1,
      };
    },
  });
</script>
