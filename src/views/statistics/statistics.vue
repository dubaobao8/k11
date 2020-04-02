<template>
  <div>
    <cube-tab-bar
      style="tabHeader"
      v-model="selectedLabel"
      show-slider
      :data="tabLabels"
    ></cube-tab-bar>
    <div class="sec1" v-show="selectedLabel == '昨天'">
      <tab-view1></tab-view1>
		</div>
		<div class="sec2" v-show="selectedLabel == '本周'">
      <tab-view1></tab-view1>
		</div>
		<div class="sec3" v-show="selectedLabel == '本月'">
      <tab-view1></tab-view1>
		</div>
		<div class="sec4" v-show="selectedLabel == '本年'">
      <tab-view1></tab-view1>
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
.cube-tab-bar {
  background-color: #fff;
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