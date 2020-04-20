import Vue from "vue";
import "./cube-ui";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "normalize.css";
import "./util/style.css";
import "font-awesome/css/font-awesome.css";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/dist/css/swiper.css";
import "@/assets/iconfont/iconfont.css"
import Video from 'video.js'
import 'video.js/dist/video-js.css'
import Cube from "cube-ui";
import {
  List,
  PullRefresh,
  Notify,
  Toast,
  Tab,
  Tabs,
  Icon,
  ActionSheet,
  Popup,
  Cell,
  CellGroup,
  Collapse,
  CollapseItem,
  Switch
} from "vant"
import {stampToString} from "./util/util";
import extend from "@/util/extend";
import '@vant/touch-emulator';

Vue.prototype.ex = extend;
Vue.prototype.$video = Video

Notify.setDefaultOptions({duration: 2000});
Toast.setDefaultOptions({duration: 2000});

Vue.use(List);
Vue.use(PullRefresh);
Vue.use(Notify);
Vue.use(Toast);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Icon);
Vue.use(ActionSheet);
Vue.use(Popup);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Switch);

Vue.use(Cube);
Vue.use(VueAwesomeSwiper);


Vue.config.productionTip = false;

Vue.filter('transDate', function (value) {
  if (typeof value === 'number') {
    return stampToString(value, '/')
  } else {
    return value
  }
});

Vue.filter('transTime', function (value) {
  if (typeof value === 'number') {
    return stampToString(value, '/', true)
  } else {
    return value
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
