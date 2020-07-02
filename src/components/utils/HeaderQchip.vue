<template>
  <q-chip color="accent" size="xl" :icon="icon"
          text-color="black" v-if="icon">
    {{text}}
  </q-chip>
  <q-chip color="accent" size="xl" square
          text-color="primary" class="shadow-3" v-else>
    {{text}}
  </q-chip>
</template>

<script lang="ts">

  import GlobalMixin from 'src/mixins/global-mixin';

  export default GlobalMixin.extend({
    name: 'HeaderQchip',
    props: {
      text: {
        type: String,
        required: false,
        default: '',
      },
      icon: {
        type: String,
        required: false,
      },
    },
  });
</script>
