<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title>
          <a class="text-secondary" href="https://bittery.io">
            Bittery.io
          </a>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view/>
    </q-page-container>

    <q-footer class="bg-accent text-black text-center">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">
          2020 Bittery.io All rights reserved
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script lang="ts">
  import BitteryLogo from 'components/utils/BitteryLogo.vue';
  import LoginForm from 'components/login/LoginForm.vue';
  import RegisterForm from 'components/register/RegisterForm.vue';
  import GlobalMixin from "../mixins/global-mixin";

  export default GlobalMixin.extend({
    name: 'MainLayoutInformative',
    components: { BitteryLogo, LoginForm, RegisterForm },
  });
</script>
