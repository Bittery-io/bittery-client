<template>
  <div class="q-pa-xs">
    <loader :show="showLoading"></loader>
    <error-popup header="LND setup failed"
                 :error-message="errorBannerMessage"
                 :show="errorBannerMessage !== ''">
    </error-popup>
    <q-stepper
      :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.93}px` : `width: ${screenWidth * 0.35}px`"
      v-model="step"
      vertical
      bordered
      class="bg-grey-2"
      color="primary"
      animated
    >
      <q-step
        :name="1"
        title="Customize your Lightning Network node (OPTIONAL)"
        icon="info"
        class="text-center text-subtitle1"
        :done="step > 1">

        <q-list>
          <q-item>
            <q-item-section avatar>
            </q-item-section>
            <q-item-section>
              <q-input
                type="text"
                counter
                maxlength="32"
                square
                v-model="lnAlias"
                hint="Friendly name of your Lightning Network visible for other network participants"
                label="LN Alias (default blank)"></q-input>
            </q-item-section>
          </q-item>
          <q-item tag="label" class="q-pa-md text-left">
            <q-item-section avatar>
              <q-checkbox v-model="wumboChannels" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Wumbo channels</q-item-label>
              <q-item-label caption>Enable Lightning Network payments channel up to 5 BTC</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="text-left">
            <q-item-section avatar>
              <q-checkbox v-model="statelessInitialization" disable />
            </q-item-section>
            <q-item-section>
              <q-item-label>Stateless initialization <q-badge color="grey-10">Encrypted Lightning Node only</q-badge></q-item-label>
              <q-item-label caption>Bittery will not store plain macaroon files (only encrypted)</q-item-label>
            </q-item-section>
          </q-item>
          <q-item class="text-left">
            <q-item-section avatar>
              <q-checkbox v-model="rtl" disable />
            </q-item-section>
            <q-item-section>
              <q-item-label>Personal RTL  <q-badge color="grey-10">Standard Lightning Node only</q-badge></q-item-label>
              <q-item-label caption>Ride The Lightning LND management tool access</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <q-stepper-navigation>
          <q-btn @click="setupNewLndNode" color="primary" icon="mdi-flash" label="Start new LND"/>
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

export default GlobalMixin.extend({
  name: 'CustomizeNewBuyNodeCard',
  components: { ErrorPopup, Loader },
  data() {
    return {
      step: 1,
      errorBannerMessage: '',
      wumboChannels: false,
      statelessInitialization: false,
      rtl: false,
      lnAlias: '',
    };
  },
  mounted() {
    if (this.$route.params.lndType === 'ENCRYPTED') {
      this.statelessInitialization = true;
    }
    if (this.$route.params.lndType === 'STANDARD') {
      this.rtl = true;
    }
  },
  methods: {
    setupNewLndNode() {
      this.errorBannerMessage = '';
      this.showLoading = true;
      post(this.$axios, '/api/lnd', new CreateLndDto(
        this.wumboChannels, <HostedLndType>this.$route.params.lndType, this.lnAlias
      ), async () => {
        this.showLoading = false;
        await this.sleep(200); // small sleep required
        await this.$router.push('/bitcoin/overview');
      }, (err: any) => {
        this.showLoading = false;
        this.errorBannerMessage = 'LND setup failed. Please try again later';
        console.log(err);
      });
    },
  },
});

</script>
