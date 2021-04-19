<template>
  <q-card class="shadow-10 bg-grey-2">
    <q-card-section>
      <header-qchip text="Your billing invoices" icon="mdi-table-large" size="md"></header-qchip>
    </q-card-section>
    <q-card-section style="padding-top: 0;margin-top:0;">
      <div class="row q-pb-lg q-pl-md">
        <div class="col-lg-auto col-xs-grow">
          <q-input dense debounce="800" :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.75}px` : ''"
                   v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </div>
        <div class="col-grow"></div>
        <div class="col-lg-auto col-xs-grow">
          <div class="q-pa-xs"
               :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.75}px` : 'width: 200px;height:100%;'"
               debounce="400">
            <q-select v-model="invoiceStatus" dense :options="invoiceStatuses" label="Billing status"/>
          </div>
        </div>
        <div class="col-lg-auto col-xs-grow">
          <div class="q-pa-xs"
               :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.75}px` : 'width: 200px;height:100%;'"
               debounce="400">
            <q-select v-model="orderByDate" dense :options="orderByDateOptions" label="Order by date"/>
          </div>
        </div>
      </div>
      <q-table
        class="shadow-0"
        style=" background-color: transparent"
        dense
        :data="filteredData"
        :columns="columns"
        row-key="name">
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td>
              <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(props.row.invoiceTime) }}
              <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(props.row.invoiceTime) }}
            </q-td>
            <q-td>
              <q-input
                dense
                type="text"
                square
                onkeypress="return false;"
                :value="props.row.description">
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
                @click="$router.push(`/payments/pdf/${props.row.invoiceId}`)"/>
            </q-td>
            <q-td>
              <q-btn
                flat
                color="primary"
                icon="mdi-arrow-right-bold-box-outline"
                @click="openInNewTab(props.row.invoiceId)"/>
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
import { get } from 'src/api/http-service';

export default InvoicesMixin.extend({
  components: { HeaderQchip },
  name: 'BillingInvoicesTable',
  data() {
    return {
      columns: [
        { label: 'Invoice date', sortable: true, align: 'left' },
        { label: 'Description', align: 'left' },
        { label: 'Amount', sortable: true, align: 'left' },
        { label: 'Currency', sortable: true, align: 'left' },
        { label: 'Amount [BTC]', align: 'left' },
        { label: 'Total paid', align: 'center' },
        { label: 'Invoice PDF', align: 'left'},
        { label: 'Payment widget', align: 'left'},
        { label: 'Status', align: 'right'},
      ]
    };
  },
  mounted() {
    get(this.$axios, '/api/account/subscription/billings', (res: any) => {
      this.showLoading = false;
      this.data = res.data;
      this.filteredData = res.data;
    }, async (err: any) => {
      console.log('Getting billing dtos failed with err', err);
    })
  },
  methods: {
    timeFormatOnly(date: number) {
      return formatOnlyTime(date);
    },
    dateFormatOnly(date: number) {
      return formatOnlyDate(date);
    },
    getStatusLabelColor(status: string) {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'text-primary bg-orange';
        case 'complete':
        case 'paid':
        case 'confirmed':
          return 'text-white bg-green';
        case 'expired':
          return 'text-primary bg-grey';
        default:
          return 'text-white bg-primary';
      }
    }
  },
});
</script>
