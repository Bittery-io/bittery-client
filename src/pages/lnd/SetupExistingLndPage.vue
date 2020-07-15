<template>
  <q-page>
    <div class="text-center" :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center" style="margin-bottom: 0;">Setup your Bitcoin LN node <q-icon name="mdi-flash" color="yellow-7"/></h2>
          <h5 class="text-center" style="margin-top: 0;">Please provide your personal Lightning Network node information</h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-auto justify-center">
          <setup-existing-lnd-form></setup-existing-lnd-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";
  import SetupExistingLndForm from 'components/lnd/SetupExistingLndForm.vue';

  export default GlobalMixin.extend({
    name: 'SetupExistingLndPage',
    components: { SetupExistingLndForm },
    data() {
      return {
        step: 1,
      };
    },
  });
</script>
