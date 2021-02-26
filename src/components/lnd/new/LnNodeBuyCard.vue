<template>
  <q-card class="grow shadow-10 bg-grey-2" @click="$router.push(`/lnd/setup/new/customize/${type}`)">
    <q-card-section>
      <q-item>
        <q-item-section>
          <q-item-label>
            <q-icon name="mdi-flash" color="yellow-7" size="xl"/>
            <div class="text-h5">{{ title }}</div>
          </q-item-label>
          <q-item-label caption v-if="type === 'ENCRYPTED'">Best privacy but no tools included</q-item-label>
          <q-item-label caption v-if="type === 'STANDARD'">Tools included</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
          <q-item-section>
            <q-item-label>
              <span class="text-h2" :id="type"></span>
              <span class="text-h4"> $</span>
            </q-item-label>
          <q-item-label caption>monthly</q-item-label>
          </q-item-section>
      </q-item>
      <q-separator spaced inset />
      <q-list class="">
        <q-item >
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-flash-circle"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              Personal Lightning Network Node
            </q-item-label>
            <q-item-label caption>Bitcoin Mainnet network</q-item-label>
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
            <q-item-label caption>Regular backups for enhanced security</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar>
            <q-icon color="primary" name="mdi-flash-circle"/>
          </q-item-section>
          <q-item-section class="text-left">
            <q-item-label>
              Bitcoin full node connection
            </q-item-label>
            <q-item-label caption>Connected to Bittery backed Bitcoin full node</q-item-label>
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
            <q-item-label caption>LN node does not store admin macaroon file. Bittery hosts only client side encrypted admin macaroons.</q-item-label>
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
            <q-item-label caption>https://github.com/lightningnetwork/lnd</q-item-label>
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
import { post } from 'src/api/http-service';
import { CountUp } from 'countup.js';

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
    };
  },
  mounted() {
    const countUp1 = new CountUp(this.type, 10, {
      decimalPlaces: 0,
    });
    if (!countUp1.error) {
      countUp1.start();
    } else {
      console.error(countUp1.error);
    }
  },
});

</script>
