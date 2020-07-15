<template>
  <q-card class="grow shadow-15 bg-grey-2" @click="$router.push(route)" style="height: 100%;">
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
    },
  });
</script>
