import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      showQrCodePopup: false,
    };
  },
  computed: {
    isMobile(): boolean {
      return this.$q.platform.is.mobile;
    },
  },
  methods: {
    getColorDependingOfStatus(lndStatus: string) {
      switch(lndStatus) {
        case 'WORKING':
          return 'primary';
        case 'STOPPED':
          return 'red';
        case 'TURNED_OFF':
          return 'orange';
        default:
          return 'grey';
      }
    },
  },
});
