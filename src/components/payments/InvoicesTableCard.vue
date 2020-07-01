<template>
  <div>
    <loader :show="showLoading"></loader>
    <q-card class="q-ma-md shadow-10 bg-grey-2">
      <q-card-section>
        <div class="text-h4">Your invoices</div>
      </q-card-section>
      <q-card-section>
        <div :class="{ 'q-pa-md': !$q.platform.is.mobile }">
          <q-table
            grid
            :data="filteredData"
            :columns="columns"
            row-key="name"
            hide-header>
            <template v-slot:top-right>
              <div class="q-pa-xs" style="width: 200px;height:100%;" debounce="300">
                <q-select v-model="invoiceStatus" :options="invoiceStatuses" label="Invoice status"/>
              </div>
              <div class="q-pa-xs" style="width: 200px;height:100%;" debounce="300">
                <q-select v-model="orderByDate" :options="orderByDateOptions" label="Order by date"/>
              </div>
            </template>
            <template v-slot:top-left>
              <q-input dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
            </template>
            <template v-slot:item="props">
              <div class="q-pa-md col-xs-12 col-sm-6 col-md-4" :class="{ 'noPaddingRightAndLeft': $q.platform.is.mobile }">
                <q-card class="shadow-10 grow2">
                  <q-card-section>
                    <q-badge :color="getStatusLabelColor(props.row.status)" floating>
                      <div class="text-subtitle1">
                        <q-icon name="info"/> {{props.row.status}}</div>
                    </q-badge>
                    <q-list>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-cash-multiple"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label><span v-bind:style="{'font-size': `${getPriceFontSize(props.row.id)}px`}">{{props.row.price}}</span>
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
                      <q-item v-if="props.row.itemDesc">
                        <q-item-section avatar>
                          <q-icon color="primary" name="description"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{props.row.itemDesc}}</q-item-label>
                          <q-item-label caption>Description</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="props.row.buyer.name">
                        <q-item-section avatar>
                          <q-icon color="primary" name="account_box"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{props.row.buyer.name}}</q-item-label>
                          <q-item-label caption>Buyer (customer)</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi"/>
                        </q-item-section>
                        <q-item-section>
                          <q-linear-progress stripe size="10px" :value="props.row.amountPaid / Number(props.row.btcPrice)"/>
                          <q-item-label caption>Total paid</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="today"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            {{dateFormatted(props.row.invoiceTime)}}
                          </q-item-label>
                          <q-item-label caption>Creation date</q-item-label>
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
                      <q-item>
                        <q-item-section>
                          <q-btn color="primary" label="Invoice PDF" icon="mdi-file-pdf" @click="$router.push(`/payments/pdf/${props.row.id}`)"/>
                        </q-item-section>
                      </q-item>
                      <q-item >
                        <q-item-section>
                            <q-btn  color="primary" label="Payment" icon="mdi-eye-settings" @click="openInNewTab(props.row.id)"/>
                        </q-item-section>
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
  import GlobalMixin from "../../mixins/global-mixin";
  import Loader from 'components/utils/Loader.vue';
  import { get } from 'src/api/http-service';
  import { formatDate } from "src/api/date-service";

  export default GlobalMixin.extend({
    components: { Loader },
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
        filter: '',
        invoiceStatus: 'all',
        invoiceStatuses: ['all', 'new', 'expired', 'paid'],
        orderByDate: 'newest first',
        orderByDateOptions: ['newest first', 'oldest first'],
        data: [],
        filteredData: [],
        filterSavedData: [],
        priceFontSizes: [],
        columns: [
          {
            name: 'URL',
            required: true,
            label: 'Invoice URL',
            align: 'left',
            field: 'url',
            format: (val: any) => `${val}`,
            sortable: true,
          },
          { name: 'currency', align: 'center', label: 'Currency', field: 'currency' },
          { name: 'amount', label: 'Amount [currency]', field: 'price', sortable: true },
          { name: 'amountBtc', label: 'Amount [BTC]', field: 'btcPrice' },
          { name: 'invoiceDate', label: 'Invoice date', field: 'invoiceTime', sortable: true },
          { name: 'status', label: 'Status', field: 'status' },
        ],
        createInvoiceButtonLocked: false,
      };
    },
    mounted() {
      this.loadInvoices();
    },
    watch: {
      reloadInvoices() {
        this.loadInvoices();
      },
      invoiceStatus() {
        this.filteredData = this.reorderByStatus(this.data);
        this.reorderByDate(this.filteredData);
      },
      orderByDate() {
        this.filteredData = this.reorderByStatus(this.data);
        this.reorderByDate(this.filteredData);
      },
      filter() {
        if (this.filter === '') {
          this.filteredData = this.data;
        } else {
          const filter: string = this.filter.toLowerCase();
          this.filteredData = this.data.filter((invoice: any) =>
            invoice.currency.toLowerCase().includes(filter) ||
            String(invoice.price).toLowerCase().includes(filter) ||
            invoice.btcPrice.toLowerCase().includes(filter) ||
            invoice.status.toLowerCase().includes(filter) ||
            invoice.itemDesc.toLowerCase().includes(filter) ||
            invoice.id.toLowerCase().includes(filter) ||
            (invoice.buyer.name && invoice.buyer.name.toLowerCase().includes(filter)));
        }
      },
    },
    methods: {
      reorderByDate(data: any[]) {
        if (this.orderByDate === 'newest first') {
          data = data.sort((a: any, b: any) => b.invoiceTime - a.invoiceTime);
        } else {
          data = data.sort((a: any, b: any) => a.invoiceTime - b.invoiceTime);
        }
      },
      reorderByStatus(data: any[]): any[] {
        if (this.invoiceStatus !== 'all') {
          return data.filter((invoice: any) => invoice.status.toLowerCase() === this.invoiceStatus.toLowerCase());
        } else {
          return this.data;
        }
      },
      loadInvoices() {
        get(this.$axios, '/api/payments/invoices', async (res: any) => {
          await this.sleep(200); // small sleep required
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
      dateFormatted(date: number) {
        return formatDate(date);
      },
      openInNewTab(invoiceId: string) {
        if (this.$q.platform.is.mobile) {
          this.$router.push(`/invoices/${invoiceId}`);
        } else {
          const route = this.$router.resolve({ path: `/invoices/${invoiceId}` });
          window.open(route.href, '_blank');
        }
      },
      saveInvoice() {
        this.showLoading = true;
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
          return this.priceFontSizes.filter((priceFontSize: any) => priceFontSize.id === id)[0].fontSize;
        } else {
          return 14;
        }
      },
      getStatusLabelColor(status: string) {
        switch (status) {
          case 'new':
            return 'orange';
          case 'complete':
            return 'primary';
          case 'expired':
            return 'grey';
          default:
            return 'grey';
        }
      },
    },
  });

</script>
