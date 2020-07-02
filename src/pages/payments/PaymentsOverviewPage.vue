<template>
  <q-page>
    <div class="row">
      <div class="col-lg-4 col-xs-grow q-pa-xs">
        <create-invoice-form-card @invoiceCreated="onInvoiceCreated"></create-invoice-form-card>
      </div>
      <div class="col-lg-8 col-xs-grow q-pa-xs">
        <invoices-table-card :reload-invoices="someInvoiceWasCreated"></invoices-table-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">

  import CreateInvoiceFormCard from 'components/payments/CreateInvoiceFormCard.vue';
  import InvoicesTableCard from 'components/payments/InvoicesTableCard.vue';
  import GlobalMixin from "../../mixins/global-mixin";

  export default GlobalMixin.extend({
    name: 'PaymentsOverviewPage',
    components: { CreateInvoiceFormCard, InvoicesTableCard },
    data() {
      return {
        someInvoiceWasCreated: false,
      };
    },
    methods: {
      onInvoiceCreated() {
        this.someInvoiceWasCreated = !this.someInvoiceWasCreated;
      },
    },
  });
</script>
