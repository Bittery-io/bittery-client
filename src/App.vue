<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  // import { checkSessionOnChangingRoute } from 'src/api/router-session-navigation-guard';
  import Vue from 'vue';
  import { setLoading, setVueRouter } from 'src/api/http-service';

  export default Vue.extend({
    name: 'App',
    mounted() {
      setVueRouter(this.$router);
      setLoading(this.$q.loading);
      // checkSessionOnChangingRoute(this.$router, this.$axios);
    },
  });
</script>
