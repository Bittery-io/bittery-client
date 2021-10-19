<template>
  <q-card class="grow text-center shadow-10 bg-grey-2" @click="$router.push(`/ln/setup/new/customize/${type}`)">
    <q-card-section>
      <q-item>
        <q-item-section>
          <q-item-label>
            <div class="text-h5 text-bold">
              <q-icon name="mdi-flash" :color="type === 'ENCRYPTED' ? 'yellow-10': 'yellow-7'" size="xl"/>{{ title }}
            </div>
          </q-item-label>
          <q-item-label caption v-if="type === 'ENCRYPTED'">Enhanced security, limited tooling possibilities</q-item-label>
          <q-item-label caption v-if="type === 'STANDARD'">Node management tools (RTL) included</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
          <q-item-section>
            <q-item-label>
              <span class="text-h3" :id="type"></span>
              <span class="text-h5"> $</span>
            </q-item-label>
          <q-item-label caption>monthly, paid in Bitcoin only</q-item-label>
          </q-item-section>
      </q-item>
      <q-separator spaced inset/>
      <q-list>
        <q-item class="text-bold text-red-8">
          <q-item-section avatar>
            <q-icon color="red-8" name="mdi-flash-circle" style="animation-duration: 1s"
                    class="text-subtitle2 float-right animated infinite flash"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              3 days free trial
            </q-item-label>
            <q-item-label caption class="text-red-8">Try Bittery then use discounts for longer subscription plans or simply switch to Bittery free plan</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-flash-circle"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              Personal Lightning Network Node
            </q-item-label>
            <q-item-label caption>Public node, working in Mainnet network, backed by Bitcoin full node.</q-item-label>
          </q-item-section>
        </q-item>
        <q-item class="text-bold">
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-flash-circle"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              Bittery payments platform
            </q-item-label>
            <q-item-label caption>Use all Bittery features to accept Bitcoin payments (transactions and Lightning Network)</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-flash-circle"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              Lightning Network inbound channel
            </q-item-label>
            <q-item-label caption>Bittery will provide 0.01 BTC/month inbound Lightning channel to your node - you are ready to accept Lightning immediately</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-flash-circle"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              Backups and data exports
            </q-item-label>
            <q-item-label caption>Automated regular backups, client side encrypted artefacts (keys, seeds) storage.</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-flash-circle"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              TLS secured REST, GRPC API
            </q-item-label>
            <q-item-label caption>Connect to your node 24/7</q-item-label>
          </q-item-section>
        </q-item>
        <q-item :class="type === 'ENCRYPTED' ? 'text-strike': ''">
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-flash-circle"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              Personal RTL
            </q-item-label>
            <q-item-label caption>Ride The Lightning LN Node management tool access</q-item-label>
          </q-item-section>
        </q-item>
        <q-item :class="type === 'STANDARD' ? 'text-strike': ''">
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-flash-circle"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              Stateless initialization
            </q-item-label>
            <q-item-label caption>admin.macaroon is not stored anywhere. Bittery hosts only client side encrypted admin macaroons.</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-flash-circle"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              Lightning Labs LND implementation
            </q-item-label>
            <q-item-label caption>Current version: {{lndVersion}}. Regular updates provided.</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import GlobalMixin from "../../../mixins/global-mixin";
import ErrorPopup from 'components/utils/ErrorPopup.vue';
import Loader from 'components/utils/Loader.vue';
import { get, post } from 'src/api/http-service';
import { CountUp } from 'countup.js';
import { showNotificationError } from 'src/api/notificatios-api';

export default GlobalMixin.extend({
  name: 'SetupNewLndForm',
  components: { ErrorPopup, Loader },
  props: {
    title: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      step: 1,
      errorBannerMessage: '',
      lndVersion: '',
      lndPriceUsd: 0,
    };
  },
  mounted() {
    this.showLoading = true;
    get(this.$axios, '/api/utils/ln-buy-values', async (res: any) => {
      await this.sleep(200);
      this.lndVersion = res.data.lndVersion.trim();
      this.lndPriceUsd = res.data.lndPriceUsd;
      this.showLoading = false;
      const countUp1 = new CountUp(this.type, this.lndPriceUsd, {
        decimalPlaces: 2,
      });
      if (!countUp1.error) {
        countUp1.start();
      } else {
        console.error(countUp1.error);
      }
    }, async (err: any) => {
      showNotificationError('Fetching LND data failed', 'Unexpected server error occurred');
    });
  },
});

</script>
