<template>
  <q-page>
    <loader :show="showLoading"></loader>
    <div class="row">
      <div class="col-lg-6 col-xs-grow q-pa-xs" v-if="this.userLndDto">
        <user-lnd-form :user-lnd-dto="this.userLndDto"></user-lnd-form>
      </div>
      <div class="col-lg-6 col-xs-grow q-pa-xs" v-if="this.customLndDto">
        <custom-lnd-form :custom-lnd-dto="this.customLndDto"></custom-lnd-form>
      </div>
      <div class="col-lg-6 col-xs-grow q-pa-xs">
        <user-btc-form :user-btc-wallet-dto="this.userBtcWalletDto" v-if="this.userBtcWalletDto"></user-btc-form>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">

  import UserLndForm from 'components/lnd/UserLndForm.vue';
  import CustomLndForm from 'components/lnd/CustomLndForm.vue';
  import UserBtcForm from 'components/btc/UserBtcForm.vue';
  import { get } from 'src/api/http-service';
  import GlobalMixin from "../../mixins/global-mixin";
  import { showNotificationError } from 'src/api/notificatios-api';
  import Loader from 'components/utils/Loader.vue';

  export default GlobalMixin.extend({
    name: 'BitcoinOverviewPage',
    components: { UserLndForm, UserBtcForm, CustomLndForm, Loader },
    data() {
      return {
        userLndDto: undefined,
        customLndDto: undefined,
        userBtcWalletDto: undefined,
      };
    },
    mounted() {
      this.showLoading = true;
      get(this.$axios, '/api/lnd/user', (res: any) => {
        this.showLoading = false;
        console.log('User lnd data: ', res.data);
        this.userLndDto = res.data;
      }, (err) => {
        console.log('User lnd get err: ', err);
        get(this.$axios, '/api/lnd/custom', (res: any) => {
          this.showLoading = false;
          console.log('Custom lnd data: ', res.data);
          this.customLndDto = res.data;
        }, (err) => {
          console.log('Custom lnd get err: ', err);
          this.showLoading = false;
          this.$router.push('/lnd/setup');
        });
      });
      get(this.$axios, '/api/btc/wallet', (res: any) => {
        console.log(res.data);
        this.userBtcWalletDto = res.data;
      }, (err) => {
        console.log(err);
      });
    },
  });
</script>
