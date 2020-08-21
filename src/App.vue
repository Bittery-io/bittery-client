<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import { setLoading, setVueRouter } from 'src/api/http-service';
  import { setRouterNavguard } from 'src/api/router-navguard';

  export default Vue.extend({
    name: 'App',
    mounted() {
      console.log('BTCPAY url: ', process.env.BTCPAY_URL);
      setVueRouter(this.$router);
      setRouterNavguard(this.$router);
      setLoading(this.$q.loading);
    },
  });
</script>
