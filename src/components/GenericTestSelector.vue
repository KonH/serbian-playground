<template>
 
  <b-button @click="backToMenu" variant="secondary" class="mb-3">
    {{ translate('Back') }}
  </b-button>
  
  <b-form-group>
    <b-form-checkbox-group
      v-model="selectedCategories"
      :options="allTranslatedCategories"
      stacked
      class="text-nowrap"
    ></b-form-checkbox-group>
  </b-form-group>
  
  <b-button @click="proceedToTest" variant="primary" class="mt-3">
    {{ translate('StartTest') }}
  </b-button>

</template>

<script lang="ts">
import { AllTestCategories, TestCategory } from '@/store';
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
  setup() {
    const i18n = useI18n();
    const translate = i18n.t;
    return {
      translate
    };
  },
  computed: {
    ...mapGetters(['selectedTestCategories', 'langStyle']),
    
    allTranslatedCategories() {
      return AllTestCategories.map(category => ({
        value: category,
        text: this.translate(category)
      }));
    },

    selectedCategories: {
      get(): TestCategory[] {
        return this.selectedTestCategories;
      },
      set(value: TestCategory[]) {
        this.updateSelectedTestCategories(value);
      }
    }
  },
  methods: {
    ...mapActions(['updateAppState', 'updateSelectedTestCategories']),

    backToMenu() {
      this.updateAppState('mainMenu');
    },

    proceedToTest() {
      this.updateAppState('genericTest');
    }
  }
});
</script>

<style scoped>
</style>