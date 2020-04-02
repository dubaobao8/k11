<template>
  <div>
    <cube-tab-bar style="tabHeader" v-model="selectedLabel" show-slider :data="tabLabels"></cube-tab-bar>
    <div class="tabArea">
      <transition name="moveR">
        <div class="sec1" v-show="selectedLabel == '昨天'">
          <tab-view1></tab-view1>
        </div>
      </transition>
      <transition name="moveR">
        <div class="sec2" v-show="selectedLabel == '本周'">
          <tab-view1></tab-view1>
        </div>
      </transition>
      <transition name="moveR">
        <div class="sec3" v-show="selectedLabel == '本月'">
          <tab-view1></tab-view1>
        </div>
      </transition>
      <transition name="moveR">
        <div class="sec4" v-show="selectedLabel == '本年'">
          <tab-view1></tab-view1>
        </div>
      </transition>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import TabView1 from "./tabView1.vue";
export default {
  data() {
    return {
      selectedLabel: "昨天",
      tabLabels: [
        {
          label: "昨天"
        },
        {
          label: "本周"
        },
        {
          label: "本月"
        },
        {
          label: "本年"
        }
      ]
    };
  },
  components: {
    TabView1
  },
  methods: {}
};
</script>
<style  scoped>
.moveR-enter,
.moveR-leave-to {
  opacity: 0;
}
.moveR-enter-to,
.moveR-leave {
  opacity: 1;
}
.moveR-enter-active,
.moveR-leave-active {
  transition: all 0.2s;
}

.cube-tab-bar {
  background-color: #fff;
}
.tabArea {
  width: 100%;
  display: flex;
  flex-direction: row;
}
.sec1 {
  width: 100%;
  padding-top: 5px;
  box-sizing: border-box;
}
.sec2 {
  width: 100%;
  padding-top: 5px;
  box-sizing: border-box;
}
.sec3 {
  width: 100%;
  padding-top: 5px;
  box-sizing: border-box;
}
.sec4 {
  width: 100%;
  padding-top: 5px;
  box-sizing: border-box;
}
</style>