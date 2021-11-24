<template>
  <q-card class="shadow-10 bg-grey-2">
    <q-card-section>
      <header-qchip :text="timeframe ? `Invoices [ ${timeframe} ]` : 'Billing invoices'" icon="mdi-table-large" size="md"></header-qchip>
    </q-card-section>
    <q-card-section style="padding-top: 0;margin-top:0;">
      <div class="row" v-if="isMobile">
        <div class="col-xs-grow">
          <q-input dense debounce="800" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-if="isMobile">
        <div class="col-xs-grow">
          <div class="q-pa-xs" debounce="400">
            <q-select v-model="invoiceStatus" dense :options="invoiceStatuses" label="Invoice status"/>
          </div>
        </div>
      </div>
      <div class="row q-pb-lg " v-if="isMobile">
        <div class="col-xs-grow">
          <div class="q-pa-xs" debounce="400">
            <q-select v-model="orderByDate" dense :options="orderByDateOptions" label="Order by date"/>
          </div>
        </div>
      </div>
      <div class="row q-pb-lg q-pl-md" v-else>
        <div class="col-lg-auto col-xs-grow">
          <q-input dense debounce="800" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </div>
        <div class="col-grow"></div>
        <div class="col-lg-auto col-xs-grow">
          <div class="q-pa-xs" :style="$q.platform.is.mobile ? `` : 'width: 200px;height:100%;'" debounce="400">
            <q-select v-model="invoiceStatus" dense :options="invoiceStatuses" label="Invoice status"/>
          </div>
        </div>
        <div class="col-lg-auto col-xs-grow">
          <div class="q-pa-xs" :style="$q.platform.is.mobile ? `` : 'width: 200px;height:100%;'" debounce="400">
            <q-select v-model="orderByDate" dense :options="orderByDateOptions" label="Order by date"/>
          </div>
        </div>
      </div>

      <q-table
          class="shadow-0"
          style=" background-color: transparent;"
          dense
          :data="filteredData"
          :columns="columns"
          row-key="name"
        >
          <template v-slot:body="props">
            <q-tr :props="props" :class="getClassDependingOfInvoiceStatus(props.row.invoiceData.status)">
              <q-td>
                <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(props.row.invoiceData.createdTime) }}
                <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(props.row.invoiceData.createdTime) }}<br>
                <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(props.row.invoiceData.expirationTime) }}
                <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(props.row.invoiceData.expirationTime) }}
              </q-td>
              <q-td>
                <q-input
                  style="min-width:150px !important;"
                  v-if="props.row.invoiceData.metadata.itemDesc"
                  dense
                  type="text"
                  square
                  onkeypress="return false;"
                  :value="props.row.invoiceData.metadata.itemDesc">
                </q-input>
              </q-td>
              <q-td>
                <q-input
                  style="min-width:150px !important;"
                  v-if="props.row.invoiceData.metadata.buyerName"
                  dense
                  type="text"
                  square
                  onkeypress="return false;"
                  :value="props.row.invoiceData.metadata.buyerName">
                </q-input>
              </q-td>
              <q-td >
                <q-chip dense square color="primary" class="text-subtitle2" outline text-color="white">
                  {{ props.row.invoiceData.amount }}
                </q-chip>
              </q-td>
              <q-td >
                <q-chip dense square outline class="text-subtitle2">
                  {{ props.row.invoiceData.currency }}
                </q-chip>
              </q-td>
              <q-td >
                <q-chip dense square color="primary" class="text-subtitle2" text-color="white">
                  {{ getAmountInBitcoin(props.row)}} BTC
                </q-chip>
              </q-td>
              <q-td >
                <q-chip dense square color="primary" class="text-subtitle2" outline text-color="white">
                  <q-item-label>{{currentPriceDependingOfCurrency(props.row.invoiceData.currency, props.row.invoicePayments[0].rate)}}</q-item-label>
                </q-chip>
              </q-td>
              <q-td >
                <q-linear-progress stripe size="10px" :value="Number(props.row.invoicePayments[0].totalPaid) / Number(props.row.invoicePayments[0].amount)"/>
              </q-td>
              <q-td>
                <q-btn
                  flat
                  color="primary"
                  icon="mdi-download"
                  @click="openPdfInvoiceInNewTabDependingOfType(props.row.invoiceData.id)"/>
              </q-td>
              <q-td>
                <q-btn
                  flat
                  color="primary"
                  icon="mdi-arrow-right-bold-box-outline"
                  @click="openPayInvoiceInNewTab(props.row.invoiceData.id)"/>
              </q-td>
              <q-td>
                <q-chip square dense  color="primary" text-color="white" class="text-bold" style="margin-left: 0;">
                  {{getValidForString(props.row.invoiceData.expirationTime, props.row.invoiceData.createdTime)}}
                </q-chip>
              </q-td>
              <q-td>
                <q-input
                  style="min-width:100px !important;"
                  v-if="props.row.invoiceData.id"
                  dense
                  type="text"
                  square
                  onkeypress="return false;"
                  :value="props.row.invoiceData.id">
                </q-input>
              </q-td>
              <q-td v-if="props.row.invoiceData.status.toUpperCase() === 'SETTLED'">
                <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(getPaymentDoneDate(props.row)) }}
                <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(getPaymentDoneDate(props.row)) }}
              </q-td>
              <q-td v-else>
                <countdown :time="getMillisecondsBetweenNowAndDate(props.row.invoiceData.expirationTime)" class="text-bold">
                  <template slot-scope="props">
                    <span v-if="props.days > 0">{{props.days}} days</span><span v-if="props.hours > 0"> {{props.hours}} hours</span> {{ props.minutes }} minutes {{ props.seconds }} seconds
                  </template>
                </countdown>
              </q-td>
              <q-td>
                <q-badge :class="getStatusLabelColor(props.row.invoiceData.status)">
                  <div class="text-subtitle2 text-uppercase">
                    <q-icon name="mdi-file-sync" /> {{props.row.invoiceData.status}}</div>
                </q-badge>
              </q-td>
              <q-td>
                <q-badge class="text-bold float-left" v-if="
                props.row.invoiceData.status.toLowerCase() &&
                props.row.invoicePayments.filter(_ => _.paymentMethod === 'BTC-LightningNetwork').length > 0 &&
                props.row.invoicePayments.filter(_ => _.paymentMethod === 'BTC-LightningNetwork')[0].paymentMethodPaid !== '0'" style="margin: 1px"> <q-icon size="xs" name="mdi-flash" color="yellow-7"></q-icon>
                  <q-tooltip>
                    Invoice was paid with Lightning Network.
                  </q-tooltip>
                  LIGHTNING
                </q-badge>
                <q-badge class="text-bold float-left" v-if="
                props.row.invoiceData.status.toLowerCase() === 'settled' &&
                props.row.invoicePayments.filter(_ => _.paymentMethod === 'BTC').length > 0 &&
                props.row.invoicePayments.filter(_ => _.paymentMethod === 'BTC')[0].paymentMethodPaid !== '0'" style="margin: 1px"> <q-icon size="xs" name="mdi-bitcoin" color="orange-8"></q-icon>
                  <q-tooltip>
                    Invoice was paid with standard Bitcoin transaction.
                  </q-tooltip>
                  BITCOIN
                </q-badge>
              </q-td>
            </q-tr>
          </template>
        </q-table>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import InvoicesMixin from '../../mixins/invoices-mixin';
