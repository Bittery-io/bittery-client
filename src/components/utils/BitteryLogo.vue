<template>
  <q-img
    :src="path"
    style="width:150px; height:100%;"
  />
</template>

<script lang="ts">

  import GlobalMixin from 'src/mixins/global-mixin';

  export default GlobalMixin.extend({
    name: 'BitteryLogo',
    computed: {
      path() {
        return 'statics/bittery-glow.png';
        // return 'statics/Bittery.IO.png';
      },
    },
  });
</script>
