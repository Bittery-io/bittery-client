import GlobalMixin from "./global-mixin";
import { get } from 'src/api/http-service';
import { addDaysToDate, formatDate, getDaysBetweenTwoDates, getHoursBetweenTwoDates } from 'src/api/date-service';
import { fasUnderline } from '@quasar/extras/fontawesome-v5';

export default GlobalMixin.extend({
  data() {
    return {
      filter: '',
      invoiceStatus: 'all',
      invoiceStatuses: ['all', 'new', 'expired', 'complete'],
      orderByDate: 'newest first',
      orderByDateOptions: ['newest first', 'oldest first'],
      data: [],
      filteredData: [],
      filterSavedData: [],
      priceFontSizes: [],
      createInvoiceButtonLocked: false,
      usdFormatter: undefined,
      eurFormatter: undefined,
      plnFormatter: undefined,
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
    currentPriceDependingOfCurrency(currency: string, price: string) {
      if (currency.toUpperCase() === 'PLN') {
        return this.plnFormatter.format(price);
      } else if (currency.toUpperCase() === 'USD') {
        return this.usdFormatter.format(price);
      } else if (currency.toUpperCase() === 'EUR') {
        return this.eurFormatter.format(price);
      }
    },
    getPaymentDoneDate(row: any) {
      if (row.status.toUpperCase() === 'COMPLETE') {
        //todo probably should be done better
        console.log(row.cryptoInfo[0].payments[0].receivedDate);
        return new Date(row.cryptoInfo[0].payments[0].receivedDate).getTime();
      }
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
    openPayInvoiceInCurrentTab(invoiceId: string) {
      // @ts-ignore
      window.btcpay.setApiUrlPrefix(process.env.BTCPAY_URL);
      // @ts-ignore
      window.btcpay.showInvoice(invoiceId);
    },
    saveInvoice() {
      this.showLoading = true;
    },
  }
});
