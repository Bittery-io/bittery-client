<template>
  <q-page>
    <loader :show="showLoading"></loader>
    <div class="row">
      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">
        <your-subscription-form :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'">
        </your-subscription-form>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <billing-invoices-table :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"></billing-invoices-table>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">

import GlobalMixin from "../../mixins/global-mixin";
import Loader from 'components/utils/Loader.vue';
import YourSubscriptionForm from 'components/account/YourSubscriptionForm.vue';
import BillingInvoicesTable from 'components/account/BillingInvoicesTable.vue';

export default GlobalMixin.extend({
  name: 'AccountDetailsPage',
  components: { BillingInvoicesTable, YourSubscriptionForm, Loader },
  mounted() {
    // this.showLoading = true;

  },
});
</script>
