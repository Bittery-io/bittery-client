<template>
  <q-dialog persistent v-model="showPopup" v-if="showPopup" @hide="showPopup=false">
    <q-card :style="$q.platform.is.mobile ? `width: ${screenWidth * 0.8}px` : `width: ${screenWidth * 0.15}px`">
      <q-card-section>
        <div class="row justify-center">
          <div class="col-auto text-primary">
            <q-icon size="xl" name="mdi-shield-alert" color="red"/>
          </div>
        </div>
        <div class="row justify-center q-pt-xs">
          <div class="col-auto items-center">
            <div class="text-h5 text-primary text-center">
              {{header}}
            </div>
            <div class="text-primary text-center text-bold">
              {{errorMessage}}
            </div>
          </div>
        </div>
        <div class="row justify-center q-pt-md">
          <div class="col-auto text-primary">
            <q-btn outlined @click="close()" color="red">Close</q-btn>
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

  export default Vue.extend({
    name: 'ErrorPopup',
    components: {},
    props: {
      show: {
        type: Boolean,
        required: true,
      },
      header: {
        type: String,
        required: false,
        default: '',
      },
      errorMessage: {
        type: String,
        required: false,
        default: '',
      },
    },
    data() {
      return {
        showPopup: false,
      };
    },
    watch: {
      show() {
        this.showPopup = this.show;
      },
    },
    methods: {
      close() {
        this.showPopup = false;
      },
    },
  });
</script>
