<template>
  <div class="wrapper">
    <div class="container content">
      <div class="d-flex flex-column align-items-center">
        <component :is="currentStateComponent" />
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import AppFooter from './components/AppFooter.vue';
import { stateToComponentMap } from './components';
import { mapGetters } from 'vuex';
import { AppState } from './store';

export default defineComponent({
  computed: {
    ...mapGetters(['appState']),
    
    currentStateComponent() {
      return stateToComponentMap[this.appState as AppState];
    },
  },
  components: {
    AppFooter
  }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
}
</style>
