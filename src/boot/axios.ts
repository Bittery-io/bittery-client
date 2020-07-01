import axios, { AxiosInstance } from 'axios';
import { boot } from 'quasar/wrappers';
import { registerHttpInterceptor } from 'src/api/http-interceptor';

declare module 'vue/types/vue' {
  interface Vue {
    $axios: AxiosInstance;
  }
}

export default boot(({ Vue }) => {
  Vue.prototype.$axios = axios;
  registerHttpInterceptor(axios);
});
