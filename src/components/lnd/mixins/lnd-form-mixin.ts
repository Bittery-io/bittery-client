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
        case 'RUNNING':
          return 'primary';
        case 'STOPPED':
          return 'red';
        case 'INIT_REQUIRED ':
          return 'orange';
        default:
          return 'grey';
      }
    },
    getLabelDependingOfStatus(lndStatus: string) {
      if (lndStatus === 'INIT_REQUIRED') {
        return 'LN WALLET INITIALIZATION REQUIRED';
      } else if (lndStatus === 'UNLOCK_REQUIRED') {
        return 'NOT RUNNING - UNLOCK REQUIRED';
      } else {
        return lndStatus;
      }
    },
    getLndStatusCommentDependingOfStatus(lndStatus: string) {
      if (lndStatus === 'INIT_REQUIRED') {
        return 'Please proceed with required node initialization.';
      } else if (lndStatus === 'UNLOCK_REQUIRED') {
        return 'Your node is locked. Please unlock it.';
      } else if (lndStatus === 'RUNNING') {
        return 'Everything is good. All services ready to use.';
      } else {
        return '';
      }
    },
    getColorDependingOfBooleanStatus(status: boolean) {
      if (status) {
        return 'primary';
      } else {
        return 'grey';
      }
    }
  },
});
