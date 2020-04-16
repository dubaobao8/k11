import Vue from "vue";
import Vuex from "vuex";


Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		domain: process.env.VUE_APP_BASEURL,
		keepAlivePage: [],
		searchParamList: []
	},
	mutations: {
		addSearchParam(state, obj) {
			if (state.searchParamList.length > 0) {
				for (var i = 0; i < state.searchParamList.length; i++) {
					if (state.searchParamList[i].page == obj.page) {
						state.searchParamList[i] = obj
					} else {
						state.searchParamList.push(obj)
					}
				}
			} else {
				state.searchParamList.push(obj)
			}
		},
		deleteSearchParam(state, obj) {
			if (state.searchParamList.length > 0) {
				for (var i = 0; i < state.searchParamList.length; i++) {
					if (state.searchParamList[i].page == obj.page) {
						state.searchParamList.splice(i,1)
					}
				}
			}
		},
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
