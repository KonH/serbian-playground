<template>
  <div class="wrapper">
    <div class="container content">
      <div class="d-flex flex-column align-items-center" v-if="inMenu">
        <b-button @click="openBitiVerbTable" variant="primary" class="mb-3">
          {{ translate('BitiVerbFormsTable') }}
        </b-button>
        <b-button @click="openBitiVerbTest" variant="danger" class="mb-3">
          {{ translate('BitiVerbFormsTest') }}
        </b-button>
        <b-button @click="openInvertBitiVerbTest" variant="danger" class="mb-5">
          {{  translate('BitiVerbFormsTestInvert') }}
        </b-button>
      
        <b-button @click="openPluralTable" variant="primary" class="mb-3">
          {{ translate('PluralFormsTable') }}
        </b-button>
        <b-button @click="openPluralTest" variant="danger" class="mb-5">
          {{ translate('PluralFormsTest') }}
        </b-button>

        <b-button @click="openTranslator" variant="primary" class="mb-5">
          {{ translate('SrbTranslator') }}
        </b-button>

        <b-button @click="openVerbConjugationTest" variant="danger" class="mb-5">
          {{ translate('VerbConjugationTest') }}
        </b-button>

        <b-button @click="openNounCaseTest" variant="danger" class="mb-5">
          {{ translate('NounCaseTest') }}
        </b-button>

        <b-button @click="openComparativeAdjectiveTest" variant="danger" class="mb-5">
          {{ translate('ComparativeAdjectiveTest') }}
        </b-button>
        
      </div>
      
      <div v-if="inBitiVerbFormTable" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">
          {{ translate('Back') }}
        </b-button>
        <BitiVerbFormTable />
      </div>
      <div v-if="inBitiVerbFormTest" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">
          {{ translate('Back') }}
        </b-button>
        <TestForm :mapping="bitiVerbFormMapping" :langStyle="langStyle" />
      </div>
      <div v-if="inInvertBitiVerbFormTest" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">
          {{ translate('Back') }}
        </b-button>
        <TestForm :mapping="invertBitiVerbFormMapping" :langStyle="langStyle" />
      </div>
    
      <div v-if="inPluralTable" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">
          {{ translate('Back') }}
        </b-button>
        <PluralFormTable />
      </div>
      <div v-if="inPluralFormTest" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">
          {{ translate('Back') }}
        </b-button>
        <TestForm :mapping="pluralFormMapping" :langStyle="langStyle" />
      </div>

      <div v-if="inTranslator" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">
          {{ translate('Back') }}
        </b-button>
        <TranslatorForm />
      </div>

      <div v-if="inVerbConjugationTest" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">
          {{ translate('Back') }}
        </b-button>
        <TestForm :mapping="verbConjugationMapping" :langStyle="langStyle" />
      </div>

      <div v-if="inNounCaseTest" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">
          {{ translate('Back') }}
        </b-button>
        <TestForm :mapping="nounCaseMapping" :langStyle="langStyle" />
      </div>

      <div v-if="inComparativeAdjectiveTest" class="d-flex flex-column align-items-center">
        <b-button @click="backToMenu" variant="secondary" class="mb-3">
          {{ translate('Back') }}
        </b-button>
        <TestForm :mapping="comparativeAdjectiveMapping" :langStyle="langStyle" />
      </div>

    </div>
    
    <div v-if="inMenu">

      <div>
        <select v-model="selectedLanguage" @change="handleLanguageChange" class="form-select-sm">
          <option value="en">English</option>
          <option value="ru">Russian</option>
          <option value="sr-Latn">Serbian (Latin)</option>
          <option value="sr-Cyrl">Serbian (Cyrillic)</option>
        </select>
      </div>

      <div>
        <b-button @click="clickLatinButton" :variant="latinButtonVariant" class="m-2">
          SRB
        </b-button>
        <b-button @click="clickCyrillicButton" :variant="cyrillicButtonVariant">
          СРБ
        </b-button>
      </div>

    </div>

    <div class="social-buttons">
      <b-button @click="openGitHub" variant="link" class="social-button">
        <img src="@/assets/github-mark.png" alt="GitHub">
      </b-button>
      <b-button @click="openTelegram" variant="link" class="social-button">
        <img src="@/assets/telegram-logo.png" alt="Telegram">
      </b-button>
    </div>

    <footer class="footer">
      Version: {{ version }}
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import BitiVerbFormTable from './components/BitiVerbFormTable.vue';
import TestForm from './components/TestForm.vue';
import PluralFormTable from './components/PluralFormTable.vue';
import TranslatorForm from './components/TranslatorForm.vue';
import { NounDef, loadNouns, createNounMapping } from './logic/pluralFormUtils';
import nounsCsv from '!!raw-loader!./assets/nouns.csv';
import { TestEntry, TestEntryElement } from './logic/TestEntry';
import { VerbDef, loadVerbs, createVerbMapping } from './logic/verbConjugationUtils';
import verbsCsv from '!!raw-loader!./assets/verbs.csv';
import { createNounCaseMapping } from './logic/nounCaseUtils';
import adjectivesCsv from '!!raw-loader!./assets/adjectives.csv';
import { AdjectiveDef, loadAdjectives, createComparativeAdjectiveMapping } from './logic/adjectiveUtils';
import { useI18n } from 'vue-i18n';
import { changeLanguage, getCurrentLanguage } from './logic/localizationUtils';

