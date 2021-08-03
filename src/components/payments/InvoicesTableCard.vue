<template>
  <div>
    <loader :show="showLoading"></loader>
    <share-invoice-payment-widget-popup :show="showShareInvoicePaymentWidgetPopup" :invoice-id="invoiceId"></share-invoice-payment-widget-popup>
    <q-card class="shadow-10 bg-grey-2">
      <q-card-section>
        <header-qchip text="Your invoices" icon="mdi-file-multiple"></header-qchip>
      </q-card-section>
      <q-card-section>
        <div :class="{ 'q-pa-md': !$q.platform.is.mobile }">
          <q-table
            grid
            :data="filteredData"
            row-key="name"
            hide-header>
            <template v-slot:top-right>
              <div class="q-pa-xs" :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.75}px` : 'width: 200px;height:100%;'" debounce="300">
                <q-select dense v-model="invoiceStatus" :options="invoiceStatuses" label="Invoice status"/>
              </div>
              <div class="q-pa-xs" :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.75}px` : 'width: 200px;height:100%;'" debounce="300">
                <q-select dense v-model="orderByDate" :options="orderByDateOptions" label="Order by date"/>
              </div>
            </template>
            <template v-slot:top-left>
              <q-input dense debounce="800" dense v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
            </template>
            <template v-slot:item="props">
              <div class="q-pa-md col-xs-12 col-sm-6 col-md-4" :class="{ 'noPaddingRightAndLeft': $q.platform.is.mobile }">
<!--                <q-card class="shadow-10 grow2 bg-green-2">-->
                <q-card class="shadow-10 grow2"
                        :class="getClassDependingOfInvoiceStatus(props.row.status)">
                  <q-card-section>
                    <q-badge floating :class="getStatusLabelColor(props.row.status)">
                      <div class="text-subtitle2 text-uppercase">
                        <q-icon name="mdi-file" /> {{props.row.status}}</div>
                    </q-badge>
                    <q-list class="text-subtitle2" dense>
                      <q-item class="q-pt-md">
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-cash-multiple"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label><span v-bind:style="{'font-size': `${getPriceFontSize(props.row.id)}px`}">{{Number(props.row.price).toFixed(2)}}</span>
                            {{props.row.currency}}
                          </q-item-label>
                          <q-item-label caption>Amount currency</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="ion-logo-bitcoin"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{props.row.btcPrice}} BTC</q-item-label>
                          <q-item-label caption>Amount BTC</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item dense>
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi"/>
                        </q-item-section>
                        <q-item-section>
                          <q-linear-progress stripe size="10px" :value="Number(props.row.btcPaid) / Number(props.row.btcPrice)" style="margin-bottom: 5px"/>
                          <q-item-label caption>Total paid</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-file-clock-outline"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            <q-chip square dense  color="primary" text-color="white" class="text-bold" style="margin-left: 0;">
                              <q-tooltip>
                                Validity of your invoice. After that time invoice will be expired.
                              </q-tooltip>
                              {{getValidForString(props.row.expirationTime, props.row.invoiceTime)}}
                            </q-chip>
                          </q-item-label>
                          <q-item-label caption>Invoice validity</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="props.row.itemDesc">
                        <q-item-section avatar>
                          <q-icon color="primary" name="description"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{props.row.itemDesc.substr(0, 50)}}</q-item-label>
                          <q-item-label caption>Description</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="props.row.buyer.name">
                        <q-item-section avatar>
                          <q-icon color="primary" name="account_box"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{props.row.buyer.name.substr(0, 50)}}</q-item-label>
                          <q-item-label caption>Buyer (customer)</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="today"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(props.row.invoiceTime) }}
                            <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(props.row.invoiceTime) }}
                          </q-item-label>
                          <q-item-label caption>Creation date</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-calendar-clock"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(props.row.expirationTime) }}
                            <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(props.row.expirationTime) }}
                          </q-item-label>
                          <q-item-label caption>Payment due date</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="props.row.status.toUpperCase() !== 'COMPLETE'">
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-clock-alert-outline"/>
                        </q-item-section>
                        <q-item-section>
                          <countdown :time="getMillisecondsBetweenNowAndDate(props.row.expirationTime)">
                            <template slot-scope="props">
                              <span v-if="props.days > 0">{{props.days}} days</span><span v-if="props.hours > 0"> {{props.hours}} hours</span> {{ props.minutes }} minutes {{ props.seconds }} seconds
                            </template>
                          </countdown>
                          <q-item-label caption>Payment due date countdown</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-else>
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-clock-alert-outline"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(getPaymentDoneDate(props.row)) }}
                            <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(getPaymentDoneDate(props.row)) }}
                          </q-item-label>
                          <q-item-label caption>Payment done date</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-contactless-payment-circle-outline"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            <q-badge class="text-bold" v-if="props.row.cryptoInfo.filter(_ => _.paymentType === 'LightningLike').length > 0" style="margin: 1px"> <q-icon size="xs" name="mdi-flash" color="yellow-7"></q-icon>
                              <q-tooltip>
                                Invoice can be paid via Lightning Network.
                              </q-tooltip>
                              LIGHTNING
                            </q-badge>
                            <q-badge class="text-bold" v-if="props.row.cryptoInfo.filter(_ => _.paymentType === 'BTCLike').length > 0" style="margin: 1px"> <q-icon size="xs" name="mdi-bitcoin" color="orange-8"></q-icon>
                              <q-tooltip>
                                Invoice can be paid using standard Bitcoin transaction.
                              </q-tooltip>
                              BITCOIN
                            </q-badge>
                          </q-item-label>
                          <q-item-label caption>Payment methods</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-identifier"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            {{props.row.id}}
                          </q-item-label>
                          <q-item-label caption>Invoice ID</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item class="justify-center q-mt-md">
                        <q-btn  color="primary" outline label="Payment preview" dense style="width:100%" icon="mdi-contactless-payment" @click="openPayInvoiceInCurrentTab(props.row.id)"/>
                      </q-item>
                      <q-item class="justify-center">
                        <q-btn  color="primary" label="Share payment" dense style="width:100%" icon="mdi-share-all-outline" @click="showSharePaymentWidgetPopup(props.row.id)"/>
                      </q-item>
                      <q-item class="justify-center">
                        <q-btn class="text-su" color="primary" dense label="Invoice PDF" style="width:100%" icon="mdi-file-pdf" @click="$router.push(`/payments/pdf/${props.row.id}`)"/>
                      </q-item>
                    </q-list>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import InvoicesMixin from "../../mixins/invoices-mixin";
