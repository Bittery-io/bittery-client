<template>
  <q-img
    :src="path"
    style="width:150px; height:100%;"
  />
</template>

<script lang="ts">

  import GlobalMixin from 'src/mixins/global-mixin';

  export default GlobalMixin.extend({
    name: 'BitterPayerLogo',
    props: {
      inverted: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
    computed: {
      path() {
        return this.inverted ? 'statics/BITTERY.svg' : 'statics/BITTERY.svg';
      },
    },
  });
</script>
