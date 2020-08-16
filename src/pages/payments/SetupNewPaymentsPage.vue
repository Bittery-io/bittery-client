<template>
  <q-page padding>
    <div class="text-center" :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row">
        <div class="col-grow">
          <h2 class="text-center" style="margin-bottom: 0;">Setup payments <q-icon name="mdi-contactless-payment-circle"></q-icon></h2>
          <h5 class="text-center" style="margin-top: 1%;">Initialize BTCPay based services and start accepting Bitcoin payments</h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-auto justify-center">
          <setup-new-payments-form></setup-new-payments-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";
  import SetupNewPaymentsForm from 'components/payments/SetupNewPaymentsForm.vue';

  export default GlobalMixin.extend({
    name: 'SetupNewPaymentsPage',
    components: { SetupNewPaymentsForm },
  });
</script>
