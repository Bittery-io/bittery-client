<template>
  <q-page padding>
    <registration-confirmed-popup :show="confirmed"></registration-confirmed-popup>
    <loader :show="showLoading"></loader>
  </q-page>
</template>

<script lang="ts">
  import { post } from 'src/api/http-service';
  import GlobalMixin from "../../mixins/global-mixin";
  import { ConfirmRegistrationDto } from 'src/dto/confirm-registration-dto';
  import Loader from 'components/utils/Loader.vue';
  import RegistrationConfirmedPopup from 'components/register/RegistrationConfirmedPopup.vue';
  import { showNotificationError } from 'src/api/notificatios-api';

  export default GlobalMixin.extend({
    name: 'ConfirmRegistrationPage',
    components: { Loader, RegistrationConfirmedPopup },
    data() {
      return {
        confirmed: false,
      };
    },
    mounted() {
      this.showLoading = true;
      post(this.$axios, '/api/user/register/confirm',
        // @ts-ignore
        new ConfirmRegistrationDto(this.$route.query.email, this.$route.query.signUpKey), async () => {
        this.showLoading = false;
        this.confirmed = true;
      }, (err: any) => {
        this.showLoading = false;
        showNotificationError('Registration confirmation failed', 'The link is already invalid');
        this.$router.push('/login');
        console.log(err);
      });
    },
  });
</script>
