import { createStore } from 'vuex';

const appVersion = '0.28';

export type LangStyle = 
  'latin' |
  'cyrillic';

export type AppState = 
  'mainMenu' | 
  'translator' | 
  'genericTestSelector' | 
  'genericTest';

export const AllTestCategories = [
  'BitiVerbFormsTest',
  'BitiVerbFormsTestInvert',
  'PluralFormsTest',
  'VerbConjugationTest',
  'NounCaseTest',
  'ComparativeAdjectiveTest',
  'SuperlativeAdjectiveTest'
] as const;

export type TestCategoryTuple = typeof AllTestCategories;
export type TestCategory = TestCategoryTuple[number];

export type TestCategoryData = {
  totalQuestions: number;
  rightAnswers: number;
}

export type TestData = {
  totalQuestions: number;
  rightAnswers: number;
  testCategories: Record<string, TestCategoryData>;
}

export default createStore({
  state: {
    appVersion: appVersion,
    langStyle: loadLangStyle(),
    appState: 'mainMenu' as AppState,
    selectedTestCategories: loadSelectedTestCategories(),
    lastTestResults: null as TestData | null,
  },
  mutations: {
    setLangStyle(state, langStyle: LangStyle) {
      state.langStyle = langStyle;
      localStorage.setItem('langStyle', langStyle);
    },
    
    setAppState(state, appState: AppState) {
      state.appState = appState;
    },

    setSelectedTestCategories(state, testCategories: TestCategory[]) {
      state.selectedTestCategories = testCategories;
      localStorage.setItem('selectedTestCategories', JSON.stringify(testCategories));
    },

    setLastTestResults(state, testData: TestData | null) {
      state.lastTestResults = testData;
    }
  },
  actions: {
    updateLangStyle({ commit }, langStyle: LangStyle) {
      commit('setLangStyle', langStyle);
    },

    updateAppState({ commit }, appState: AppState) {
      commit('setAppState', appState);
    },

    updateSelectedTestCategories({ commit }, testCategories: TestCategory[]) {
      commit('setSelectedTestCategories', testCategories);
    },

    updateLastTestResults({ commit }, testData: TestData | null) {
      commit('setLastTestResults', testData);
    }
  },
  getters: {
    appVersion: state => state.appVersion,
    langStyle: state => state.langStyle,
    appState: state => state.appState,
    selectedTestCategories: state => state.selectedTestCategories,
    lastTestResults: state => state.lastTestResults
  }
});

function loadLangStyle(): LangStyle {
  const savedLangStyle = localStorage.getItem('langStyle') as LangStyle;
  return savedLangStyle || 'latin';
}

function loadSelectedTestCategories(): TestCategory[] {
  const savedTestCategoriesStr = localStorage.getItem('selectedTestCategories') as string;
  if (!savedTestCategoriesStr) {
    return [];
  }
  return JSON.parse(savedTestCategoriesStr) as TestCategory[];
}