import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      errorBannerMessage: '',
      showLoading: false,
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
    };
  },
  computed: {
    isMobile(): boolean {
      return this.$q.platform.is.mobile;
    },
  },
  methods: {
    openUrl(url: string) {
      console.log(url);
      window.open(url, '_blank');
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
        this.errorBannerMessage = 'Logowanie nieudane.';
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
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
  },
});
