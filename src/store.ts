import { createStore } from 'vuex';

export default createStore({
  state: {
    appVersion: '0.27',
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    appVersion: state => state.appVersion,
  }
});