import Loader from 'components/utils/Loader.vue';
import { get } from 'src/api/http-service';
import HeaderQchip from 'components/utils/HeaderQchip.vue';
import { getDaysBetweenTwoDates, getHoursBetweenTwoDates, getMillisecondsBetweenTwoDates } from 'src/api/date-service';
import ShareInvoicePaymentWidgetPopup from 'components/payments/ShareInvoicePaymentWidgetPopup.vue';

export default InvoicesMixin.extend({
    components: { ShareInvoicePaymentWidgetPopup, Loader, HeaderQchip },
    name: 'InvoicesTableCard',
    props: {
      reloadInvoices: {
        type: Boolean,
        required: true,
        default: false,
      },
    },
    data() {
      return {
        showShareInvoicePaymentWidgetPopup: false,
        validForMilliseconds: 10000,
        invoiceId: '',
      };
    },
    mounted() {
      this.loadInvoices();
    },
    methods: {
      showSharePaymentWidgetPopup(invoiceId: string) {
        this.invoiceId = invoiceId;
        this.showShareInvoicePaymentWidgetPopup  = !this.showShareInvoicePaymentWidgetPopup;
      },
      getMillisecondsBetweenNowAndDate(fromDate: number) {
        return getMillisecondsBetweenTwoDates(fromDate, new Date().getTime());
      },
      loadInvoices() {
        get(this.$axios, '/api/payments/invoices', async (res: any) => {
          await this.sleep(200); // small sleep required
          console.log('Mam: ', res.data[0].btcPaid, Number(res.data[0].btcPrice));
          this.showLoading = false;
          this.data = res.data;
          this.filteredData = res.data;
          this.filteredData.sort((a: any, b: any) => b.invoiceTime - a.invoiceTime);
          this.filterSavedData = this.filteredData;
          this.setPriceFontSizes();
          console.log(res.data[0]);
        }, (err: any) => {
          this.createInvoiceButtonLocked = false;
          this.showLoading = false;
          console.log(err);
        });
      },
      getClassDependingOfInvoiceStatus(status: string) {
        switch (status) {
          case 'complete':
            return 'bg-green-2';
          case 'expired':
            return 'bg-red-2';
          default:
            return '';
        }
      },
      // min 14px, max 50px
      setPriceFontSizes() {
        if (this.filteredData.length >= 2) {
          const rows: any[] = this.filteredData.map((row: any) => {
            return {
              id: row.id,
              btcPrice: Number(row.btcPrice),
            };
          });
          // price from greatest to lowest
          rows.sort((a, b) => b.btcPrice - a.btcPrice);
          const lowestValue: number = rows[rows.length - 1].btcPrice;
          const greatestValue: number = rows[0].btcPrice;
          const difference = greatestValue - lowestValue;
          const pixelsToStart: number = 14;
          const maxPixelsToIncrease: number = 26;
          // @ts-ignore
          this.priceFontSizes = rows.map((row) => {
            // the lowest value got pixelsToStart (e.g. 14)
            // the highest value got pixelsToStart + maxPixelsToIncrease (e.g. 40)
            // now we must split 26 for all other values between
            const percentageDifference: number = (((row.btcPrice - lowestValue) * 100) / difference) / 100;
            const fontSize = pixelsToStart + (percentageDifference * maxPixelsToIncrease);
            return {
              fontSize,
              id: row.id,
            };
          });
        }
      },
      getPriceFontSize(id: string) {
        if (this.priceFontSizes.length > 0) {
          // @ts-ignore
          return this.priceFontSizes.filter((priceFontSize: any) => priceFontSize.id === id)[0].fontSize;
        } else {
          return 14;
        }
      },
    },
    watch: {
      reloadInvoices() {
        this.loadInvoices();
      },
    },
  });

</script>
