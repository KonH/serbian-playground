<template>
<table class="test-table table table-bordered">
  <thead>
    <tr>
      <th colspan="2">{{ question }}?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="column-width">
        <b-button variant="info" @click="e => checkAnswer(e, 0)">
          {{ answers[0] }}
        </b-button>
      </td>
      <td class="column-width">
        <b-button variant="info" @click="e => checkAnswer(e, 1)">
          {{ answers[1] }}
        </b-button>
      </td>
    </tr>
    <tr>
      <td class="column-width">
        <b-button variant="info" @click="e => checkAnswer(e, 2)">
          {{ answers[2] }}
        </b-button>
      </td>
      <td class="column-width">
        <b-button variant="info" @click="e => checkAnswer(e, 3)">
          {{ answers[3] }}
        </b-button>
      </td>
    </tr>
  </tbody>
</table>
Streak: {{ rightCounter }}
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TestForm',
  props: {
    mapping: {
      type: Object as () => Record<string, string[]>,
      required: true
    }
  },
  data: () => {
    return {
      question: '',
      answers: [] as string[],
      rightCounter: 0,
      animating: false
    }
  },
  methods: {
    checkAnswer(e: MouseEvent, index: number) {
      if (this.animating) {
        return;
      }
      
      const correctAnswers = this.mapping[this.question];
      const isCorrect = correctAnswers.includes(this.answers[index]);
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
      this.rightCounter++;
      this.generateNewQuestion();
    },
    
    onWrongClick() {
      this.resetCounter();
    },
    
    resetCounter() {
      this.rightCounter = 0;
    },
    
    generateNewQuestion() {
      let questions = Object.keys(this.mapping);
      // Filter out the last question if it exists
      if (this.question !== null) {
        questions = questions.filter(question => question !== this.question);
      }
      this.question = questions[Math.floor(Math.random() * questions.length)];
      const correctAnswers = this.mapping[this.question];
      const correctAnswer = correctAnswers[Math.floor(Math.random() * correctAnswers.length)];
      let allAnswers: string[] = Object.values(this.mapping).flat();
      let incorrectAnswers = allAnswers.filter(answer => !correctAnswers.includes(answer));
      incorrectAnswers = Array.from(new Set(incorrectAnswers));
      incorrectAnswers = this.shuffleArray(incorrectAnswers).slice(0, 3);
      this.answers = this.shuffleArray([correctAnswer, ...incorrectAnswers]);
    },
    
    shuffleArray(array: string[]) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
  },
  mounted() {
    this.resetCounter();
    this.generateNewQuestion();
  }
});
</script>

<style scoped>
.test-table {
  max-width: 600px;
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
</style>