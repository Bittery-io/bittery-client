<template>
  <q-page>
    <div class="fixed-center">
      <div class="row justify-center text-center items-center">
        <div class="col-auto">
          <q-card class="q-ma-md shadow-10 bg-grey-2">
            <q-card-section :class="{ 'q-pa-lg': !$q.platform.is.mobile }">
              <bittery-logo></bittery-logo>
              <div class="text-primary text-h6"
                   :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.8}px` : `width: ${screenWidth * 0.15}px`">
                Sign in to continue
              </div>
            </q-card-section>
            <q-card-section style="padding-top: 0; margin-top:0">
              <login-form></login-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
  import BitteryLogo from 'components/utils/BitteryLogo.vue';
  import LoginForm from 'components/login/LoginForm.vue';
  import RegisterForm from 'components/register/RegisterForm.vue';
  import { isLogged } from '../api/session-service';
  import GlobalMixin from "../mixins/global-mixin";

  export default GlobalMixin.extend({
    name: 'LoginPage',
    components: { BitteryLogo, LoginForm, RegisterForm },
    mounted() {
      this.pushToMainPathIfLogged();
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      window.addEventListener('storage', async () => {
        await this.pushToMainPathIfLogged();
      });
    },
    methods: {
      async pushToMainPathIfLogged() {
        if (isLogged() && this.$route.fullPath !== '/') {
          await this.$router.push('/');
        }
      },
    },
  });
</script>
