<template>
  <q-chip color="accent" :size="size" :icon="icon" text-color="primary" :class="size === 'md' ? 'text-subtitle2': ''" square v-if="icon">
    {{text}}
  </q-chip>
  <q-chip color="accent" :size="size" square text-color="primary" :class="size === 'md' ? 'text-subtitle2': ''" v-else>
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
      size: {
        type: String,
        required: false,
        default: 'xl',
      }
    },
  });
</script>
