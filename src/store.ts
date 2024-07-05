import { createStore } from 'vuex';

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
  'ComparativeAdjectiveTest'
] as const;

export type TestCategoryTuple = typeof AllTestCategories;
export type TestCategory = TestCategoryTuple[number];

export default createStore({
  state: {
    appVersion: '0.27',
    langStyle: loadLangStyle(),
    appState: 'mainMenu' as AppState,
    selectedTestCategories: loadSelectedTestCategories(),
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
  },
  getters: {
    appVersion: state => state.appVersion,
    langStyle: state => state.langStyle,
    appState: state => state.appState,
    selectedTestCategories: state => state.selectedTestCategories,
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