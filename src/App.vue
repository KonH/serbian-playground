<template>
  <div class="wrapper">
    <div class="container content">
      <div class="d-flex flex-column align-items-center" v-if="inMenu">
        <b-button @click="openVerbTable" variant="primary" class="mb-3">Biti verb forms table</b-button>
        <b-button @click="openVerbTest" variant="danger" class="mb-3">Biti verb forms test</b-button>
        <b-button @click="openInvertVerbTest" variant="danger">Biti verb forms test (invert)</b-button>
      </div>
      <div v-if="inVerbFormTable" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">Back</b-button>
        <VerbFormTable />
      </div>
      <div v-if="inVerbFormTest" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">Back</b-button>
        <TestForm :mapping="verbFormMapping" />
      </div>
      <div v-if="inInvertVerbFormTest" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">Back</b-button>
        <TestForm :mapping="invertVerbFormMapping" />
      </div>
    </div>
    <footer class="footer">
      Version: 0.2
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VerbFormTable from './components/VerbFormTable.vue';
import TestForm from './components/TestForm.vue';

type State = 'menu' | 'verb-form-table' | 'verb-form-test' | 'invert-verb-form-test';

const bitiForms: Record<string, string[]> = {
  'ja': [
    'sam'
  ],
  'ti': [
    'si'
  ],
  'on': [
    'je'
  ],
  'ona (ed)': [
    'je'
  ],
  'ono': [
    'je'
  ],
  'mi': [
    'smo'
  ],
  'vi': [
    'ste'
  ],
  'oni': [
    'su'
  ],
  'one': [
    'su'
  ],
  'ona (mn)': [
    'su'
  ]
};

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
    },

    inInvertVerbFormTest() {
      return this.state == 'invert-verb-form-test';
    },

    verbFormMapping() {
      return bitiForms;
    },

    invertVerbFormMapping() {
      const invertMapping: Record<string, string[]> = {};
      for (const [key, values] of Object.entries(bitiForms)) {
        values.forEach(value => {
          if (!invertMapping[value]) {
            invertMapping[value] = [];
          }
          invertMapping[value].push(key);
        });
      }
      return invertMapping;
    }
  },
  methods: {
    openVerbTable() {
      this.state = 'verb-form-table';
    },

    openVerbTest() {
      this.state = 'verb-form-test';
    },

    openInvertVerbTest() {
      this.state = 'invert-verb-form-test';
    },
    
    backToMenu() {
      this.state = 'menu';
    }
  },
  components: {
    VerbFormTable, TestForm
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

.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}

.footer {
  width: 100%;
  padding: 10px;
  text-align: center;
}
</style>
