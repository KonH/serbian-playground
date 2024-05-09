<template>
  <div class="container mt-3">
    <div class="mb-3">
      <label for="latinInput" class="form-label">SRB:</label>
      <textarea id="latinInput" v-model="latinText" class="form-control" rows="3" :placeholder="translate('EnterLatnText')"></textarea>
      <button @click="convertToCyrillic" class="btn btn-primary mt-2">
        {{ translate('ConvertToCyrl') }}
      </button>
    </div>
    <div class="mb-3">
      <label for="cyrillicInput" class="form-label">СРБ:</label>
      <textarea id="cyrillicInput" v-model="cyrillicText" class="form-control" rows="3" :placeholder="translate('EnterCyrlText')"></textarea>
      <button @click="convertToLatin" class="btn btn-primary mt-2">
        {{ translate('ConvertToLatn') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { latinToCyrillic, cyrillicToLatin } from '@/logic/translatorLogic';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'TranslatorForm',
  data: () => {
    return {
      latinText: '',
      cyrillicText: ''
    };
  },
  setup() {
    const i18n = useI18n();
    const translate = i18n.t;
    return {
      translate
    };
  },
  methods: {
    convertToCyrillic() {
       this.cyrillicText = latinToCyrillic(this.latinText);
    },

    convertToLatin() {
      this.latinText = cyrillicToLatin(this.cyrillicText);
    }
  }
});
</script>

<style scoped>
</style>