<template>
  <div>
    <cube-tab-bar
      style="tabHeader"
      @change="changeDate"
      v-model="selectedLabel"
      show-slider
      :data="tabLabels"
    ></cube-tab-bar>
    <div class="tabArea">
      <div v-for="(item, index) in tabLabels" :key="index" class="tabItem">
        <!-- <transition name="moveR"> -->
          <div :class="'sec' + (index + 1)" v-if="selectedLabel == item.label">
            <tab-view @tabChange="tabChange" @clickItem="clickItem" :dataList="dataList"></tab-view>
          </div>
        <!-- </transition> -->
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import axios from "axios/index";
import TabView from "./tabView.vue";
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
      ],
      param: {
        type: 1,
        status: 1,
        port_type: 1
      },
      dataList: []
    };
  },
  components: {
    TabView
  },
  mounted() {
    let pageStatus = this.$route.query.pageStatus
    if(pageStatus) {
      this.$set(this.param, "port_type", pageStatus);
    }
    this.getDataList();
  },
  methods: {
    tabChange(item) {
      switch (item) {
        case "新增单据":
          this.$set(this.param, "status", 1);
          break;
        case "进行单据":
          this.$set(this.param, "status", 2);
          break;
        case "完成单据":
          this.$set(this.param, "status", 3);
      }
      this.getDataList();
    },
    clickItem(item){
      this.$router.push({
          path: "/completeStatistic",
          query: {
            type: this.param.type,
            status:this.param.status,
            over_time:item.item,
            department:item.department,
            port_type:this.param.port_type
          }
        });
    },
    getDataList() {
      axios({
        baseURL: this.$store.state.domain,
        url: "/api/Statistics/ThingReport",
        headers: {
          token: localStorage.getItem("token")
        },
        method: "POST",
        data: this.param
      })
        .then(res => {
          this.dataList = res.data.data;
        })
        .catch(err => {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "操作失败"
          }).show();
        });
    },
    changeDate(item) {
      switch (item) {
        case "昨天":
          this.$set(this.param, "type", 1);
          this.$set(this.param, "status", 1);
          break;
        case "本周":
          this.$set(this.param, "type", 2);
          this.$set(this.param, "status", 1);
          break;
        case "本月":
          this.$set(this.param, "type", 3);
          this.$set(this.param, "status", 1);
          break;
        case "本年":
          this.$set(this.param, "type", 4);
          this.$set(this.param, "status", 1);
          break;
      }
      this.getDataList();
    }
  }
};
</script>
<style  scoped>
/* .moveR-enter,
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
} */

.cube-tab-bar {
  background-color: #fff;
}
.tabArea {
  width: 100%;
  /* display: flex;
  flex-direction: row; */
}
.tabItem {
  width: 100%;
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