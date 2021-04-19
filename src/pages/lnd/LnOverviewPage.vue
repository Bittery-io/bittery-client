<template>
  <q-page>
    <loader :show="showLoading"></loader>
<!--    <div class="row">-->
<!--      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }" v-if="this.userLndDto">-->
<!--        <div class="row">-->
<!--          <div class="col-12">-->
<!--            <lnd-summary-form-->
<!--              :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"-->
<!--              :user-lnd-dto="this.userLndDto">-->
<!--            </lnd-summary-form>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="row">-->
<!--          <div class="col-12">-->
<!--            <lnd-connectivity-form-->
<!--              :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"-->
<!--              :user-lnd-dto="this.userLndDto">-->
<!--            </lnd-connectivity-form>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }" v-if="this.userLndDto && this.userLndDto.lndInfo">-->
<!--        <div class="row">-->
<!--          <div class="col-12">-->
<!--            <lnd-details-form-->
<!--              :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"-->
<!--              :lnd-info="this.userLndDto.lndInfo">-->
<!--            </lnd-details-form>-->
<!--          </div>-->
<!--        </div>-->
<!--        <div class="row">-->
<!--          <div class="col-12">-->
<!--            <lnd-backup-table :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"></lnd-backup-table>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }" v-if="this.customLndDto">-->
<!--        <custom-lnd-form-->
<!--          :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"-->
<!--          :custom-lnd-dto="this.customLndDto">-->
<!--        </custom-lnd-form>-->
<!--      </div>-->
<!--      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">-->
<!--        <user-btc-form-->
<!--          :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"-->
<!--          :user-btc-wallet-dto="this.userBtcWalletDto" v-if="this.userBtcWalletDto"></user-btc-form>-->
<!--      </div>-->
<!--    </div>-->

    <div class="row">
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
        <lnd-connectivity-form :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" :user-lnd-dto="this.userLndDto"></lnd-connectivity-form>
      </div>
      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }" v-if="this.userLndDto && this.userLndDto.lndInfo">
        <lnd-backup-table :lnd-id="this.userLndDto.lndId" :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" ></lnd-backup-table>
      </div>
      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }" v-if="this.customLndDto">
        <custom-lnd-form :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'" :custom-lnd-dto="this.customLndDto"></custom-lnd-form>
      </div>
<!--      <div class="col-lg-6 col-xs-grow" :class="{ 'q-pa-xs': !$q.platform.is.mobile }">-->
<!--        <user-btc-form-->
<!--          :class="$q.platform.is.mobile ? 'q-ma-xs' : 'q-ma-md'"-->
<!--          :user-btc-wallet-dto="this.userBtcWalletDto" v-if="this.userBtcWalletDto"></user-btc-form>-->
<!--      </div>-->
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

  export default GlobalMixin.extend({
    name: 'BitcoinOverviewPage',
    components: { LndBackupPopup, LndSummaryForm, UserBtcForm, LndDetailsForm, CustomLndForm, Loader, LndConnectivityForm, LndBackupTable
    },
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
      }, async (err: any) => {
        console.log('User lnd get err: ', err);
        get(this.$axios, '/api/lnd/custom', async (res: any) => {
          this.showLoading = false;
          console.log('Custom lnd data: ', res.data);
          this.customLndDto = res.data;
        }, async (err: any) => {
          console.log('Custom lnd get err: ', err);
          await this.sleep(200);
          this.showLoading = false;
          await this.sleep(200);
          await this.$router.push('/ln/setup');
        });
      });
    },
  });
</script>