import { formatOnlyDate, formatOnlyTime } from 'src/api/date-service';
import HeaderQchip from 'components/utils/HeaderQchip.vue';

export default InvoicesMixin.extend({
  components: { HeaderQchip },
  name: 'InvoicesTable',
  props: {
    timeframe: {
      type: String,
      required: false,
      default : '',
    },
    invoices: {
      type: Array,
      required: true,
    },
    isBillingInvoices: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      columns: [
        { label: 'Invoice date & Due date', sortable: true, align: 'left' },
        { label: 'Description', align: 'left' },
        { label: 'Buyer', align: 'left' },
        { label: 'Amount', sortable: true, align: 'left' },
        { label: 'Currency', sortable: true, align: 'left' },
        { label: 'Amount [BTC]', align: 'left' },
        { label: 'Used price rate', align: 'left' },
        { label: 'Total paid', align: 'center' },
        { label: 'Invoice PDF', align: 'left'},
        { label: 'Payment widget', align: 'left'},
        { label: 'Invoice validity', align: 'left'},
        { label: 'Invoice ID', align: 'left'},
        { label: 'Expiration time left | Paid date', align: 'left'},
        { label: 'Status', align: 'left'},
        { label: 'Payment done method', align: 'left'},
      ]
    };
  },
  mounted() {
    this.loadInvoices();
  },
  methods: {
    timeFormatOnly(date: number) {
      return formatOnlyTime(date);
    },
    dateFormatOnly(date: number) {
      return formatOnlyDate(date);
    },
    loadInvoices() {
      // @ts-ignore
      this.data = this.invoices;
      this.filteredData = this.data;
      this.filteredData.sort((a: any, b: any) => b.invoiceData.createdTime - a.invoiceData.createdTime);
      this.filterSavedData = this.filteredData;
      console.log(this.filteredData);
    },
    getAmountInBitcoin(row: any) {
      const amount: string = row.invoicePayments[0].amount;
      if (amount === "0") {
        return row.invoicePayments[0].totalPaid;
      } else {
        return amount;
      }
    },
    openPdfInvoiceInNewTabDependingOfType(invoiceId: string) {
      this.$router.push(`/payments/pdf/${invoiceId}?isBillingInvoice=${this.isBillingInvoices ?? false}`)
    }
  },
});
</script>
