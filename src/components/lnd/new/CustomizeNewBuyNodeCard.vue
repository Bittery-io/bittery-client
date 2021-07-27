<template>
  <div class="q-pa-xs">
    <loader :show="showLoading" message="Please wait and don't close the window. LN Node setup can take up to 5 minutes."></loader>
    <error-popup header="LND setup failed"
                 :error-message="errorBannerMessage"
                 :show="errorBannerMessage !== ''">
    </error-popup>
    <q-stepper
      :style="isMobile ? `` : `width: ${screenWidth * 0.45}px`"
      v-model="step"
      vertical
      bordered
      class="bg-grey-2 mobile-stepper-full"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Customize your Lightning Network Node"
        icon="info"
        class="text-center text-body1"
        :done="step > 1">
        <q-list>
          <q-item>
            <q-item-section>
                  <vue-form :state='lnAliasState' @submit.prevent="() => {}">
                    <validate>
                      <q-input
                        outlined
                        bg-color="accent"
                        type="string"
                        name="lnAlias"
                        ref="lnAlias"
                        square
                        :dense="isMobile"
                        counter
                        v-model="lnAlias"
                        hint="Friendly name of your Lightning Network visible for other network participants (OPTIONAL)"
                        label="LN Alias (by default random value will be generated)"
                        maxlength="32">
                        <template v-slot:prepend>
                          <q-icon color="primary" name="mdi-key"/>
                        </template>
                      </q-input>
                    </validate>
                  </vue-form>
            </q-item-section>
          </q-item>
          <q-item class="text-left" :class="isMobile ? 'q-pt-xl' : ''">
            <q-item-section avatar>
              <q-checkbox :value="statelessInitialization" />
            </q-item-section>
            <q-item-section>
              <q-item-label ><span :class="statelessBadgeStrike ? 'text-strike':''">Stateless initialization </span> <q-badge :color="statelessBadgeColor">Bittery Encrypted plan only</q-badge></q-item-label>
              <q-item-label caption>Bittery will not store plain macaroon files (only encrypted form)</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="text-left">
            <q-item-section avatar>
              <q-checkbox :value="rtl" />
            </q-item-section>
            <q-item-section>
              <q-item-label><span :class="rtlBadgeStrike ? 'text-strike':''">Personal RTL </span> <q-badge :color="rtlBadgeColor">Bittery Standard plan only</q-badge></q-item-label>
              <q-item-label caption>Ride The Lightning LN Node management tool access</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-stepper-navigation>
          <q-btn @click="setupNewLndNode" color="primary" icon="mdi-flash" label="Setup personal LN Node"
                 :class="isMobile ? 'full-width' : ''"/>
        </q-stepper-navigation>
      </q-step>
    </q-stepper>
  </div>
</template>

<script lang="ts">
import GlobalMixin from "../../../mixins/global-mixin";
import ErrorPopup from 'components/utils/ErrorPopup.vue';
import Loader from 'components/utils/Loader.vue';
import { post } from 'src/api/http-service';
import { CreateLndDto } from 'src/dto/lnd/create-lnd-dto';
import { HostedLndType } from 'src/dto/lnd/hosted-lnd-type';
import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';

export default GlobalMixin.extend({
  name: 'CustomizeNewBuyNodeCard',
  components: { ErrorPopup, Loader },
  data() {
    return {
      step: 1,
      lnAliasState: {},
      errorBannerMessage: '',
      statelessInitialization: false,
      rtl: false,
      lnAlias: '',
      statelessBadgeColor: 'primary',
      statelessBadgeStrike: false,
      rtlBadgeColor: 'primary',
      rtlBadgeStrike: false,
    };
  },
  mounted() {
    if (this.$route.params.lndType === 'ENCRYPTED') {
      this.statelessInitialization = true;
      this.rtlBadgeColor = 'red';
      this.rtlBadgeStrike = true;
    }
    if (this.$route.params.lndType === 'STANDARD') {
      this.rtl = true;
      this.statelessBadgeColor = 'red';
      this.statelessBadgeStrike = true;
    }
  },
  methods: {
    setupNewLndNode() {
      this.errorBannerMessage = '';
      this.showLoading = true;
      post(this.$axios, '/api/lnd', new CreateLndDto(<HostedLndType>this.$route.params.lndType, this.lnAlias), async () => {
        this.showLoading = false;
        await this.sleep(200); // small sleep required
        showNotificationInfo('LN Node setup succeed', 'Your personal Lightning Network Node is now online');
        await this.$router.push('/ln/overview');
      }, (err: any) => {
        showNotificationError('LN Node setup failed', 'Your personal Lightning Network Node is online');
        this.showLoading = false;
        console.log(err);
      });
    },
  },
});

</script>
