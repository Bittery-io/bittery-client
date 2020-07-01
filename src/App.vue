<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  import { checkSessionOnChangingRoute } from 'src/api/router-session-navigation-guard';
  import Vue from 'vue';

  export default Vue.extend({
    name: 'App',
    mounted() {
      checkSessionOnChangingRoute(this.$router, this.$axios);
    },
  });
</script>
