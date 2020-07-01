<template>
  <q-page class="row items-center justify-evenly">
  </q-page>
</template>

<script lang="ts">
  import GlobalMixin from "../mixins/global-mixin";
  import ExampleComponent from 'components/CompositionComponent.vue';

  export default GlobalMixin.extend({
    name: 'PageIndex',
    components: { ExampleComponent },
    data() {
    },
  });
</script>
