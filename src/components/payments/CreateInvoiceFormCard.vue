<template>
  <div>
    <loader :show="showLoading"></loader>
    <q-card class="q-ma-md shadow-10 bg-grey-2">
      <q-card-section>
        <header-qchip text="Create invoice" icon="mdi-file-document-edit"></header-qchip>
      </q-card-section>
      <q-card-section>
        <vue-form :state='createInvoiceFormState' @submit.prevent="onSubmit">
          <div class="row q-pa-xs">
            <div class="col-12">
              <validate>
                <q-input
                  outlined
                  bg-color="accent"
                  type="number"
                  name="amount"
                  square
                  v-model="amount"
                  label="Amount">
                  <template v-slot:prepend>
                    <q-icon style="width:50px;" color="primary" name="mdi-cash-multiple"/>
                  </template>
                </q-input>
              </validate>
            </div>
          </div>
          <div class="row q-pa-xs">
            <div class="col-12">
              <validate>
                <q-select square outlined bg-color="accent" v-model="currency" :options="currencies" label="Currency">
                  <template v-slot:prepend>
                      <q-icon style="width:50px;" color="primary" name="mdi-cash-usd-outline"/>
                    </template>
                </q-select>
              </validate>
            </div>
          </div>
          <div class="row q-pa-xs">
            <div class="col-12">
              <validate>
                <q-input
                  square
                  outlined
                  bg-color="accent"
                  type="textarea"
                  name="description"
                  v-model="description"
                  required
                  label="Item description">
                  <template v-slot:prepend>
                    <q-icon style="width:50px;" color="primary" name="mdi-file-document-edit"/>
                  </template>
                </q-input>
              </validate>
            </div>
          </div>
          <div class="row q-pa-xs">
            <div class="col-12">
              <validate>
                <q-input
                  outlined
                  square
                  bg-color="accent"
                  type="textarea"
                  name="buyer"
                  v-model="buyer"
                  required
                  label="Buyer (customer)">
                  <template v-slot:prepend>
                    <q-icon style="width:50px;" color="primary" name="mdi-card-account-details"/>
                  </template>
                </q-input>
              </validate>
            </div>
          </div>
          <div class="row q-pa-md justify-center">
            <div class="col-auto justify-center">
              <q-btn color="primary" icon="mdi-file-plus" text-color="white" label="Create invoice" @click="saveInvoice"
                     :disabled="amount <= 0 || createInvoiceButtonLocked"/>
            </div>
          </div>
        </vue-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";
  import Loader from 'components/utils/Loader.vue';
  import { post } from 'src/api/http-service';
  import { SaveInvoiceDto } from 'src/dto/save-invoice-dto';
  import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
  import HeaderQchip from 'components/utils/HeaderQchip.vue';
  export default GlobalMixin.extend({
    components: { Loader, HeaderQchip },
    name: 'CreateNewInvoiceFormCard',
    data() {
      return {
        amount: 0,
        currency: 'PLN',
        currencies: ['PLN', 'USD', 'EUR'],
        description: '',
        buyer: '',
        createInvoiceFormState: {},
        createInvoiceButtonLocked: false,
      };
    },
    methods: {
      saveInvoice() {
        this.showLoading = true;
        this.createInvoiceButtonLocked = true;
        post(this.$axios, '/api/payments', new SaveInvoiceDto(this.amount, this.currency, this.description, this.buyer), async () => {
          await this.sleep(200); // small sleep required
          this.showLoading = false;
          this.createInvoiceButtonLocked = false;
          this.amount = 0;
          this.$emit('invoiceCreated');
          showNotificationInfo('Invoice successfully created');
        }, (err: any) => {
          this.createInvoiceButtonLocked = false;
          this.showLoading = false;
          showNotificationError('Error occurred during invoice creation');
          console.log(err);
        });
      },
    },
  });

</script>
