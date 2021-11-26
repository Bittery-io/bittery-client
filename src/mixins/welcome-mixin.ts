import GlobalMixin from "./global-mixin";
import { hasPasswordProofSet } from 'src/api/session-service';

export default GlobalMixin.extend({
  data() {
    return {
    };
  },
  mounted() {
    if (hasPasswordProofSet()) {
      this.$router.push('/payments/setup/new');
    }
  }
});
