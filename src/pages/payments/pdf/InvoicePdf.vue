<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-lg-8 col-xs-12 justify-center">
        <q-card class="shadow-10">
          <q-card-section>
            <div class="row" v-if="!$q.platform.is.mobile">
              <div class="col-grow">
                <div class="row justify-start">
                  <div class="col-auto justify-start">
                    <header-qchip text="Invoice PDF" icon="mdi-file-pdf"></header-qchip>
                  </div>
                </div>
              </div>
              <div class="col-grow">
                <div class="row justify-end">
                  <div class="col-auto justify-end">
                    <q-btn glossy color="primary" class="q-ma-xs" icon="mdi-download" @click="downloadPdf">Download</q-btn>
                  </div>
                </div>
              </div>
            </div>
            <div class="row justify-center" v-else>
              <div class="col-auto justify-center">
                <header-qchip text="Invoice PDF" icon="mdi-file-pdf"></header-qchip>
              </div>
              <div class="col-auto justify-center">
                <q-btn glossy color="primary" class="q-ma-md" icon="mdi-download" @click="downloadPdf">Download</q-btn>
              </div>
            </div>
            <div class="row justify-center" v-if="!this.$q.platform.is.mobile">
              <div class="col-12 q-pa-md">
                <q-scroll-area :style="`height: ${screenHeight - 200}px;`">
                  <pdf dpi="100" :src="pdfData" v-if="showInvoice"></pdf>
                </q-scroll-area>
              </div>
            </div>
            <div class="row justify-center" v-else>
              <div class="col-auto">
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
  // @ts-ignore
  import pdf from 'vue-pdf';
  import HeaderQchip from 'components/utils/HeaderQchip.vue';
  import { showNotificationInfo } from 'src/api/notificatios-api';
  export default GlobalMixin.extend({
    name: 'InvoicePdf',
    components: { pdf, HeaderQchip },
    props: {
    },
    data() {
      return {
        pdfData: {},
        showInvoice: false,
      };
    },
    mounted() {
      const uri: string = this.$route.query.isBitteryInvoice ?
        `/api/account/subscription/pdf/${this.$route.params.invoiceId}` :
        `/api/payments/pdf/${this.$route.params.invoiceId}`;
      get(this.$axios, uri, (res: any) => {
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
        // @ts-ignore
        const file = new Blob([this.pdfData.data], { type: 'binary' });
        const fileName: string = `bittery-invoice-${this.$route.params.invoiceId}.pdf`;
        if (window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(file, fileName);
          showNotificationInfo(`File downloaded successfully.`, `File name: ${fileName}`);
        } else { // Others
          const a = document.createElement("a");
          const url = URL.createObjectURL(file);
          a.href = url;
          a.download = fileName;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showNotificationInfo(`File downloaded successfully.`, `File name: ${fileName}`);
          }, 0);
        }
      },
    },
  });
</script>
