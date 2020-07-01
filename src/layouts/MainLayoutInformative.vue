<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-secondary">
          Bittery.io
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer elevated class="bg-grey-1 text-black text-center">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">
          2020 Bittery.io All rights reserved
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script lang="ts">
  import BitterPayerLogo from 'components/utils/BitterPayerLogo.vue';
  import LoginForm from 'components/login/LoginForm.vue';
  import RegisterForm from 'components/register/RegisterForm.vue';
  import { isLogged } from '../api/session-service';
  import GlobalMixin from "../mixins/global-mixin";

  export default GlobalMixin.extend({
    name: 'MainLayoutInformative',
    components: { BitterPayerLogo, LoginForm, RegisterForm },
  });
</script>
