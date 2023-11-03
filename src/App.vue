<template>
  <div class="container">
    <VerbFormTable />
    <VerbFormTest />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VerbFormTable from './components/VerbFormTable.vue';
import VerbFormTest from './components/VerbFormTest.vue';

export default defineComponent({
  name: 'App',
  components: {
    VerbFormTable, VerbFormTest
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
