import GlobalMixin from "./global-mixin";
import { get } from 'src/api/http-service';
import { addDaysToDate, formatDate } from 'src/api/date-service';

export default GlobalMixin.extend({
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
      createInvoiceButtonLocked: false,
    };
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
    dateFormatted(date: number) {
      return formatDate(date);
    },
    addDueTimeToDate(date: number) {
      return addDaysToDate(date, 24);
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
    getStatusLabelColor(status: string) {
      switch (status) {
        case 'new':
          return 'text-white';
        case 'complete':
          return 'text-lime-5';
        case 'expired':
          return 'text-orange';
        default:
          return 'text-white';
      }
    },
  }
});
