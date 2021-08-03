<template>
  <q-card class="shadow-10 bg-grey-2">
    <q-card-section>
      <header-qchip :text="`Invoices [ ${timeframe} ]`" icon="mdi-table-large" size="md"></header-qchip>
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
            <q-tr :props="props">
              <q-td>
                <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(props.row.invoiceTime) }}
                <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(props.row.invoiceTime) }}
              </q-td>
              <q-td>
                <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(props.row.expirationTime) }}
                <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(props.row.expirationTime) }}
              </q-td>
              <q-td>
                <q-input
                  v-if="props.row.itemDesc"
                  dense
                  type="text"
                  square
                  onkeypress="return false;"
                  :value="props.row.itemDesc">
                </q-input>
              </q-td>
              <q-td>
                <q-input
                  v-if="props.row.buyer.name"
                  dense
                  type="text"
                  square
                  onkeypress="return false;"
                  :value="props.row.buyer.name">
                </q-input>
              </q-td>
              <q-td >
                <q-chip dense square color="primary" class="text-subtitle2" outline text-color="white">
                  {{ props.row.price.toFixed(2) }}
                </q-chip>
              </q-td>
              <q-td >
                <q-chip dense square color="grey" class="text-subtitle2" text-color="white">
                  {{ props.row.currency }}
                </q-chip>
              </q-td>
              <q-td >
                <q-chip dense square color="primary" class="text-subtitle2" outline text-color="white">
                  {{ props.row.btcPrice }}
                </q-chip>
              </q-td>
              <q-td >
                <q-linear-progress stripe size="10px" :value="Number(props.row.btcPaid) / Number(props.row.btcPrice)"/>
              </q-td>
              <q-td>
                <q-btn
                  flat
                  color="primary"
                  icon="mdi-download"
                  @click="$router.push(`/payments/pdf/${props.row.id}`)"/>
              </q-td>
              <q-td>
                <q-btn
                  flat
                  color="primary"
                  icon="mdi-arrow-right-bold-box-outline"
                  @click="openPayInvoiceInNewTab(props.row.id)"/>
              </q-td>
              <q-td>
                <q-chip square dense  color="primary" text-color="white" class="text-bold" style="margin-left: 0;">
                  {{getValidForString(props.row.expirationTime, props.row.invoiceTime)}}
                </q-chip>
              </q-td>
              <q-td >
                {{props.row.id}}
              </q-td>
              <q-td v-if="props.row.status.toUpperCase() === 'COMPLETE'">
                <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(getPaymentDoneDate(props.row)) }}
                <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(getPaymentDoneDate(props.row)) }}
              </q-td>
              <q-td v-else>
                <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(props.row.expirationTime) }}
                <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(props.row.expirationTime) }}
              </q-td>

              <q-td>
                <q-badge class="float-right" :class="getStatusLabelColor(props.row.status)">
                  <div class="text-subtitle2 text-uppercase">
                    <q-icon name="mdi-file" /> {{props.row.status}}</div>
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
      required: true,
    },
    dashboardInfo: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      columns: [
        { label: 'Invoice date', sortable: true, align: 'left' },
        { label: 'Due date', sortable: true, align: 'left' },
        { label: 'Description', align: 'left' },
        { label: 'Buyer', align: 'left' },
        { label: 'Amount', sortable: true, align: 'left' },
        { label: 'Currency', sortable: true, align: 'left' },
        { label: 'Amount [BTC]', align: 'left' },
        { label: 'Total paid', align: 'center' },
        { label: 'Invoice PDF', align: 'left'},
        { label: 'Payment widget', align: 'left'},
        { label: 'Invoice validity', align: 'left'},
        { label: 'Invoice ID', align: 'left'},
        { label: 'Paid date/Expiration date', align: 'left'},
        { label: 'Status', align: 'right'},
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
      this.data = this.dashboardInfo.invoices;
      this.filteredData = this.data;
      this.filteredData.sort((a: any, b: any) => b.invoiceTime - a.invoiceTime);
      this.filterSavedData = this.filteredData;
    },
  },
});
</script>
