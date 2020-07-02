<template>
  <q-layout view="lHh Lpr lFf">
    <loader :show="showLoading"></loader>
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />

        <q-toolbar-title class="text-secondary">
          <router-link to="/payments/overview">
            <bittery-logo style="width:100px; height:100%;"></bittery-logo>
          </router-link>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      content-class="bg-grey-2"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Your services
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :active="isActive(link)"
        />
      </q-list>
      <login-menu-button class="absolute-bottom"></login-menu-button>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>

  </q-layout>
</template>

<script class="ts">
  import EssentialLink from 'components/EssentialLink';
  import GlobalMixin from '../mixins/global-mixin';
  import LoginMenuButton from '../components/login/LoginMenuButton';
  import BitteryLogo from '../components/utils/BitteryLogo';
  import Loader from '../components/utils/Loader';

  export default GlobalMixin.extend({
    name: 'MainLayout',

    components: {
      EssentialLink, LoginMenuButton, BitteryLogo, Loader
    },
    methods: {
      isActive(essentialLink) {
        return this.$route.fullPath === essentialLink.link;
      },
    },
    data() {
      return {
        showLoading: false,
        leftDrawerOpen: false,
        essentialLinks: [
          {
            title: 'Services',
            caption: 'Configure your Bitcoin services',
            icon: 'ion-logo-bitcoin',
            link: '/bitcoin/overview',
            active: true,
          },
          {
            title: 'Payments',
            caption: 'Manage your cryptocurrency payments',
            icon: 'mdi-contactless-payment',
            link: '/payments/overview',
            active: false,
          },
        ],
      };
    },
  });
</script>
