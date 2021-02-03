<template>
  <q-card class="shadow-10 bg-grey-2" v-if="this.lndInfo">
    <q-card-section>
      <header-qchip text="LND Details" icon="mdi-book-open"></header-qchip>
    </q-card-section>
    <q-card-section>
      <div class="row">
        <div class="col-12">
          <q-input dense
            type="text"
            onkeypress="return false;"
            square
            :value="this.lndInfo.publicKey"
            label="Public key">
            <q-tooltip>
              The public address of your personal LN node.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-card-bulleted"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row" v-if="this.lndInfo.alias">
        <div class="col-12">
          <q-input dense
            type="text"
            onkeypress="return false;"
            square
            :value="this.lndInfo.alias"
            label="Alias">
            <q-tooltip>
              The public address of your personal LN node.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px" color="primary" name="mdi-card-bulleted-outline"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-field dense label="Chain synced" stack-label borderless>
            <q-chip dense :color="getColorDependingOfBooleanStatus(this.lndInfo.syncedToChain)" style="margin-left: 0;"
                    square text-color="white">
              {{this.lndInfo.syncedToChain.toString().toUpperCase()}}
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-toggle-switch"/>
            </template>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-field dense label="Graph synced" stack-label borderless>
            <q-chip dense square :color="getColorDependingOfBooleanStatus(this.lndInfo.syncedToGraph)" style="margin-left: 0;"
                    text-color="white">
              {{this.lndInfo.syncedToGraph.toString().toUpperCase()}}
            </q-chip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-set-right"/>
            </template>
          </q-field>
        </div>
      </div>
      <div class="row">
        <div class="col-3">
          <q-input dense
            type="text"
            onkeypress="return false;"
            square
            :value="this.lndInfo.numPeers"
            label="Connected peers">
            <q-tooltip>
              The public address of your personal LN node.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-lan"/>
            </template>
          </q-input>
        </div>
        <div class="col-3">
          <q-input dense
                   type="text"
                   onkeypress="return false;"
                   square
                   :value="this.lndInfo.numActiveChannels"
                   label="Active channels">
            <q-tooltip>
              The public address of your personal LN node.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px" color="primary" name="mdi-lan-connect"/>
            </template>
          </q-input>
        </div>
        <div class="col-3">
          <q-input dense
                   type="text"
                   onkeypress="return false;"
                   square
                   :value="this.lndInfo.numInactiveChannels"
                   label="Inactive channels">
            <q-tooltip>
              The public address of your personal LN node.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px" color="primary" name="mdi-lan-disconnect"/>
            </template>
          </q-input>
        </div>
        <div class="col-3">
          <q-input dense
                   type="text"
                   onkeypress="return false;"
                   square
                   :value="this.lndInfo.numPendingChannels"
                   label="Pending channels">
            <q-tooltip>
              The public address of your personal LN node.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px" color="primary" name="mdi-lan-pending"/>
            </template>
          </q-input>
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <q-input dense
            type="text"
            onkeypress="return false;"
            square
            :value="this.lndInfo.version"
            label="Version">
            <q-tooltip>
              The public address of your personal LN node.
            </q-tooltip>
            <template v-slot:before>
              <q-icon style="width:50px;" color="primary" name="mdi-information-outline"/>
            </template>
          </q-input>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import GlobalMixin from "../../mixins/global-mixin";
import LndFormMixin from 'components/lnd/mixins/lnd-form-mixin';
import HeaderQchip from 'components/utils/HeaderQchip.vue';

export default GlobalMixin.extend({
  components: { HeaderQchip },
  name: 'LndDetailsForm',
  mixins: [ LndFormMixin ],
  props: {
    lndInfo: {
      type: Object,
      required: true,
    },
  },
});

</script>
