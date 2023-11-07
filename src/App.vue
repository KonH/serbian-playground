<template>
  <div class="container">
    <div class="d-flex flex-column align-items-center" v-if="inMenu">
      <b-button @click="openVerbTable" variant="primary" class="mb-3">Biti verb forms table</b-button>
      <b-button @click="openVerbTest" variant="danger">Biti verb forms test</b-button>
    </div>
    <div v-if="inVerbFormTable" class="d-flex flex-column align-items-center">
      <b-button @click="backToMenu" variant="secondary" class="mb-3">Back</b-button>
      <VerbFormTable />
    </div>
    <div v-if="inVerbFormTest" class="d-flex flex-column align-items-center">
      <b-button @click="backToMenu" variant="secondary" class="mb-3">Back</b-button>
      <VerbFormTest />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VerbFormTable from './components/VerbFormTable.vue';
import VerbFormTest from './components/VerbFormTest.vue';

type State = 'menu' | 'verb-form-table' | 'verb-form-test';

export default defineComponent({
  name: 'App',
  data: () => {
    return {
      state: 'menu' as State
    }
  },
  computed: {
    inMenu() {
      return this.state == 'menu';
    },

    inVerbFormTable() {
      return this.state == 'verb-form-table';
    },

    inVerbFormTest() {
      return this.state == 'verb-form-test';
    }
  },
  methods: {
    openVerbTable() {
      this.state = 'verb-form-table';
    },

    openVerbTest() {
      this.state = 'verb-form-test';
    },
    
    backToMenu() {
      this.state = 'menu';
    }
  },
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
