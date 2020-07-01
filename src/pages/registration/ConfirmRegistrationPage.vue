<template>
  <q-layout view="hHh lpR fFf" >
    <registration-confirmed-popup :show="confirmed"></registration-confirmed-popup>
    <loader :show="showLoading"></loader>
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="text-secondary">
          Bittery.io
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
    </q-page-container>

    <q-footer elevated class="bg-grey-1 text-black text-center">
      <q-toolbar>
        <q-toolbar-title class="text-subtitle2">
          2020 All rights reserved
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script lang="ts">
  import { post } from 'src/api/http-service';
  import GlobalMixin from "../../mixins/global-mixin";
  import { ConfirmRegistrationDto } from 'src/dto/confirm-registration-dto';
  import Loader from 'components/utils/Loader.vue';
  import RegistrationConfirmedPopup from 'components/register/RegistrationConfirmedPopup.vue';

  export default GlobalMixin.extend({
    name: 'ConfirmRegistrationPage',
    components: { Loader, RegistrationConfirmedPopup },
    data() {
      return {
        confirmed: false,
      };
    },
    mounted() {
      console.log(this.$route, this.$route.params.signUpKey);
      this.showLoading = true;
      post(this.$axios, '/api/user/register/confirm',
        // @ts-ignore
        new ConfirmRegistrationDto(this.$route.query.email, this.$route.query.signUpKey), async () => {
        this.showLoading = false;
        this.confirmed = true;
        // await this.$router.push('/bitcoin/login');
      }, (err: any) => {
        this.showLoading = false;
        this.errorBannerMessage = 'Registration confirmation failed';
        console.log(err);
      });
    },
  });
</script>
