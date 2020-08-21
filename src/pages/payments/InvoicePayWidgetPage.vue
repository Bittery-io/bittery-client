<template>
  <q-page>
  </q-page>
</template>

<script lang="ts">

  import CreateInvoiceFormCard from 'components/payments/CreateInvoiceFormCard.vue';
  import InvoicesTableCard from 'components/payments/InvoicesTableCard.vue';
  import GlobalMixin from "../../mixins/global-mixin";

  export default GlobalMixin.extend({
    name: 'InvoicePayWidgetPage',
    components: { CreateInvoiceFormCard, InvoicesTableCard },
    data() {
      return {
        userLndDto: undefined,
      };
    },
    mounted() {
      // @ts-ignore
      window.btcpay.setApiUrlPrefix(process.env.BTCPAY_URL);
      // @ts-ignore
      window.btcpay.showInvoice(this.$route.params.invoiceId);
    },
  });
</script>
