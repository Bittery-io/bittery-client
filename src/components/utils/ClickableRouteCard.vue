<template>
  <q-card class="grow shadow-15 bg-grey-2" @click="$router.push(route)" :style="`height: ${screenHeight * 0.2}px;`">
    <q-badge floating v-if="badgeText !== ''">
      <div class="text-subtitle2">
        <q-icon :name="badgeIcon" v-if="badgeIcon !== ''"/> {{badgeText}}</div>
    </q-badge>
    <q-card-section class="vertical-align">
      <div class="text-center text-h5">{{text}}</div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
  import GlobalMixin from "../../mixins/global-mixin";

  export default GlobalMixin.extend({
    name: 'ClickableRouteCard',
    props: {
      text: {
        type: String,
        required: true,
        default: '',
      },
      route: {
        type: String,
        required: true,
        default: '',
      },
      badgeText: {
        type: String,
        required: false,
        default: '',
      },
      badgeIcon: {
        type: String,
        required: false,
        default: '',
      },
    },
  });
</script>
