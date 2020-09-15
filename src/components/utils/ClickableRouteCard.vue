<template>
  <q-card class="grow shadow-15 bg-grey-2" @click="$router.push(route)" style="height: 100%;">
    <q-badge floating v-if="badgeText !== ''">
      <div class="text-subtitle2">
        <q-icon :name="badgeIcon" v-if="badgeIcon !== ''"/> {{badgeText}}</div>
    </q-badge>
    <q-card-section>
      <h5 class="text-center">{{text}}</h5>
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
