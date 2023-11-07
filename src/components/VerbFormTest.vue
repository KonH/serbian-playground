<template>
<table class="test-table table table-bordered">
  <thead>
    <tr>
      <th>{{ rightCounter }}</th>
      <th colspan="2">{{ question }}?</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><b-button variant="info" @click="checkAnswer(0)">{{ answers[0] }}</b-button></td>
      <td><b-button variant="info" @click="checkAnswer(1)">{{ answers[1] }}</b-button></td>
    </tr>
    <tr>
      <td><b-button variant="info" @click="checkAnswer(2)">{{ answers[2] }}</b-button></td>
      <td><b-button variant="info" @click="checkAnswer(3)">{{ answers[3] }}</b-button></td>
    </tr>
  </tbody>
</table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

const bitiForms: Record<string, string> = {
  'ja': 'sam',
  'ti': 'si',
  'on': 'je',
  'ona (ed)': 'je',
  'ono': 'je',
  'mi': 'smo',
  'vi': 'ste',
  'oni': 'su',
  'one': 'su',
  'ona (mn)': 'su'
};

export default defineComponent({
  name: 'VerbFormTest',
  data: () => {
    return {
      question: '',
      answers: [] as string[],
      rightCounter: 0
    }
  },
  methods: {
    checkAnswer(index: number) {
      const correctAnswer = bitiForms[this.question];
      if (this.answers[index] === correctAnswer) {
        this.onRightClick();
      } else {
        this.onWrongClick();
      }
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
      const questions = Object.keys(bitiForms);
      this.question = questions[Math.floor(Math.random() * questions.length)];
      const correctAnswer = bitiForms[this.question];
      let incorrectAnswers = Object.values(bitiForms).filter(answer => answer !== correctAnswer);
      incorrectAnswers = this.shuffleArray(incorrectAnswers);
      incorrectAnswers = incorrectAnswers.slice(0, 3);
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
</style>