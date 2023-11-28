<template>
  <div class="wrapper">
    <div class="container content">
      <div class="d-flex flex-column align-items-center" v-if="inMenu">
        <b-button @click="openVerbTable" variant="primary" class="mb-3">Biti verb forms table</b-button>
        <b-button @click="openVerbTest" variant="danger" class="mb-3">Biti verb forms test</b-button>
        <b-button @click="openInvertVerbTest" variant="danger" class="mb-5">Biti verb forms test (invert)</b-button>
      
        <b-button @click="openPluralTable" variant="primary" class="mb-3">Plural forms table</b-button>
        <b-button @click="openPluralTest" variant="danger" class="mb-3">Plural forms test</b-button>
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
    
      <div v-if="inPluralTable" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">Back</b-button>
        <PluralFormTable />
      </div>
      <div v-if="inPluralFormTest" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">Back</b-button>
        <TestForm :mapping="pluralFormMapping" />
      </div>
    </div>
    <footer class="footer">
      Version: {{ version }}
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VerbFormTable from './components/VerbFormTable.vue';
import TestForm from './components/TestForm.vue';
import PluralFormTable from './components/PluralFormTable.vue';
import { NounDef, loadNouns, createNounMapping } from './logic/pluralFormUtils';
import nounsCsv from '!!raw-loader!./assets/nouns.csv';

const version = '0.6';

type State = 
  'menu' |
  'verb-form-table' |
  'verb-form-test' |
  'invert-verb-form-test' |
  'plural-form-table' |
  'plural-form-test';

const bitiForms: Record<string, string> = {
  'ja': 'sam',
  'ti': 'si',
  'on': 'je',
  'ona (ed)': 'je',
  'ono': 'je',
  'mi': 'smo',
  'vi': 'ste',
  'oni': 'su',
  'one': 'su',
  'ona (mn)': 'su'
};

const nouns: NounDef[] = [];
loadNouns(nounsCsv, nouns);

export default defineComponent({
  name: 'App',
  data: () => {
    return {
      version: version,
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

    inPluralTable() {
      return this.state == 'plural-form-table';
    },

    inPluralFormTest() {
      return this.state == 'plural-form-test';
    },

    verbFormMapping() {
      const mapping: Record<string, Record<string, boolean>> = {};
      const allValues = Object.values(bitiForms);
      for (const [key, correctValue] of Object.entries(bitiForms)) {
        mapping[key] = {};
        for (const value of allValues) {
          const isCorrect = value === correctValue;
          mapping[key][value] = isCorrect;
        }
      }
      return mapping;
    },

    invertVerbFormMapping() {
      const invertMapping: Record<string, Record<string, boolean>> = {};
      for (const [key, value] of Object.entries(bitiForms)) {
        invertMapping[value] = {};
        invertMapping[value][key] = true;
        const keysWithOtherValues = [];
        for (const [k, v] of Object.entries(bitiForms)) {
          if (v !== value) {
            keysWithOtherValues.push(k);
          }
        }
        for (const k of keysWithOtherValues) {
          invertMapping[value][k] = false;
        }
      }
      return invertMapping;
    },

    pluralFormMapping() {
      return createNounMapping(nouns);
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

    openPluralTable() {
      this.state = 'plural-form-table';
    },

    openPluralTest() {
      this.state = 'plural-form-test';
    },
    
    backToMenu() {
      this.state = 'menu';
    }
  },
  components: {
    VerbFormTable,
    PluralFormTable,
    TestForm
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
