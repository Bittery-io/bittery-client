<template>
  <a target="_blank" href='https://github.com/lightningnetwork/lnd'>
    <q-chip clickable class="shadow-10 " icon="info" color="grey-8" text-color="white"
            :style="$q.platform.is.mobile ? `height: 100%` : ''">
      Lightning Labs LND <br v-if="$q.platform.is.mobile"> https://github.com/lightningnetwork/lnd
    </q-chip>
  </a>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";

export default GlobalMixin.extend({
  name: 'LnInfoChip',
});
</script>
