<template>
  <q-page padding>
    <div :class="{ 'fixed-center': !$q.platform.is.mobile }">
      <div class="row justify-center">
        <div class="col-lg-12">
          <h2 class="text-center" style="margin-bottom: 0;">Setup master password <q-icon name="mdi-key"/></h2>
          <h5 class="text-center" style="margin-top: 1%;">
            Let Bittery store your Bitcoin data <b>securely</b> encrypted.
          </h5>
        </div>
      </div>
      <div class="row justify-center">
        <div class="col-auto justify-center">
          <setup-master-password-form></setup-master-password-form>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import ClickableRouteCard from 'components/utils/ClickableRouteCard.vue';
import WelcomeMixin from '../../mixins/welcome-mixin';
import SetupMasterPasswordForm from 'components/welcome/SetupMasterPasswordForm.vue';

export default WelcomeMixin.extend({
  name: 'SetupMasterPasswordPage',
  components: { SetupMasterPasswordForm, ClickableRouteCard },
});
</script>
