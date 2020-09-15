<template>
  <q-item>
    <q-item-section avatar>
      <q-icon :color="iconColor" :name="icon" size="md"/>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-subtitle2">
        {{value}}
      </q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import QrCode from 'components/utils/QrCode.vue';
import HeaderQchip from 'components/utils/HeaderQchip.vue';
import { CountUp } from 'countup.js';

export default GlobalMixin.extend({
  components: { QrCode, HeaderQchip },
  name: 'StatisticItem',
  props: {
    value: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true,
    },
    iconColor: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  // async mounted() {
  //   await this.sleep(200); // small sleep required
  //   this.timeframeValue = this.timeframe;
  //   const countUp = new CountUp('totalReceivedPaymentsBtc', this.dashboardInfo.totalReceivedPaymentsBtc, {
  //     decimalPlaces: 3,
  //   });
  //   if (!countUp.error) {
  //     countUp.start();
  //   } else {
  //     console.error(countUp.error);
  //   }
  // },
});

</script>
