<template>
  <q-layout view="lHh Lpr lFf">
    <loader :show="showLoading"></loader>
    <mainnet-popup :show="showMainnetPopup"></mainnet-popup>
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
            <bittery-logo></bittery-logo>
          </router-link>
          <q-chip color="lime-4" text-color="primary" square class="text-bold"
                  icon="mdi-bitcoin" size="md" clickable @click="showPopup">Mainnet
          </q-chip>
        </q-toolbar-title>

<!--        <q-toolbar-title class="text-bold text-right" v-if="!$q.platform.is.mobile">-->
<!--          <q-chip clickable color="accent" text-color="primary"-->
<!--                  @click="openUrlTheSameTab('https://bittery.io')"-->
<!--                  outline icon="mdi-home-circle" size="md">HOMEPAGE</q-chip>-->
<!--        </q-toolbar-title>-->
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="270"
      content-class="bg-grey-2"
    >
      <q-list class="main-side-menu">
        <q-item-label
          header
          class="text-grey-8 text-bold"
        >
          Your features
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          :is-disabled="link.disabled"
          :active="isActive(link)"
        />
        <q-item clickable active-class="bg-accent" @click="openUrlTheSameTab('https://bittery.io')" v-if="$q.platform.is.mobile">
          <q-item-section avatar>
            <q-icon name="mdi-home-circle" size="md"/>
          </q-item-section>

          <q-item-section>
            <q-item-label>Homepage</q-item-label>
            <q-item-label caption>
              Bittery.io homepage
            </q-item-label>
          </q-item-section>
        </q-item>
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
  import { hasPasswordProofSet } from '../api/session-service';
  import MainnetPopup from '../components/MainnetPopup';

  export default GlobalMixin.extend({
    name: 'MainLayout',

    components: {
      MainnetPopup,
      EssentialLink, LoginMenuButton, BitteryLogo, Loader
    },
    methods: {
      isActive(essentialLink) {
        return this.$route.fullPath === essentialLink.link;
      },
      showPopup() {
        this.showMainnetPopup = !this.showMainnetPopup;
      }
    },
    mounted() {
      console.log(hasPasswordProofSet());
    },
    data() {
      return {
        showLoading: false,
        showMainnetPopup: false,
        leftDrawerOpen: false,
        essentialLinks: [
          {
            title: 'Payments',
            caption: 'Manage your Bitcoin payments',
            icon: 'mdi-contactless-payment-circle',
            link: '/payments/overview',
            active: false,
            disabled: !hasPasswordProofSet(),
          },
          {
            title: 'Dashboard',
            caption: 'Browse your payments details',
            icon: 'mdi-desktop-mac-dashboard',
            link: '/dashboard',
            active: false,
            disabled: !hasPasswordProofSet(),
          },
          {
            title: 'Lightning Network',
            caption: 'Manage your LN',
            icon: 'mdi-flash',
            link: '/ln/overview',
            active: true,
            disabled: !hasPasswordProofSet(),
          },
          {
            title: 'Account',
            caption: 'Your account details',
            icon: 'mdi-account-box-outline',
            link: '/account',
            active: false,
            disabled: false,
          }
        ],
      };
    },
  });
</script>
