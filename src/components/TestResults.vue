<template>
  <div>
    <h2>{{ translate('Finished') }}</h2>
  </div>
  
  <div>
    <b>{{ translate('TotalQuestions') }}:</b> {{ totalQuestions }}
  </div>
  <div>
    <b>{{ translate('RightAnswers') }}:</b> {{ rightAnswers }} ({{ rightAnswersPercent }}%)
  </div>

  <table class="mt-2 mb-3">
    <tbody>
      <tr v-for="(data, category) in testCategories" :key="category">
        <td class="text-nowrap">{{ translate(category) }}:</td>
        <td>{{ rightAnswersPercentByCategory(data) }}%</td>
      </tr>
    </tbody>
  </table>

  <b-button @click="backToMenu" variant="secondary" class="mb-3">
    {{ translate('Back') }}
  </b-button>

</template>

<script lang="ts">
import { TestData, TestCategoryData } from '@/store';
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
    ...mapGetters(['lastTestResults']),

    testResults() {
      return this.lastTestResults as TestData;
    },

    totalQuestions() {
      return this.testResults.totalQuestions;
    },

    rightAnswers() {
      return this.testResults.rightAnswers;
    },

    testCategories() {
      return this.testResults.testCategories;
    },

    rightAnswersPercent() {
      return this.calculateRightPercent(this.rightAnswers, this.totalQuestions);
    },
  },
  methods: {
    ...mapActions(['updateAppState']),

    backToMenu() {
      this.updateAppState('mainMenu');
    },

    rightAnswersPercentByCategory(data: TestCategoryData) {
      return this.calculateRightPercent(data.rightAnswers, data.totalQuestions);
    },

    calculateRightPercent(rightAnswers: number, totalQuestions: number) {
      return totalQuestions > 0 ? Math.round(rightAnswers / totalQuestions * 100) : 0;
    },
  }
});
</script>

<style scoped>
</style>