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
        title="Overview"
        icon="info"
        class="text-center text-body1"
        :done="step > 1">
          Bitcoin LN node is a single user dedicated service which allows <br> to send/receive
          Bitcoin payments using Lightning Network. <br>
        <span class="text-bold">Having LN node gives you the ability to utilize Lightning Network payments. </span><br>
          You will be able to use your LN node with external services like any LN crypto wallet.
        <q-stepper-navigation>
          <q-btn @click="setupNewLndNode" color="primary" icon="mdi-flash" label="Initialize new LND"/>
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

  export default GlobalMixin.extend({
    name: 'SetupNewLndForm',
    components: { ErrorPopup, Loader },
    data() {
      return {
        step: 1,
        errorBannerMessage: '',
      };
    },
    methods: {
      setupNewLndNode() {
        this.errorBannerMessage = '';
        this.showLoading = true;
        post(this.$axios, '/api/lnd', null, async () => {
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
