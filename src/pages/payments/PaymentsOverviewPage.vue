<template>
  <q-page>
    <div class="row" v-if="hasBtcWallet">
      <loader :show="showLoading"></loader>
      <div class="col-lg-4 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">
        <create-invoice-form-card
          :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"
          @invoiceCreated="onInvoiceCreated" v-sticky="{ zIndex: 999, stickyTop: 70}"></create-invoice-form-card>
      </div>
      <div class="col-lg-8 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">
        <invoices-table-card
          :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"
          :reload-invoices="someInvoiceWasCreated"></invoices-table-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">

  import CreateInvoiceFormCard from 'components/payments/CreateInvoiceFormCard.vue';
  import InvoicesTableCard from 'components/payments/InvoicesTableCard.vue';
  import GlobalMixin from "../../mixins/global-mixin";
  import { get } from 'src/api/http-service';
  import Loader from 'components/utils/Loader.vue';
  import { VUE_STICKY } from 'boot/setup-vue-sticky';
  export default GlobalMixin.extend({
    name: 'PaymentsOverviewPage',
    components: { CreateInvoiceFormCard, InvoicesTableCard, Loader },
    directives: {
      'sticky': VUE_STICKY,
    },
    data() {
      return {
        someInvoiceWasCreated: false,
        hasBtcWallet: false,
      };
    },
    mounted() {
      this.showLoading = true;
      get(this.$axios, '/api/btc/wallet', async (res: any) => {
        await this.sleep(200);
        this.hasBtcWallet = true;
        this.showLoading = false;
      }, () => {
        this.showLoading = false;
        this.$router.push('/payments/setup');
      });
    },
    methods: {
      onInvoiceCreated() {
        this.someInvoiceWasCreated = !this.someInvoiceWasCreated;
      },
    },
  });
</script>
