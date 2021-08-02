<template>
  <q-page>
    <loader :show="showLoading"></loader>
    <div class="row">
      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }" v-if="this.expiredUserLndDto">
        <expired-lnd-form :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" :expired-user-lnd-dto="this.expiredUserLndDto"></expired-lnd-form>
        <lnd-backup-table :lnd-id="this.expiredUserLndDto.lndId" :is-expired="true" :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" ></lnd-backup-table>
      </div>
      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }" v-if="this.userLndDto">
          <lnd-summary-form :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" :user-lnd-dto="this.userLndDto"></lnd-summary-form>
      </div>
      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">
          <lnd-details-form :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" :lnd-info="this.userLndDto.lndInfo" v-if="this.userLndDto && this.userLndDto.lndInfo"></lnd-details-form>
          <lnd-backup-table v-if="this.userLndDto && !this.userLndDto.lndInfo" :lnd-id="this.userLndDto.lndId" :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" ></lnd-backup-table>
      </div>
      </div>
    <div class="row">
      <div class="col-lg-6 col-xs-grow">
        <lnd-connectivity-form :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" :user-lnd-dto="this.userLndDto" v-if="this.userLndDto"></lnd-connectivity-form>
      </div>
      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }" v-if="this.userLndDto && this.userLndDto.lndInfo && this.userLndDto.hostedLndType">
        <lnd-backup-table :lnd-id="this.userLndDto.lndId" :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" ></lnd-backup-table>
      </div>
      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }" v-if="this.customLndDto">
        <custom-lnd-form :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" :custom-lnd-dto="this.customLndDto"></custom-lnd-form>
      </div>
    </div>

  </q-page>
</template>

<script lang="ts">

  import LndSummaryForm from 'components/lnd/LndSummaryForm.vue';
  import LndConnectivityForm from 'components/lnd/LndConnectivityForm.vue';
  import LndDetailsForm from 'components/lnd/LndDetailsForm.vue';
  import CustomLndForm from 'components/lnd/CustomLndForm.vue';
  import UserBtcForm from 'components/btc/UserBtcForm.vue';
  import { get } from 'src/api/http-service';
  import GlobalMixin from "../../mixins/global-mixin";
  import Loader from 'components/utils/Loader.vue';
  import LndBackupPopup from 'components/lnd/backup/LndBackupPopup.vue';
  import LndBackupTable from 'components/lnd/backup/LndBackupTable.vue';
  import ExpiredLndForm from 'components/expired/ExpiredLndForm.vue';

  export default GlobalMixin.extend({
    name: 'BitcoinOverviewPage',
    components: {
      ExpiredLndForm, LndBackupPopup, LndSummaryForm, UserBtcForm, LndDetailsForm, CustomLndForm, Loader, LndConnectivityForm, LndBackupTable
    },
    data() {
      return {
        userLndDto: undefined,
        expiredUserLndDto: undefined,
        customLndDto: undefined,
        userBtcWalletDto: undefined,
      };
    },
    mounted() {
      this.showLoading = true;
      get(this.$axios, '/api/lnd/user', (res: any) => {
        this.showLoading = false;
        console.log('User lnd data: ', res.data);
        this.userLndDto = res.data.activeUserLndDto;
        this.expiredUserLndDto = res.data.expiredUserLndDto;
      }, async (err: any) => {
        console.log('User lnd get err: ', err);
          this.showLoading = false;
          await this.sleep(200);
          await this.$router.push('/ln/setup');
        // get(this.$axios, '/api/lnd/custom', async (res: any) => {
        //   console.log('Custom lnd data: ', res.data);
        //   this.customLndDto = res.data;
        // }, async (err: any) => {
        //   console.log('Custom lnd get err: ', err);
        //   await this.sleep(200);
        //   this.showLoading = false;
        //   await this.sleep(200);
        //   await this.$router.push('/ln/setup');
        // });
      });
    },
  });
</script>
