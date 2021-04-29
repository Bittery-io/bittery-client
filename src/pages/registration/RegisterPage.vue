<template>
  <q-page>
    <div class="row items-center justify-center" :style="`height:${screenHeight - 50}px`">
      <div class="col-auto">
          <div class="row justify-center text-center items-center">
            <div class="col-auto q-pa-xs">
              <q-card class="shadow-10 bg-grey-2" :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.9}px` : `width: ${screenWidth * 0.2}px`">
                <q-card-section :class="{ 'q-pa-lg': !$q.platform.is.mobile }">
                  <bittery-logo-animated></bittery-logo-animated>
                  <div class="text-primary q-pt-md text-h5 ">
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
    </div>
  </q-page>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import BitteryLogoAnimated from 'components/utils/BitteryLogoAnimated.vue';
import RegisterForm from 'components/register/RegisterForm.vue';

export default GlobalMixin.extend({
  name: 'RegisterPage',
  components: { BitteryLogoAnimated, RegisterForm },
});
</script>
