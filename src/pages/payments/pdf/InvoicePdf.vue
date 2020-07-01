<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-lg-8 col-xs-12 justify-center">
        <q-card class="q-ma-md shadow-10">
          <q-card-section>
            <div class="text-h4">Invoice PDF</div>
          </q-card-section>
          <q-card-section>
            <div class="row justify-center">
              <div class="col-auto justify-center q-pb-lg">
                <q-btn color="primary" icon="mdi-download" @click="downloadPdf">Download</q-btn>
              </div>
            </div>
            <div class="row justify-center" v-if="!this.$q.platform.is.mobile">
              <div class="col-12 q-pa-md">
                <q-scroll-area style="height: 1000px;">
                  <pdf :src="pdfData" v-if="showInvoice"></pdf>
                </q-scroll-area>
              </div>
            </div>
            <div class="row justify-center" v-else>
              <div class="col-12">
                <pdf :src="pdfData" v-if="showInvoice"></pdf>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">

  import GlobalMixin from "../../../mixins/global-mixin";
  import { get } from 'src/api/http-service';
  import pdf from 'vue-pdf';

  export default GlobalMixin.extend({
    name: 'InvoicePdf',
    components: { pdf },
    data() {
      return {
        pdfData: {},
        showInvoice: false,
      };
    },
    mounted() {
      get(this.$axios, `/api/payments/pdf/${this.$route.params.invoiceId}`, (res: any) => {
        this.showLoading = false;
        this.pdfData = {
          data: res.data,
        };
        this.showInvoice = true;
      }, () => {
        this.showLoading = false;
      });
    },
    methods: {
      downloadPdf() {
        const file = new Blob([this.pdfData.data], { type: 'binary' });
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file, `bittery-invoice-${this.$route.params.invoiceId}.pdf`);
        } else { // Others
          const a = document.createElement("a");
          const url = URL.createObjectURL(file);
          a.href = url;
          a.download = `bittery-invoice-${this.$route.params.invoiceId}.pdf`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 0);
        }
      },
    },
  });
</script>
