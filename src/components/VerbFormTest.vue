<template>
<table class="test-table table table-bordered">
  <thead>
    <tr>
      <th colspan="2">Ja?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b-button :variant="buttonVariant" :class="{ 'btn-success': isRight }" @click="onrightclick">sam</b-button></td>
      <td><b-button variant="info">smo</b-button></td>
    </tr>
    <tr>
      <td><b-button variant="info">si</b-button></td>
      <td><b-button variant="info">su</b-button></td>
    </tr>
  </tbody>
</table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'VerbFormTest',
  data() {
    return {
      isRight: false,
      isWrong: false
    }
  },
  computed: {
    buttonVariant() {
      return this.isRight ? 'success' : 'info';
    }
  },
  methods: {
    onrightclick() {
      console.log('right');
      this.isRight = true;
    },
    onwrongclick() {
      this.isWrong = true;
    }
  }
});
</script>

<style scoped>
.test-table {
  max-width: 600px;
}
</style>