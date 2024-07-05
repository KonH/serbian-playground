import { defineAsyncComponent } from 'vue';

export const stateToComponentMap = {
    'mainMenu': defineAsyncComponent(() => import('./MainMenu.vue')),
    'translator': defineAsyncComponent(() => import('./TranslatorForm.vue')),
    'genericTestSelector': defineAsyncComponent(() => import('./GenericTestSelector.vue')),
    'genericTest': defineAsyncComponent(() => import('./GenericTest.vue')),
};