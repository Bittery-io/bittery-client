<template>
  <q-item :to="link" :disable="isDisabled" clickable active-class="bg-accent">
<!--      <q-badge color="red" floating size>-->
<!--        <q-icon name="bluetooth" color="white" />-->

<!--        22</q-badge>-->
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" size="md" color="primary"/>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
  import Vue from 'vue';

  export default Vue.extend({
    name: 'EssentialLink',
    props: {
      title: {
        type: String,
        required: true,
      },

      caption: {
        type: String,
        default: '',
      },

      link: {
        type: String,
        default: '#',
      },

      icon: {
        type: String,
        default: '',
      },

      active: {
        type: Boolean,
        required: true,
        default: false,
      },
      isDisabled: {
        type: Boolean,
        required: true,
        default: false,
      },
    }
  });
</script>
