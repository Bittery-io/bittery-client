<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
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
        <div class="row justify-center q-pt-md">
          <div class="col-auto text-primary q-pa-xs">
            <q-btn outlined @click="unlockLnd" color="primary">Unlock</q-btn>
          </div>
          <div class="col-auto text-primary q-pa-xs">
            <q-btn outlined @click="close()" color="primary">Close</q-btn>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<style>
</style>

<script lang="ts">
import Vue from 'vue';
import { post } from 'src/api/http-service';
import { showNotificationError, showNotificationInfo } from 'src/api/notificatios-api';
export default Vue.extend({
  name: 'UnlockLndPopup',
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
    unlockLnd() {
      post(this.$axios, `/api/lnd/${this.lndId}/unlock`, { password: this.password }, (res: any) => {
        this.requestLndButtonDisabled = true;
        showNotificationInfo('LND successfully unlocked.', 'LND is now ready to use.')
        this.close();
      }, () => {
        this.requestLndButtonDisabled = true;
        showNotificationError('LND unlocking failed!', 'Unlocking LND failed, probably because of wrong password.');
      })
    },
  },
});
</script>
