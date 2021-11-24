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
        <invoices-table :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" :invoices="invoices" v-if="invoices"
        :is-billing-invoices="true"></invoices-table>
<!--        <billing-invoices-table :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"></billing-invoices-table>-->
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">

import GlobalMixin from "../../mixins/global-mixin";
import Loader from 'components/utils/Loader.vue';
import YourSubscriptionForm from 'components/account/YourSubscriptionForm.vue';
import InvoicesTable from 'components/dashboard/InvoicesTable.vue';
import { get } from 'src/api/http-service';

export default GlobalMixin.extend({
  name: 'AccountDetailsPage',
  components: { InvoicesTable, YourSubscriptionForm, Loader },
  data() {
    return {
      invoices: undefined,
    };
  },
  mounted() {
    this.showLoading = true;
    get(this.$axios, '/api/account/subscription/billings', (res: any) => {
      this.showLoading = false;
      this.invoices = res.data.map((billing: any) => billing.invoice);
    }, async (err: any) => {
      this.showLoading = false;
      console.log('Getting billing dtos failed with err', err);
    })
  },
});
</script>
