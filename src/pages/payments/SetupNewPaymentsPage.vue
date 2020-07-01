<template>
  <q-page>
    <div class="fixed-center text-center">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center" style="margin-bottom: 0;">Setup payments services <q-icon name="payment"></q-icon></h2>
          <h5 class="text-center" style="margin-top: 1%;">Initialize services and start accepting Bitcoin payments</h5>
        </div>
      </div>
      <div class="row">
        <div class="col-grow">
          <setup-new-payments></setup-new-payments>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";
  import SetupNewPayments from 'components/payments/SetupNewPayments.vue';

  export default GlobalMixin.extend({
    name: 'SetupNewPaymentsPage',
    components: { SetupNewPayments },
    data() {
      return {
        step: 1,
      };
    },
  });
</script>
