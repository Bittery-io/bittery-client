<template>
  <q-card class="q-ma-md shadow-10 bg-grey-2">
    <q-card-section>
      <header-qchip :text="`Invoices [ ${timeframe} ]`" icon="mdi-table-large" size="md"></header-qchip>
    </q-card-section>
    <q-card-section style="padding-top: 0;margin-top:0;">
        <q-table
          class="shadow-0"
          style="background-color: transparent"
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
                <q-input
                  dense
                  type="text"
                  square
                  onkeypress="return false;"
                  :value="props.row.itemDesc">
                </q-input>
              </q-td>
              <q-td>
                <q-input
                  dense
                  type="text"
                  square
                  onkeypress="return false;"
                  :value="props.row.buyer.name">
                </q-input>
              </q-td>
              <q-td >{{ props.row.price.toFixed(2) }}</q-td>
              <q-td >{{ props.row.currency }}</q-td>
              <q-td >{{ props.row.btcPrice }} </q-td>
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
                  @click="openInNewTab(props.row.id)"/>
              </q-td>
              <q-td>
                <q-badge class="float-right">
                  <div class="text-subtitle2 text-uppercase" :class="getStatusLabelColor(props.row.status)">
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
        { label: 'Description', align: 'left' },
        { label: 'Buyer', align: 'left' },
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
      this.filteredData = this.dashboardInfo.invoices;
      console.log(this.filteredData);
      this.filteredData.sort((a: any, b: any) => b.invoiceTime - a.invoiceTime);
      this.filterSavedData = this.filteredData;
    },
  },
});
</script>
