import Vue from 'vue';
import { openURL } from 'quasar'
import { sleep } from 'src/api/sleep-service';
import { hasPasswordProofSet } from 'src/api/session-service';

export default Vue.extend({
  data() {
    return {
      errorBannerMessage: '',
      showLoading: false,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      // It's the screen to use so height - topbar - bottom bar
      innerScreenHeight: window.innerHeight - 100,
    };
  },
  mounted() {
    window.onresize = () => {
      this.screenWidth = window.innerWidth;
      this.screenHeight = window.innerHeight;
      this.innerScreenHeight = window.innerHeight - 100;
    };
  },
  computed: {
    isMobile(): boolean {
      return this.$q.platform.is.mobile;
    },
  },
  methods: {
    getStatusLabelColor(status: string) {
      switch (status) {
        case 'new':
          return 'bg-orange text-primary';
        case 'complete':
        case 'paid':
        case 'confirmed':
          return 'text-white bg-green';
        case 'expired':
          return 'text-primary bg-grey';
        default:
          return 'text-white bg-primary';
      }
    },
    openUrlNewTab(url: string) {
      openURL(url);
    },
    openUrlTheSameTab(url: string) {
      window.open(url, '_self');
    },
    handleRequestError(err: any, errorCodeCallback: any) {
      if (this.isHttpError(err) &&
        (this.isHttpErrorStatus(err, 500) || this.isHttpErrorStatus(err, 400)) &&
        this.httpErrorDoesntHaveMessageResponse(err)) {
        if (err.response.data.errorCode !== undefined) {
          errorCodeCallback(err.response.data.errorCode);
        } else {
          this.errorBannerMessage = err.response.data.errorMessage;
        }
      } else if (this.isHttpError(err) && this.isHttpErrorStatus(err, 401)) {
        this.errorBannerMessage = 'Given credentials are incorrect';
      } else {
        this.errorBannerMessage = 'Request failed. Unexpected server error.';
      }
    },
    isHttpError(err: any) {
      return err.response !== undefined && err.response.status !== undefined;
    },
    isHttpErrorStatus(err: any, status: any) {
      return err.response.status === status;
    },
    httpErrorDoesntHaveMessageResponse(err: any) {
      return err.response.data !== undefined && err.response.data.errorMessage !== undefined;
    },
    sleep(ms: number) {
      return sleep(ms);
    },
  },
});
