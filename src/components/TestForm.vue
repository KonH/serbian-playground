<template>
<table class="test-table table mt-3">
  <thead>
    <tr>
      <th colspan="2">
        <div>
          <div class="mt-1 p-1 bg-light-blue rounded">
            {{ questionCategory }}
          </div>
          <div class="mt-2 m-1">
            {{ questionText }}?
          </div>
          <div>
            <b-button v-if="inlineHint !== ''" variant="secondary" @click="toggleInlineHint">?</b-button>
            <div v-if="showInlineHint" class="mt-1 p-2 bg-light-yellow rounded">
              {{ inlineHint }}
            </div>
          </div>
        </div>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="column-width">
        <b-button variant="info" class="p-3" @click="e => checkAnswer(e, 0)" v-if="answers.length > 0">
          {{ answerTexts[0] }}
        </b-button>
      </td>
      <td class="column-width">
        <b-button variant="info" class="p-3" @click="e => checkAnswer(e, 1)" v-if="answers.length > 1">
          {{ answerTexts[1] }}
        </b-button>
      </td>
    </tr>
    <tr>
      <td class="column-width">
        <b-button variant="info" class="p-3" @click="e => checkAnswer(e, 2)" v-if="answers.length > 2">
          {{ answerTexts[2] }}
        </b-button>
      </td>
      <td class="column-width">
        <b-button variant="info" class="p-3" @click="e => checkAnswer(e, 3)" v-if="answers.length > 3">
          {{ answerTexts[3] }}
        </b-button>
      </td>
    </tr>
  </tbody>
</table>
<div class="mt-5">
  <div>
    {{ translate('Streak') }}: {{ rightStreakCounter }}
  </div>
  <div>
    {{ translate('TotalQuestions') }}: {{ totalCounter }}
  </div>
  <b-button variant="secondary" @click="finish" class="mt-2">
    {{ translate('Finish') }}
  </b-button>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { TestEntry } from '@/logic/TestEntry';
import { latinToCyrillic } from '@/logic/translatorLogic';
import { mapActions } from 'vuex';
import { useI18n } from 'vue-i18n';
import { TestCategoryData } from '@/store';

export default defineComponent({
  name: 'TestForm',
  props: {
    mapping: {
      type: Object as () => TestEntry,
      required: true
    },
    langStyle: {
      type: String,
      default: 'latin'
    }
  },
  data: () => {
    return {
      category: '',
      question: '',
      inlineHint: '',
      showInlineHint: false,
      answers: [] as string[],
      rightStreakCounter: 0,
      firstTimeRightCounter: 0,
      totalCounter: 0,
      animating: false,
      isFirstClick: true,
      categoryStats: {} as Record<string, TestCategoryData>
    }
  },
  setup() {
    const i18n = useI18n();
    const translate = i18n.t;
    return {
      translate
    };
  },
  computed: {
    questionText() {
      if (this.langStyle == 'cyrillic') {
        return latinToCyrillic(this.question);
      }
      return this.question;
    },

    questionCategory() {
      return this.translate(this.category);
    },

    answerTexts() {
      if (this.langStyle == 'cyrillic') {
        return this.answers.map(answer => latinToCyrillic(answer));
      }
      return this.answers;
    }
  },
  methods: {
    ...mapActions(['updateAppState', 'updateLastTestResults']),

    checkAnswer(e: MouseEvent, index: number) {
      if (this.animating) {
        return;
      }

      const selectedAnswer = this.answers[index];
      const correctAnswers = this.mapping.questions[this.question].answers;
      const isCorrect = correctAnswers[selectedAnswer];
      const target = e.currentTarget as HTMLElement;
      if (target == null) {
        return;
      }
      const animationClass = isCorrect ? 'flash-green' : 'flash-red';
      target.classList.add(animationClass);
      this.animating = true;
      setTimeout(() => {
        target.classList.remove(animationClass);
        this.animating = false;
        if (isCorrect) {
          this.onRightClick();
        } else {
          this.onWrongClick();
        }
      }, 330);
    },

    onRightClick() {
      this.rightStreakCounter++;
      this.totalCounter++;
      this.updateCategoryStats(this.category, this.isFirstClick);
      if (this.isFirstClick) {
        this.firstTimeRightCounter++;
      }
      this.generateNewQuestion();
    },
    
    onWrongClick() {
      this.resetStreakCounter();
      this.isFirstClick = false;
    },
    
    resetStreakCounter() {
      this.rightStreakCounter = 0;
    },

    updateCategoryStats(category: string, isFirstClick: boolean) {
      if (this.categoryStats[category] == null) {
        this.categoryStats[category] = {
          totalQuestions: 0,
          rightAnswers: 0
        };
      }
      this.categoryStats[category].totalQuestions++;
      if (isFirstClick) {
        this.categoryStats[category].rightAnswers++;
      }
    },
    
    generateNewQuestion() {
      let questions = Object.keys(this.mapping.questions);
      // Filter out the last question if it exists
      if (this.question !== null) {
        questions = questions.filter(question => question !== this.question);
      }
      this.question = questions[Math.floor(Math.random() * questions.length)];
      this.category = this.mapping.questions[this.question].category ?? '';
      const answerRecords = this.mapping.questions[this.question].answers;
      const answerKeys = Object.keys(answerRecords);
      const correctAnswer = answerKeys.find(key => answerRecords[key]) ?? '';
      let incorrectAnswers = answerKeys.filter(key => !answerRecords[key]);
      incorrectAnswers = this.shuffleArray(incorrectAnswers).slice(0, 3);
      this.answers = this.shuffleArray([correctAnswer, ...incorrectAnswers]);
      this.inlineHint = this.mapping.questions[this.question].inlineHint;
      this.showInlineHint = false;
      this.isFirstClick = true;
    },
    
    shuffleArray(array: string[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },

    toggleInlineHint() {
      this.showInlineHint = !this.showInlineHint;
    },

    finish() {
      this.updateLastTestResults({
        totalQuestions: this.totalCounter,
        rightAnswers: this.firstTimeRightCounter,
        testCategories: this.categoryStats 
      });
      this.updateAppState('testResults');
    }
  },
  mounted() {
    this.resetStreakCounter();
    this.generateNewQuestion();
  }
});
</script>

<style scoped>
.test-table {
  max-width: 600px;
}

.test-table tr {
  border: hidden;
}

.column-width {
  width: 50%;
}

.flash-green {
  animation: flashGreen 0.33s;
}

@keyframes flashGreen {
  0% { background-color: initial; }
  50% { background-color: green; }
  100% { background-color: initial; }
}

.flash-red {
  animation: flashRed 0.33s;
}

@keyframes flashRed {
  0% { background-color: initial; }
  50% { background-color: red; }
  100% { background-color: initial; }
}

.bg-light-blue {
  background-color: #cce5ff;
}

.bg-light-yellow {
  background-color: #fff3cd;
}
</style>