<template>
  <q-page>
    <div class="fixed-center">
      <div class="row justify-center text-center items-center">
        <div class="col-auto">
          <q-card class="shadow-10 bg-grey-2" >
            <q-card-section :class="{ 'q-pa-lg': !$q.platform.is.mobile }">
              <bittery-logo></bittery-logo>
              <div class="text-primary q-pt-md text-h5 "
                   :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.8}px` : `width: ${screenWidth * 0.18}px`">
                Create your account
              </div>
            </q-card-section>
            <q-card-section style="padding-top: 0; margin-top:0">
              <register-form></register-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import { isLogged } from 'src/api/session-service';
  import GlobalMixin from "../../mixins/global-mixin";
  import BitteryLogo from 'components/utils/BitteryLogo.vue';
  import RegisterForm from 'components/register/RegisterForm.vue';

  export default GlobalMixin.extend({
    name: 'RegisterPage',
    components: { BitteryLogo, RegisterForm },
    mounted() {
      if (isLogged()) {
        this.$router.push('/');
      }
    },
  });
</script>
