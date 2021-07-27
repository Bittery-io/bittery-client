<template>
  <q-card class="shadow-10 bg-grey-2" v-if="this.userLndDto">
    <loader :show="showLoading"></loader>
    <provide-master-password-popup :show="showConfirmMasterPasswordPopup"
                                   subheader="It is required for decrypting your LN Node password"
                                   @passwordConfirmed="onPasswordConfirmed"
                                   loader-header="Decrypting LN Node password">
    </provide-master-password-popup>
    <qr-code-popup :show="showQrCodePopup" :qr-code="userLndDto.lndConnectUri"></qr-code-popup>
    <confirm-lnd-restart-popup :show="showConfirmLndRestartPopup" :lnd-id="userLndDto.lndId" :turned-off="true"></confirm-lnd-restart-popup>
    <rtl-insecure-popup :show="showRtlInsecurePopup" :rtl-address="this.userLndDto.rtlAddress"></rtl-insecure-popup>
    <q-card-section>
     <header-qchip :text="$q.platform.is.mobile ? 'Your LN Node' : 'Your Lightning Network Node'" icon="mdi-flash"></header-qchip>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-12">
          <q-field dense label="Status" stack-label borderless>
            <q-chip dense square
                    :color="getColorDependingOfStatus(this.userLndDto.lndStatus)"
                    style="margin-left: 0;"
                    class="text-subtitle2"
                    text-color="white">
              {{getLabelDependingOfStatus(this.userLndDto.lndStatus)}}
            </q-chip>
            <q-chip dense
                    v-if="getLndStatusCommentDependingOfStatus(this.userLndDto.lndStatus) !== ''"
                    square
                    outline
                    color="primary"
                    class="text-subtitle2"
                    text-color="white">
              {{getLndStatusCommentDependingOfStatus(this.userLndDto.lndStatus)}}
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-lightbulb-on"/>
            </template>
            <q-tooltip>
              Your LN Node working status.
            </q-tooltip>
          </q-field>
        </div>
      </div>
      <div class="row" v-if="userLndDto.hostedLndType">
        <div class="col-12">
          <q-field dense label="Type" stack-label borderless>
            <q-chip dense square color="primary" outline style="margin-left: 0;"
                    text-color="white" class="text-subtitle2">{{ this.userLndDto.hostedLndType }}</q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-order-bool-descending"/>
            </template>
            <q-tooltip>
              Your LN Node type.
            </q-tooltip>
          </q-field>
        </div>
      </div>
      <div class="row" v-if="!userLndDto.hostedLndType && userLndDto.lndType">
        <div class="col-12">
          <q-field dense label="Type" stack-label borderless>
            <q-chip dense square color="primary" outline style="margin-left: 0;"
                    text-color="white" class="text-subtitle2">{{ this.userLndDto.lndType }}</q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-order-bool-descending"/>
            </template>
            <q-tooltip>
              Your LN Node type.
            </q-tooltip>
          </q-field>
        </div>
      </div>

      <div class="row" v-show="this.userLndDto.rtlAddress">
        <div class="col-12">
          <q-input dense
            type="text"
            name="email"
            square
            onkeypress="return false;"
            v-model="this.userLndDto.rtlAddress"
            label="RTL address">
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-web"/>
            </template>
            <q-tooltip>
              Ride The Lightning is the LN Node management tool. Manage your node funds, channels and settings.
            </q-tooltip>
            <template v-slot:after>
              <q-btn
                flat
                color="primary"
                icon="mdi-arrow-right-bold-box-outline"
                @click="openRtl(userLndDto.rtlAddress)"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-show="this.userLndDto.rtlOneTimeInitPassword">
        <div class="col-12">
          <q-input dense
            :type="isPwd ? 'password' : 'text'"
            square
            onkeypress="return false;"
            v-model="this.userLndDto.rtlOneTimeInitPassword"
            label="RTL initital password">
            <q-tooltip>
              Unique initial password for logging to RTL. Change the password as soon as possible directly in RTL.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-lock"/>
            </template>
            <template v-slot:after>
              <q-btn
                flat
                color="primary"
                :icon="isPwd ? 'visibility_off' : 'visibility'"
                @click="isPwd = !isPwd"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row justify-end">
        <div class="col-auto justify-end">
          <q-field readonly borderless label="" stack-label v-if="userLndDto">
            <q-btn
              :label="userLndDto.lndStatus !== 'TURNED_OFF' ? 'RESTART': 'TURN ON'"
              color="primary"
              icon="mdi-restart"
              @click="showConfirmLndRestartPopup = !showConfirmLndRestartPopup"/>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-field readonly borderless label="" stack-label v-if="userLndDto && userLndDto.lndStatus === 'INIT_REQUIRED'">
            <q-btn
              :disable="userLndDto && !userLndDto.lndId"
              label="INITIALIZE LN WALLET"
              class="full-width"
              color="primary"
              icon="mdi-lock-open"
              @click="$router.push(`/ln/setup/${userLndDto.lndId}/init/wallet`)">
              <q-badge color="red" floating size>ACTION REQUIRED</q-badge>
            </q-btn>
          </q-field>
          <q-field readonly borderless label="" stack-label v-if="userLndDto && userLndDto.lndStatus === 'UNLOCK_REQUIRED'">
            <q-btn
              :disable="userLndDto && !userLndDto.lndId"
              label="UNLOCK LN NODE"
              class="full-width"
              color="primary"
              icon="mdi-lock-open"
              @click="unlockLndNode">
              <q-badge color="red" floating size>ACTION REQUIRED</q-badge>
            </q-btn>
          </q-field>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";
  import QrCode from 'components/utils/QrCode.vue';
  import { get, post } from 'src/api/http-service';
  import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
  import LndFormMixin from 'components/lnd/mixins/lnd-form-mixin';
  import QrCodePopup from 'components/utils/QrCodePopup.vue';
  import HeaderQchip from 'components/utils/HeaderQchip.vue';
  import ConfirmLndRestartPopup from 'components/lnd/ConfirmLndRestartPopup.vue';
  import Loader from 'components/utils/Loader.vue';
  import { sleep } from 'src/api/sleep-service';
  import ProvideMasterPasswordPopup from 'components/welcome/ProvideMasterPasswordPopup.vue';
  import { decryptSymmetricCtr } from 'src/api/encryption-service';
  import sha256 from 'js-sha256';
  import RtlInsecurePopup from 'components/lnd/RtlInsecurePopup.vue';

  export default GlobalMixin.extend({
    components: { RtlInsecurePopup, ProvideMasterPasswordPopup, QrCode, QrCodePopup, HeaderQchip, ConfirmLndRestartPopup, Loader },
    name: 'LndSummaryForm',
    mixins: [ LndFormMixin ],
    props: {
      userLndDto: {
        type: Object,
        required: true,
      },
    },
    data() {
      return {
        isPwd: true,
        showConfirmMasterPasswordPopup: false,
        requestLndButtonDisabled: false,
        showConfirmLndRestartPopup: false,
        showRtlInsecurePopup: false,
      };
    },
    computed: {
      isNotTurnedOff() {
        return this.userLndDto.lndStatus !== 'TURNED_OFF';
      },
    },
    methods: {
      openRtl(rtlUrl: string) {
        this.showRtlInsecurePopup = !this.showRtlInsecurePopup;
      },
      unlockLndNode() {
          this.showConfirmMasterPasswordPopup = !this.showConfirmMasterPasswordPopup;
      },
      onPasswordConfirmed(masterPassword: string) {
        this.showLoading = true;
        get(this.$axios, `/api/lnd/${this.userLndDto.lndId}/password`, async (res: any) => {
          await sleep(100);
          post(this.$axios, `/api/lnd/${this.userLndDto.lndId}/unlock`, { password: sha256(decryptSymmetricCtr(res.data.encryptedArtefact, masterPassword)) }, async (res: any) => {
            showNotificationInfo('LN Node successfully unlocked.', 'Your node is now ready to use.')
            await sleep(3000);
            this.showLoading = false;
            await sleep(100);
            this.$router.go('/ln/overview');
          }, async () => {
            showNotificationError('LN Node unlocking failed!', 'Unlocking node failed, probably because of wrong master password.');
            await sleep(100);
            this.showLoading = false;
          });

        }, async () => {
          showNotificationError('LN Node unlocking failed!', 'Unlocking node failed, some internal server error occurred.');
          await sleep(100);
          this.showLoading = false;
        });
      }
    },
  });

</script>
