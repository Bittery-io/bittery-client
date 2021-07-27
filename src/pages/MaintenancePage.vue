<template>
  <q-page>
    <div class="row justify-center text-center items-center" :style="`height:${screenHeight - 50}px`">
      <div class="col-auto">
        <q-card class="shadow-10 bg-grey-2" :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.9}px` : `width: ${screenWidth * 0.4}px`">
          <q-card-section :class="{ 'q-pa-lg': !$q.platform.is.mobile }">
            <q-img
              src="statics/maintenance.png"
              style="width:250px"
            />
            <div class="q-pt-md text-h3">
              Maintenance
            </div>
          </q-card-section>
          <q-card-section style="padding-top: 0; margin-top:0">
            <div class="text-h5">
              <b>Bittery.io</b> is currently under maintenance.<br>
              We will restore all services as soon as possible. <br>
              Find <b>more details</b> on our Twitter account. <br> <br>
              <q-btn color="blue-6" text-color="white" rounded @click="goToTwitter">
                <q-icon left name="mdi-twitter" />
                Go to Twitter
              </q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import GlobalMixin from "../mixins/global-mixin";
import { get } from 'src/api/http-service';

export default GlobalMixin.extend({
  name: 'MaintenancePage',
  mounted() {
    get(this.$axios, `/api/health`, async (res: any) => {
      await this.$router.push('/payments/overview');
    }, () => {
    });
  },
  methods: {
    goToTwitter() {
      window.open('https://twitter.com/bitteryio', '_blank');
    }
  }
});
</script>
