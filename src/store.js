import Vue from "vue";
import Vuex from "vuex";


Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    domain: process.env.VUE_APP_BASEURL,
    keepAlivePage: []
  },
  mutations: {
    addKeepAlivePage(state, page) {
      var isExist = state.keepAlivePage.indexOf(page) !== -1;
      if (!isExist) {
        state.keepAlivePage.push(page)
      }
    },
    delKeepAlivePage(state, page) {
      var index = state.keepAlivePage.indexOf(page);
      if (index !== -1) {
        state.keepAlivePage.splice(index, 1);
      }
    }
  },
  actions: {}
});
