<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
    <loader :show="showLoading"></loader>
    <q-card>
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-qrcode" color="primary"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-h5 text-primary text-center">
              Unlock LND
            </div>
            <q-input
              outlined
              square
              bg-color="accent"
              name="password"
              ref="password"
              v-model="password"
              label="LN Password"
              :type="isPwd ? 'password' : 'text'"
              required>
              <template v-slot:prepend>
                <q-icon color="primary" name="mdi-lock"/>
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
        <q-btn @click="unlockLnd" color="primary" :disable="unlockButtonDisabled">Unlock</q-btn>
        <q-btn outline @click="close()" text-color="primary">Close</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">
import Vue from 'vue';
import { post } from 'src/api/http-service';
import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
import { sleep } from 'src/api/sleep-service';
import Loader from 'components/utils/Loader.vue';

export default Vue.extend({
  name: 'UnlockLndPopup',
  components: { Loader },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    lndId: {
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
      this.showPopup = false;
    },
    async unlockLnd() {
      this.showLoading = true;
      await sleep(100);
      this.unlockButtonDisabled = true;
      post(this.$axios, `/api/lnd/${this.lndId}/unlock`, { password: this.password }, async (res: any) => {
        this.unlockButtonDisabled = false;
        showNotificationInfo('LND successfully unlocked.', 'LND is now ready to use.')
        await sleep(3000);
        this.showLoading = false;
        await sleep(100);
        this.$router.go('/bitcoin/overview');
      }, async () => {
        showNotificationError('LND unlocking failed!', 'Unlocking LND failed, probably because of wrong password.');
        await sleep(100);
        this.showLoading = false;
        this.unlockButtonDisabled = false;
      })
    },
  },
});
</script>
