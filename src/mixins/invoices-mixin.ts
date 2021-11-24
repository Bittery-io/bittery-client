import GlobalMixin from "./global-mixin";
import { get } from 'src/api/http-service';
import {
  addDaysToDate,
  formatDate,
  getDaysBetweenTwoDates,
  getHoursBetweenTwoDates,
  getMillisecondsBetweenTwoDates
} from 'src/api/date-service';
import { fasUnderline } from '@quasar/extras/fontawesome-v5';

export default GlobalMixin.extend({
  data() {
    return {
      filter: '',
      invoiceStatus: 'ALL',
      invoiceStatuses: ['ALL', 'NEW', 'EXPIRED', 'SETTLED'],
      orderByDate: 'newest first',
      orderByDateOptions: ['newest first', 'oldest first'],
      data: [],
      filteredData: [],
      filterSavedData: [],
      priceFontSizes: [],
      createInvoiceButtonLocked: false,
      usdFormatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      eurFormatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
      }),
      plnFormatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'PLN',
      }),
    };
  },
  mounted() {
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
  },
  watch: {
    invoiceStatus() {
      // @ts-ignore
      this.filteredData = this.reorderByStatus(this.data);
      this.reorderByDate(this.filteredData);
    },
    orderByDate() {
      // @ts-ignore
      this.filteredData = this.reorderByStatus(this.data);
      this.reorderByDate(this.filteredData);
    },
    filter() {
      console.log(this.data);
      if (this.filter === '') {
        this.filteredData = this.data;
      } else {
        const filter: string = this.filter.toLowerCase();
        this.filteredData = this.data.filter((invoice: any) =>
          invoice.invoiceData.currency.toLowerCase().includes(filter) ||
          String(invoice.invoiceData.amount).toLowerCase().includes(filter) ||
          // invoice.btcPrice.toLowerCase().includes(filter) ||
          invoice.invoiceData.status.toLowerCase().includes(filter) ||
          invoice.invoiceData.id.toLowerCase().includes(filter) ||
          (invoice.invoiceData.metadata && invoice.invoiceData.metadata.buyerName && invoice.invoiceData.metadata.buyerName.toLowerCase().includes(filter)) ||
          (invoice.invoiceData.metadata && invoice.invoiceData.metadata.itemDesc && invoice.invoiceData.metadata.itemDesc.toLowerCase().includes(filter))
        );
      }
    },
  },
  methods: {
    getMillisecondsBetweenNowAndDate(fromDate: number) {
      return getMillisecondsBetweenTwoDates(fromDate, new Date().getTime());
    },
    currentPriceDependingOfCurrency(currency: string, price: string) {
      if (currency.toUpperCase() === 'PLN') {
        return this.plnFormatter.format(Number(price));
      } else if (currency.toUpperCase() === 'USD') {
        return this.usdFormatter.format(Number(price));
      } else if (currency.toUpperCase() === 'EUR') {
        return this.eurFormatter.format(Number(price));
      }
    },
    getPaymentDoneDate(row: any) {
      if (row.invoiceData.status.toLowerCase() === 'settled') {
        console.log('asdf',row.invoiceData);
        // todo tutaj nalezy wyfiltorwac te ktore maja w dodatku status Marked bo te sa oznaczone jako zaplacone
        // todo takzze wtedy ni emają listy payments (bo nie bylo platnosci)
        // if (!row.invoiceData.additionalStatus) {
          console.log(row.invoicePayments.filter((invoicePayment: any) => invoicePayment.payments.length > 0)[0].payments[0].receivedDate);
          return new Date(row.invoicePayments.filter((invoicePayment: any) => invoicePayment.payments.length > 0)[0].payments[0].receivedDate * 1000).getTime();
        // }
      }
    },
    getClassDependingOfInvoiceStatus(status: string) {
      switch (status.toLowerCase()) {
        case 'settled':
          return 'bg-green-2';
        case 'expired':
          return 'bg-red-2';
        default:
          return '';
      }
    },
    reorderByDate(data: any[]) {
      if (this.orderByDate === 'newest first') {
        data = data.sort((a: any, b: any) => b.invoiceData.createdTime - a.invoiceData.createdTime);
      } else {
        data = data.sort((a: any, b: any) => a.invoiceData.createdTime - b.invoiceData.createdTime);
      }
    },
    reorderByStatus(data: any[]): any[] {
      if (this.invoiceStatus !== 'ALL') {
        return data.filter((invoice: any) => invoice.invoiceData.status.toLowerCase() === this.invoiceStatus.toLowerCase());
      } else {
        return this.data;
      }
    },
    getValidForString(expirationDate: number, invoiceDate: number) {
      const daysBetween: number = getDaysBetweenTwoDates(expirationDate, invoiceDate);
      if (daysBetween === 0) {
        const hoursBetween: number = getHoursBetweenTwoDates(expirationDate, invoiceDate);
        return `${hoursBetween} ${hoursBetween === 1 ? 'hour' : 'hours'}`;
      } else {
        return `${daysBetween} ${daysBetween === 1 ? 'day' :'days'}`;
      }
    },
    openPayInvoiceInNewTab(invoiceId: string) {
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
  }
});
