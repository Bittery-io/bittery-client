<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
    <loader :show="showLoading"></loader>
    <q-card>
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-key" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-h5 text-primary text-center">
              Confirm your <b>master password</b>
            </div>
            <div class="text-subtitle2 text-primary text-center">
              Remember: <span class="text-red">don't lose this password</span>
            </div>
            <q-input
              class="q-pt-md"
              outlined
              square
              bg-color="accent"
              name="password"
              ref="password"
              v-model="password"
              label="Master password"
              :type="isPwd ? 'password' : 'text'"
              required>
              <template v-slot:prepend>
                <q-icon color="primary" name="mdi-key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>
      <q-card-actions align="center" class="text-primary">
        <q-btn @click="unlockLnd" color="primary" :disable="password !== masterPassword">Confirm</q-btn>
        <q-btn outline @click="close()" text-color="primary">Close</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">
import { post } from 'src/api/http-service';
import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
import { sleep } from 'src/api/sleep-service';
import Loader from 'components/utils/Loader.vue';
import { SetupMasterPasswordDto } from 'src/dto/master-password/setup-master-password-dto';
import WelcomeMixin from '../../mixins/welcome-mixin';
import { setPasswordProof } from 'src/api/session-service';
import { calculatePasswordProof } from 'src/api/password-proof-service';

export default WelcomeMixin.extend({
  name: 'ConfirmSetupMasterPasswordPopup',
  components: { Loader },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    masterPassword: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isPwd: true,
      showPopup: false,
      password: '',
      unlockButtonDisabled: false,
    };
  },
  watch: {
    show() {
      this.showPopup = true;
    },
  },
  methods: {
    close() {
      this.password = '';
      this.showPopup = false;
    },
    async unlockLnd() {
      this.showLoading = true;
      await sleep(100);
      this.unlockButtonDisabled = true;
      const passwordProof: string = calculatePasswordProof(this.password);
      post(this.$axios, `/api/masterpassword`, new SetupMasterPasswordDto(passwordProof), async (res: any) => {
        this.unlockButtonDisabled = false;
        setPasswordProof(passwordProof);
        await sleep(1000);
        this.showLoading = false;
        await sleep(100);
        this.$emit('masterPasswordSet');
        this.showPopup = false;
      }, async () => {
        showNotificationError('Setting master password failed', 'Some unexpected error occurred');
        await sleep(100);
        this.showLoading = false;
        this.unlockButtonDisabled = false;
      });
    },
  },
});
</script>
