<template>
  <q-page>
    <div class="row items-center justify-center text-center" :style="`height:${screenHeight - 50}px`">
      <div class="col-auto">
        <div class="row">
          <div class="col-12">
            <div class="text-h2 text-center" style="margin-bottom: 0;">Setup your Bitcoin LN node
              <q-icon name="mdi-flash" color="yellow-7"/>
            </div>
            <div class="text-h5 text-center" style="margin-top: 0;">Please provide your personal Lightning Network node details</div>
          </div>
        </div>
        <div class="row justify-center">
          <div class="col-auto justify-center">
            <setup-existing-lnd-form></setup-existing-lnd-form>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import SetupExistingLndForm from 'components/lnd/SetupExistingLndForm.vue';

export default GlobalMixin.extend({
  name: 'SetupExistingLndPage',
  components: { SetupExistingLndForm },
  data() {
    return {
      step: 1,
    };
  },
});
</script>
