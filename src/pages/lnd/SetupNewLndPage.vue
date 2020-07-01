<template>
  <q-page>
    <div class="text-center" :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center" style="margin-bottom: 0;">Setup New Bitcoin LND node <span style="color: gold">&#128498;</span></h2>
          <h5 class="text-center" style="margin-top: 1%;">Please proceed setting up your Lightning Network node</h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-auto justify-center">
          <setup-new-lnd-form></setup-new-lnd-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";
  import SetupNewLndForm from 'components/lnd/SetupNewLndForm.vue';

  export default GlobalMixin.extend({
    name: 'SetupNewLndPage',
    components: { SetupNewLndForm },
    data() {
      return {
        step: 1,
      };
    },
  });
</script>
