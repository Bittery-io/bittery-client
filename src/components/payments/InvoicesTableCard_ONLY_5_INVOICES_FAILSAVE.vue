<template>
  <div>
    <loader :show="showLoading"></loader>
    <q-card class="q-ma-md shadow-10">
      <q-card-section>
        <div class="text-h4">Your invoices</div>
      </q-card-section>
      <q-card-section>
        <div class="q-pa-md">
          <q-table
            grid
            :data="data"
            :columns="columns"
            row-key="name"
            hide-header
          >
            <template v-slot:top-right>
              <q-input dense debounce="300" v-model="filter" placeholder="Search">
                <template v-slot:append>
                  <q-icon name="search"/>
                </template>
              </q-input>
            </template>
            <div slot="pagination" slot-scope="props" class="row flex-center q-py-sm">
              <q-btn
                round dense size="sm" icon="undo" class="q-mr-sm"
                :disable="props.isFirstPage"
                @click="previous(props)"
              />
              <div class="q-mr-sm" style="font-size: small">
                Page {{ props.pagination.page }}
              </div>
              <q-btn
                round dense size="sm" icon="redo"
                @click="fetchInvoicesAndGoToNextPage(props)"
              />
            </div>
            <template v-slot:item="props">
              <div class="q-pa-md col-xs-12 col-sm-6 col-md-4">
                <q-card class="shadow-10 grow2">
                  <q-card-section>
                    <q-badge :color="getStatusLabelColor(props.row.status)" floating>
                      <div class="text-body1">
                        <q-icon name="mdi-information"/> {{props.row.status}}</div>
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
                          <q-icon color="primary" name="mdi-file-document-edit"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{props.row.itemDesc}}</q-item-label>
                          <q-item-label caption>Description</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item v-if="props.row.buyer.name">
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-card-account-details"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{props.row.buyer.name}}</q-item-label>
                          <q-item-label caption>Buyer (customer)</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-chart-arc"/>
                        </q-item-section>
                        <q-item-section>
                          <q-linear-progress stripe size="10px"
                                             :value="props.row.amountPaid / Number(props.row.btcPrice)"/>
                          <q-item-label caption>Total paid</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item>
                        <q-item-section avatar>
                          <q-icon color="primary" name="mdi-calendar"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>
                            {{new Date(props.row.invoiceTime).toUTCString()}}
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
                      <q-item>
                        <q-item-section>
                            <q-btn color="primary" outline label="Payment" icon="mdi-eye-settings" @click="openInNewTab(props.row.id)"/>
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
        offset: 0,
        offsetNumberAdd: 5,
        currentOffset: 0,
        filter: '',
        data: [],
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
    watch: {
      reloadInvoices() {
        this.offset = 0;
        this.loadInvoices();
      },
    },
    mounted() {
      this.loadInvoices();
    },
    methods: {
      previous(props: any) {
        props.prevPage();
        this.currentOffset -= this.offsetNumberAdd;
      },
      fetchInvoicesAndGoToNextPage(props: any) {
        console.log(this.currentOffset);
        this.currentOffset += this.offsetNumberAdd;
        if (this.currentOffset > this.offset) {
          this.offset += this.offsetNumberAdd;
          this.loadInvoices(true, () => {
            // eslint-disable-next-line no-unused-expressions
            props.nextPage();
          });
        } else {
          props.nextPage();
        }
      },
      loadInvoices(addToExisting?: boolean, onFetchedFunction?: Function) {
        get(this.$axios, `/api/payments/invoices?offset=${this.offset}`, async (res: any) => {
          await this.sleep(200); // small sleep required
          this.showLoading = false;
          if (addToExisting) {
            console.log('Mam nowych', res.data.length);
            this.data = this.data.concat(res.data);
          } else {
            this.data = res.data;
          }
          this.data.sort((a: any, b: any) => b.invoiceTime - a.invoiceTime);
          this.setPriceFontSizes();
          if (onFetchedFunction) {
            await this.sleep(200); // small sleep required
            onFetchedFunction();
          }
        }, (err: any) => {
          this.createInvoiceButtonLocked = false;
          this.showLoading = false;
          console.log(err);
        });
      },
      openInNewTab(invoiceId: string) {
        const route = this.$router.resolve({ path: `/invoices/${invoiceId}` });
        window.open(route.href, '_blank');
      },
      saveInvoice() {
        this.showLoading = true;
      },
      // min 14px, max 50px
      setPriceFontSizes() {
        if (this.data.length >= 2) {
          const rows: any[] = this.data.map((row: any) => {
            return {
              id: row.id,
              btcPrice: Number(row.btcPrice),
            };
          });
          // price from greatest to lowest
          rows.sort((a, b) => b.btcPrice - a.btcPrice);
          console.log('btc prices', rows);
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
          console.log(this.priceFontSizes);
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
