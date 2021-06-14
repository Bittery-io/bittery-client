<template>
  <q-page>
    <div class="row items-center justify-center" :style="`height:${screenHeight - 50}px`">
      <div class="col-auto">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center" :class="isMobile ? 'text-h3' : 'text-h2'">Setup master password
              <q-icon name="mdi-key"/>
            </div>
            <div class="text-center text-h5">
              Let Bittery store your Bitcoin data <b>securely</b> encrypted.
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-12 justify-center">
            <setup-master-password-form></setup-master-password-form>
          </div>
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
