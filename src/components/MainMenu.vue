<template>
    <h2 class="header">Serbian Playground</h2>

    <b-button @click="openTestSelector" variant="primary" class="mb-3">
        {{ translate('StartTest') }}
    </b-button>

    <b-button @click="openTranslator" variant="primary" class="mb-3">
        {{ translate('SrbTranslator') }}
    </b-button>

    <div>
      <select v-model="selectedLanguage" @change="handleLanguageChange" class="form-select-sm">
        <option value="en">English</option>
        <option value="ru">Russian</option>
        <option value="sr-Latn">Serbian (Latin)</option>
        <option value="sr-Cyrl">Serbian (Cyrillic)</option>
      </select>
    </div>

    <div>
      <b-button @click="clickLatinStyleButton" :variant="latinButtonVariant" class="m-2">
        SRB
      </b-button>
      <b-button @click="clickCyrillicStyleButton" :variant="cyrillicButtonVariant">
        СРБ
      </b-button>
    </div>
</template>

<script lang="ts">
import { changeLanguage, getCurrentLanguage } from '@/logic/localizationUtils';
import { defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
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
            translate,
            selectedLanguage,
            handleLanguageChange
        };
    },
    methods: {
        ...mapActions(['updateLangStyle', 'updateAppState']),
        
        openTranslator() {
          this.updateAppState('translator');
        },
        
        openTestSelector() {
          this.updateAppState('genericTestSelector');
        },

        clickLatinStyleButton() {
          this.updateLangStyle('latin');
        },

        clickCyrillicStyleButton() {
          this.updateLangStyle('cyrillic');
        }
    },
    computed: {
        ...mapGetters(['langStyle']),

        latinButtonVariant() {
          return this.langStyle == 'latin' ? 'primary' : 'secondary';
        },

        cyrillicButtonVariant() {
          return this.langStyle == 'cyrillic' ? 'primary' : 'secondary';
        },
    }
});
</script>

<style scoped>
.header {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  text-align: center;
  margin: 20px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #3498db;
}

@media (max-width: 600px) {
  .header {
    font-size: 2rem;
  }
}
</style>