const version = '0.26';

type State = 
  'menu' |
  'biti-verb-form-table' |
  'biti-verb-form-test' |
  'invert-biti-verb-form-test' |
  'plural-form-table' |
  'plural-form-test' |
  'translator' |
  'verb-conjugation-test' |
  'noun-case-test' |
  'comparative-adjective-test';

type Style = 'latin' | 'cyrillic';

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

const verbs: VerbDef[] = [];
loadVerbs(verbsCsv, verbs);

const adjectives: AdjectiveDef[] = [];
loadAdjectives(adjectivesCsv, adjectives);

export default defineComponent({
  name: 'App',
  data: () => {
    return {
      version: version,
      state: 'menu' as State,
      langStyle: 'latin' as Style
    }
  },
  setup() {
    const i18n = useI18n();
    const translate = i18n.t;
    const selectedLanguage = ref(getCurrentLanguage());
    
    const handleLanguageChange = (e: Event) => {
      const newLang = (e.target as HTMLSelectElement).value;
      changeLanguage(i18n, newLang);
      selectedLanguage.value = newLang;
    };
    
    return {
      handleLanguageChange,
      selectedLanguage,
      translate
    };
  },
  computed: {
    inMenu() {
      return this.state == 'menu';
    },

    inBitiVerbFormTable() {
      return this.state == 'biti-verb-form-table';
    },

    inBitiVerbFormTest() {
      return this.state == 'biti-verb-form-test';
    },

    inInvertBitiVerbFormTest() {
      return this.state == 'invert-biti-verb-form-test';
    },

    inPluralTable() {
      return this.state == 'plural-form-table';
    },

    inPluralFormTest() {
      return this.state == 'plural-form-test';
    },

    inTranslator() {
      return this.state == 'translator';
    },

    inVerbConjugationTest() {
      return this.state == 'verb-conjugation-test';
    },

    inNounCaseTest() {
      return this.state == 'noun-case-test';
    },

    inComparativeAdjectiveTest() {
      return this.state == 'comparative-adjective-test';
    },

    bitiVerbFormMapping() {
      const mapping: Record<string, Record<string, boolean>> = {};
      const allValues = Object.values(bitiForms);
      for (const [key, correctValue] of Object.entries(bitiForms)) {
        mapping[key] = {};
        for (const value of allValues) {
          const isCorrect = value === correctValue;
          mapping[key][value] = isCorrect;
        }
      }
      return this.convertFromLegacyMapping(mapping);
    },

    invertBitiVerbFormMapping() {
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
      return this.convertFromLegacyMapping(invertMapping);
    },

    pluralFormMapping() {
      return createNounMapping(nouns);
    },

    latinButtonVariant() {
      return this.langStyle == 'latin' ? 'primary' : 'secondary';
    },

    cyrillicButtonVariant() {
      return this.langStyle == 'cyrillic' ? 'primary' : 'secondary';
    },

    verbConjugationMapping() {
      return createVerbMapping(verbs);
    },

    nounCaseMapping() {
      return createNounCaseMapping(nouns);
    },

    comparativeAdjectiveMapping() {
      return createComparativeAdjectiveMapping(adjectives, nouns, adj => this.translate(`adjective_${adj.word}`));
    },
  },
  methods: {
    openBitiVerbTable() {
      this.state = 'biti-verb-form-table';
    },

    openBitiVerbTest() {
      this.state = 'biti-verb-form-test';
    },

    openInvertBitiVerbTest() {
      this.state = 'invert-biti-verb-form-test';
    },

    openPluralTable() {
      this.state = 'plural-form-table';
    },

    openPluralTest() {
      this.state = 'plural-form-test';
    },

    openTranslator() {
      this.state = 'translator';
    },

    openVerbConjugationTest() {
      this.state = 'verb-conjugation-test';
    },

    openNounCaseTest() {
      this.state = 'noun-case-test';
    },

    openComparativeAdjectiveTest() {
      this.state = 'comparative-adjective-test';
    },
    
    backToMenu() {
      this.state = 'menu';
    },

    convertFromLegacyMapping(input: Record<string, Record<string, boolean>>) {
      const testEntry: TestEntry = { questions: {} };
      for (const [key, answers] of Object.entries(input)) {
        const testEntryElement: TestEntryElement = {
          question: key,
          inlineHint: '',
          answers
        };
        testEntry.questions[key] = testEntryElement;
      }
      return testEntry;
    },

    clickLatinButton() {
      this.langStyle = 'latin';
    },

    clickCyrillicButton() {
      this.langStyle = 'cyrillic';
    },

    openGitHub() {
      window.open('https://github.com/KonH/serbian-playground', '_blank');
    },
    
    openTelegram() {
      window.open('https://t.me/serbian_playground', '_blank');
    },
  },
  components: {
    BitiVerbFormTable,
    PluralFormTable,
    TestForm,
    TranslatorForm
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

.social-button img {
  width: 40px;
  height: auto;
}
</style>
