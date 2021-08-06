<template>
    <div class="row justify-center q-pa-md">
    <div class="col-auto justify-center">
      <q-btn glossy icon="mdi-logout" color="accent" text-color="primary" size="md" @click="logout">SIGN OUT</q-btn>
    </div>
  </div>
</template>
<script lang="ts">
  import GlobalMixin from 'src/mixins/global-mixin';
  import { cleanSessionInStorage } from 'src/api/session-service';
  import { showNotificationInfo } from 'src/api/notificatios-api';

  export default GlobalMixin.extend({
    name: 'LoginMenuButton',
    data() {
      return {
        isLogged: false,
      };
    },
    methods: {
      logout() {
        cleanSessionInStorage();
        showNotificationInfo('User logout. Goodbye.');
        this.$router.push('/login');
      },
    },
  });
</script>

<style>
</style>
