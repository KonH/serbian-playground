<template>
  <b-button @click="backToMenu" variant="secondary" class="mb-3">
    {{ translate('Back') }}
  </b-button>
  
  <TestForm :mapping="genericMapping" :langStyle="langStyle" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useI18n } from 'vue-i18n';
import { mapActions, mapGetters } from 'vuex';
import TestForm from './TestForm.vue';
import { createGenericMappingForCategories } from '@/logic/genericTestUtils';

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

    genericMapping() {
      return createGenericMappingForCategories(this.selectedTestCategories, this.translate);
    }
  },
  methods: {
    ...mapActions(['updateAppState']),

    backToMenu() {
      this.updateAppState('mainMenu');
    }
  },
  components: {
    TestForm
  }
});
</script>

<style scoped>
</style>