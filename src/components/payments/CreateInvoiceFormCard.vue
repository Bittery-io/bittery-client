<template>
  <div>
    <loader :show="showLoading"></loader>
    <q-card class="shadow-10 bg-grey-2">
      <q-card-section style="margin-bottom: 0; padding-bottom: 0;">
        <header-qchip text="Create invoice" icon="mdi-file-document-edit"></header-qchip><br>
      <q-chip square color="accent" text-color="primary" class="justify-end" :style="isMobile ? 'height: 40px !important' : ''">
        <div class="row items-baseline">
          <div class="col-auto q-pl-xs">
            <span class="text-bold">Current Bitcoin price:</span>
          </div>
          <div class="col-auto q-pl-xs" v-if="currentBitcoinUsdPrice === ''">
            <q-skeleton type="text" width="40px" bordered/>
          </div>
          <div class="col-auto q-pl-xs" v-else>
            <span class="text-bold">~ {{currentPriceDependingOfCurrency(currency)}}</span>
          </div>
          <div class="col-auto q-pl-xs">
            <span class="text-bold">(Coingecko)</span>
          </div>
        </div>
      </q-chip>
      </q-card-section>
      <q-card-section>
        <vue-form :state='createInvoiceFormState' @submit.prevent="onSubmit">
          <div class="row q-pa-xs">
            <div class="col-12">
              <validate>
                <q-input
                  autocomplete="false"
                  outlined
                  bg-color="accent"
                  type="text"
                  name="amount"
                  square
                  @keypress="isNumber($event)"
                  v-model="amount"
                  :label="`Amount ${currency}`">
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
                <q-input
                  dense
                  outlined
                  autocomplete="false"
                  type="text"
                  name="amount"
                  square
                  readonly
                  v-model="estimatedPriceInBitcoin"
                  :label="`Estimated price in Bitcoin`">
                  <template v-slot:prepend>
                    <q-icon style="width:50px;" color="primary" name="mdi-bitcoin"/>
                  </template>
                </q-input>
              </validate>
            </div>
          </div>
          <div class="row q-pa-xs">
            <div class="col-12">
              <validate>
                <q-select square outlined dense bg-color="accent" v-model="currency" :options="currencies" label="Currency">
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
                <q-select dense square outlined bg-color="accent" v-model="invoiceValidity" :options="invoiceValidityOptions" label="Invoice validity">
                  <template v-slot:prepend>
                    <q-icon style="width:50px;" color="primary" name="mdi-calendar-clock"/>
                  </template>
                </q-select>
              </validate>
            </div>
          </div>
          <div class="row q-pa-xs">
            <div class="col-12">
              <validate>
                <q-input
                  dense
                  square
                  outlined
                  maxlength="200"
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
                  dense
                  maxlength="150"
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
              <q-btn color="primary" icon="mdi-file-plus" text-color="white" glossy label="Create invoice" @click="saveInvoice"
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
  import { get, post } from 'src/api/http-service';
  import { SaveInvoiceDto } from 'src/dto/save-invoice-dto';
  import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
  import HeaderQchip from 'components/utils/HeaderQchip.vue';
  import { addMonthsToDate } from 'src/api/date-service';
  import { currentVM } from '@vue/composition-api/dist/runtimeContext';
  import axios from 'boot/axios';

  export default GlobalMixin.extend({
    components: { Loader, HeaderQchip },
    name: 'CreateNewInvoiceFormCard',

    data() {
      return {
        amount: '0',
        currency: 'USD',
        currencies: ['PLN', 'USD', 'EUR'],
        invoiceValidity: { label: '7 days', value: '7d' },
        invoiceValidityOptions: [
          { label: '1 hour', value: '1h' },
          { label: '4 hours', value: '4h' },
          { label: '12 hours', value: '12h' },
          { label: '1 day', value: '1d' },
          { label: '3 days', value: '3d' },
          { label: '7 days', value: '7d' },
          { label: '30 days', value: '30d' },
        ],
        description: '',
        buyer: '',
        createInvoiceFormState: {},
        createInvoiceButtonLocked: false,
        numberInputChars: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ',', '.'],
        currentBitcoinUsdPrice: '',
        currentBitcoinEurPrice: '',
        currentBitcoinPlnPrice: '',
        estimatedPriceInBitcoin: '',
        usdFormatter: undefined,
        plnFormatter: undefined,
        eurFormatter: undefined,
        coingeckoResponded: false,
      };
    },
    mounted() {
      // this duplicated in few places all
      this.usdFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      this.plnFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PLN',
      });
      this.eurFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      });

      get(this.$axios, 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,eur,pln&include_last_updated_at=true', (res) => {
        const currentPriceInUsd: number = res.data.bitcoin.usd;
        const currentPriceInEur: number = res.data.bitcoin.eur;
        const currentPriceInPln: number = res.data.bitcoin.pln;
        if (currentPriceInUsd) {
          this.currentBitcoinUsdPrice = currentPriceInUsd.toFixed(0);
          this.currentBitcoinEurPrice = currentPriceInEur.toFixed(0);
          this.currentBitcoinPlnPrice = currentPriceInPln.toFixed(0);
          this.coingeckoResponded = true;
        }
      });
    },
    watch: {
      amount() {
        if (this.coingeckoResponded) {
          if (this.currency.toUpperCase() === 'PLN') {
            this.estimatedPriceInBitcoin = (Number(this.amount) / Number(this.currentBitcoinPlnPrice)).toFixed(8);
          } else if (this.currency.toUpperCase() === 'USD') {
            this.estimatedPriceInBitcoin = (Number(this.amount) / Number(this.currentBitcoinUsdPrice)).toFixed(8);
          } else if (this.currency.toUpperCase() === 'EUR') {
            this.estimatedPriceInBitcoin = (Number(this.amount) / Number(this.currentBitcoinEurPrice)).toFixed(8);
          }
        }
      }
    },
    methods: {
      //copied in few places
      currentPriceDependingOfCurrency(currency: string) {
        if (currency.toUpperCase() === 'PLN') {
          return this.plnFormatter.format(this.currentBitcoinPlnPrice);
        } else if (currency.toUpperCase() === 'USD') {
          return this.usdFormatter.format(this.currentBitcoinUsdPrice);
        } else if (currency.toUpperCase() === 'EUR') {
          return this.eurFormatter.format(this.currentBitcoinEurPrice);
        }
      },
      isNumber(event) {
        const isCorrectNumberChar: boolean = this.numberInputChars.includes(event.key);
        if (!isCorrectNumberChar) {
          event.preventDefault();
        }
        // if is dot or ,
        if (event.key === '.' || event.key === ',') {
          if (this.amount.includes('.') || this.amount.includes(',') || this.amount === '')
            event.preventDefault();
        }
        if (this.amount.includes('.')) {
          const afterDotPart: string | undefined = this.amount.substr(this.amount.indexOf('.'), this.amount.length);
          // because '.' is also included so 3
          if (afterDotPart && afterDotPart.length === 3) {
            event.preventDefault();
          }
        }
        if (this.amount.includes(',')) {
          const afterDotPart: string | undefined = this.amount.substr(this.amount.indexOf(','), this.amount.length);
          // because ',' is also included so 3
          if (afterDotPart && afterDotPart.length === 3) {
            event.preventDefault();
          }
        }
      },
      saveInvoice() {
        this.showLoading = true;
        this.createInvoiceButtonLocked = true;
        post(this.$axios, '/api/payments', new SaveInvoiceDto(this.amount, this.currency, this.invoiceValidity.value, this.description, this.buyer), async () => {
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
