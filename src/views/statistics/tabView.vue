<template>
  <div class="page">
    <div class="left-panel">
      <cube-scroll>
        <cube-tab-bar v-model="selectedLabel" :data="tabLabels" @change="changeHandler"></cube-tab-bar>
      </cube-scroll>
    </div>
    <div class="right-panel">
      <div class="right-area">
        <ul>
          <li class="row" :class="index===0?'row-top':''" v-for="(item,index) in dataList" :key="index">
            <div class="row-title">{{item.department}}</div>
            <div class="row-data1" @click="clickItem(1,item.department)">
              <div>超时</div>
              <div>{{item.overtime_count}}</div>
            </div>
            <div class="row-data2" @click="clickItem(2,item.department)">
              <div>未超时</div>
              <div>{{item.intime_count}}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  props: {
    dataList:null,
  },
  data() {
    return {
      selectedLabel: "新增单据",
      tabLabels: [
        {
          label: "新增单据"
        },
        {
          label: "进行单据"
        },
        {
          label: "完成单据"
        }
      ]
    };
  },
  mounted(){
    this.selectedLabel = "新增单据"
  },
  methods: {
    changeHandler(label) {
      this.$emit("tabChange", label)
    },
    clickItem(item,department) {
      let obj = {
        item:item,
        department:department
      }
      this.$emit("clickItem", obj)
    }
  }
};
</script>
<style>
.page .cube-tab-bar {
  display: flex;
  flex-direction: column;
}
.page .cube-tab {
  width: 100%;
  flex-basis: unset;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  color: #666;
  transition: all 0.3s ease-in;
}
.page .cube-tab.cube-tab_active {
  color: #666;
  font-size: 17px;
  background-color: #f2f2f2;
}
</style>
<style scoped >
.page {
  display: flex;
  width: 100vw;
}
.left-panel {
  flex: 1;
  height: 100%;
  background-color: #fff;
}

.right-panel {
  flex: 3;
  margin-left: 10px;
  margin-top: 5px;
  margin-right: 10px;
}
.right-area {
  width: 100%;
  background-color: #fff;
  padding: 5px;
  box-sizing: border-box;
  border-radius: 5px;
  overflow: hidden;
}
.ul {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
li {
  width: 100%;
  height: 50px;
  border-top: solid 1px #f3f3f3;
  display: flex;
}
.row-top {
  border-top: none;
}
.row-title {
  flex: 5;
  display: flex;
  justify-content: center;
  align-items: center;
}
.row-data1 {
  flex: 4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-left: solid 1px #f3f3f3;
  border-right: solid 1px #f3f3f3;
}
.row-data2 {
  flex: 4;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}
</style>