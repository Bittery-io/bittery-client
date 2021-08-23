<template>
  <q-card class="shadow-10 bg-grey-2">
    <lnd-backup-popup :show="showLnBackupPopup" :lnd-id="lndId"></lnd-backup-popup>
    <q-card-section>
      <header-qchip text="LN Node Backups" icon="mdi-table-large"></header-qchip>
      <q-btn @click="showLnBackupPopup = !showLnBackupPopup"
             text-color="white"
             class="float-right"
             color="primary"
             icon="mdi-download"
             glossy
             label="Download latest LN Node backup"
              v-if="!isMobile && filteredData.length > 0">
      </q-btn>
      <q-chip square color="accent" size="md" class="text-subtitle2" icon="mdi-clock" text-color="primary" v-if="!isExpired"
      :style="isMobile ? 'height: 50px': ''">
        <countdown :time="millisecondsToNextBackup">
          <template slot-scope="props">Next scheduled backup: <br v-if="isMobile">
            {{ props.hours }} hours, {{ props.minutes }} minutes, {{ props.seconds }} seconds
          </template>
        </countdown>
      </q-chip>
    </q-card-section>
    <q-card-section style="padding-top: 0;margin-top:0;">
      <div class="row q-pb-lg q-pl-md">
        <div class="col-grow"></div>
        <div class="col-lg-auto col-xs-grow">
          <div class="q-pa-xs" :style="isMobile ? `` : 'width: 200px;height:100%;'" debounce="400">
            <q-select v-model="orderByDate" dense :options="orderByDateOptions" label="Order by date"/>
          </div>
        </div>
      </div>
      <q-table
        class="shadow-0"
        style=" background-color: transparent"
        dense
        :data="filteredData"
        :columns="columns"
        row-key="name">
        <template v-slot:body="props">
          <q-tr :props="props" >
            <q-td>
              <q-icon name="mdi-calendar" color="primary"/> {{ dateFormatOnly(props.row.creationDate) }}
              <q-icon name="mdi-clock" color="primary" /> {{ timeFormatOnly(props.row.creationDate) }}
            </q-td>
            <q-td>
              <q-chip dense square outline>
                <div class="text-subtitle2 text-uppercase">{{props.row.type.replaceAll('_', ' ')}}</div>
              </q-chip>
            </q-td>
            <q-td>
              <q-chip dense square class="float-right" :class="getClassDependingOfBackupStatus(props.row.status)">
                <div class="text-subtitle2 text-uppercase">{{getLabelDependingOfBackupStatus(props.row.status)}}</div>
              </q-chip>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <q-btn @click="showLnBackupPopup = !showLnBackupPopup"
             text-color="white"
             class="full-width"
             color="primary"
             icon="mdi-download"
             label="Download latest LN Node backup"
             glossy
             v-if="isMobile && filteredData.length > 0">
      </q-btn>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { formatOnlyDate, formatOnlyTime } from 'src/api/date-service';
import HeaderQchip from 'components/utils/HeaderQchip.vue';
import { get } from 'src/api/http-service';
import GlobalMixin from 'src/mixins/global-mixin';
import LndBackupPopup from 'components/lnd/backup/LndBackupPopup.vue';

export default GlobalMixin.extend({
  components: { LndBackupPopup, HeaderQchip },
  name: 'LndBackupTable',
  props: {
    lndId: {
      type: String,
      required: true,
    },
    isExpired: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      columns: [
        { label: 'Backup date', sortable: true, align: 'left' },
        { label: 'Type', align: 'left' },
        { label: 'Status', align: 'right' },
      ],
      filter: '',
      showLnBackupPopup: false,
      invoiceStatus: 'all',
      orderByDate: 'newest first',
      orderByDateOptions: ['newest first', 'oldest first'],
      data: [],
      filteredData: [],
      filterSavedData: [],
      millisecondsToNextBackup: null,
    };
  },
  mounted() {
    get(this.$axios, `/api/lnd/${this.lndId}/backup`, (res: any) => {
      this.showLoading = false;
      this.data = res.data.scbs;
      this.millisecondsToNextBackup = res.data.millisecondsToNextBackup;
      console.log(this.millisecondsToNextBackup);
      this.filteredData = res.data.scbs;
    }, async (err: any) => {
      console.log('Getting scb failed with err', err);
    });
  },
  methods: {
    getClassDependingOfBackupStatus(status: string) {
      switch (status) {
        case 'SUCCESS':
          return 'bg-primary text-white';
        case 'FAILURE':
        case 'FAILURE_NODE_LOCKED':
        case 'FAILURE_NO_MACAROON':
          return 'bg-red-8 text-white';
        default:
          return 'bg-primary text-white';
      }
    },
    getLabelDependingOfBackupStatus(status: string) {
      switch (status) {
        case 'SUCCESS':
          return 'SUCCESS';
        case 'FAILURE':
          return 'FAILURE';
        case 'FAILURE_NODE_LOCKED':
          return 'SKIPPED - NODE LOCKED';
        case 'FAILURE_NO_MACAROON':
          return 'SKIPPED - NO MACAROON';
        default:
          return status;
      }
    },
  },
});
</script>
