<template>
  <q-banner class="text-grey-2 text-bold bg-red-8 q-mb-xs">
    <template v-slot:avatar>
      <q-icon name="error" color="white"
              :class="iconFlash ? 'animated infinite flash' : ''"
              :style="iconFlash ? 'animation-duration: 1s' : ''"

      />
    </template>
    <div class="text-subtitle2">
      {{text}}
    </div>
  </q-banner>
</template>
<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import ErrorPopup from 'components/utils/ErrorPopup.vue';
import Loader from 'components/utils/Loader.vue';
import { post } from 'src/api/http-service';
import { generateBitcoinWallet } from 'src/api/bitcoin-wallet-service';
import { CreateUserBtcpayDto } from 'src/dto/create-user-btcpay-dto';
import { showNotificationInfo } from 'src/api/notificatios-api';
import { BitcoinWallet } from 'src/model/bitcoin-wallet';

export default GlobalMixin.extend({
  name: 'WarningInfoBanner',
  components: { ErrorPopup, Loader },
  props: {
    text: {
      type: String,
      required: false,
      default: false,
    },
    iconFlash: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
});

</script>
