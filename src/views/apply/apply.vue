<template>
  <div class="home-page">
    <main>
      <div class="owh">
        <ul class="menu-items">
          <template v-for="(item, index) in menuList">
            <a
              :class="{unopened:!item.open}"
              :key="index"
              @click="showSelection(item)"
              class="m-wrp"
              v-if="item.show"
            >
              <div class="m-icon-wrp">
                <i :class="item.icon" :style="{color:item.color}" class="m-icon"></i>
              </div>
              <span class="m-title fs08">{{item.title}}</span>
            </a>
          </template>
        </ul>
      </div>
    </main>
    <tab-bar class="tab-bar" curTab="apply"></tab-bar>

    <!--<cube-popup :maskClosable="true" position="center" ref="select">-->
    <van-popup v-model="isShowSelection">
      <div class="selection">
        <a
          :key="select.name"
          @click="goto(select)"
          class="select-item"
          v-for="select in curSelection"
        >{{select.name}}</a>

        <a @click="isShowSelection = false" class="selection-close">关闭</a>
      </div>
    </van-popup>

    <router-link class="statistics" to="/statistics" v-if="showStatictics">
      <i class="fa fa-bar-chart-o"></i>
    </router-link>
  </div>
</template>

<script>
import tabBar from "../../components/tab-bar";
import menuList from "@/views/apply/menuList";
import wxconfig from "@/js/wxconfig";
import request from "@/api";

var wx;

export default {
  components: {
    tabBar
  },
  data() {
    return {
      navName: "审批",
      access: {
        patrol: ["保安部", "综合部"]
      },
      curSelection: [],
      menuList: menuList,
      isShowSelection: false
    };
  },
  computed: {
    showStatictics() {
      var status = localStorage.getItem("status");
      var is_look = localStorage.getItem("is_look");

      return status == 2 || status == 3 || is_look == 1 || is_look == 2;
    }
  },
  created() {
    // if (
    //   this.access.patrol.indexOf(localStorage.getItem("department")) !==
    //   -1
    // ) {
    //   this.menuList[2].show = true;
    // }
  },
  mounted() {
    wxconfig().then(res => {
      wx = res;
    });
  },
  methods: {
    async goto(item) {
      var res = await request.post("/api/Clean/UnPlanTask", {
        user_id: localStorage.getItem("user_id")
      });
      if (item.url.path === "/cleaning" || item.url === "/cleaning_detail") {
        if (item.url) {
          this.$router.push(item.url);
          localStorage.setItem("btnNum",3)
        } else if (item.handle && typeof this[item.handle] === "function") {
          this[item.handle]();
        }
      } else {
        if (res.data.data.status !== 1) {
          localStorage.setItem("btnNum",2)
          this.$router.push("/cleaning_detail");
        } else {
          this.$toast.fail("暂无权限");
        }
      }
    },
    showSelection(item) {
      if (item.open === false) {
        this.$createToast({
          txt: "暂未开放",
          type: "warn"
        }).show();
        return false;
      }

      if (item.path) {
        this.$router.push(item.path);
      }

      if (item.handle && typeof this[item.handle] === "function") {
        this[item.handle]();
      }

      if (item.selection && item.selection.length) {
        this.curSelection = item.selection;
        this.isShowSelection = true;
        // this.$refs.select.show();
      }
    },
    scanQR() {
      var _this = this;
      console.log("扫描工程单");
      wx.scanQRCode({
        desc: "扫描工程单",
        needResult: 1, // 默认为0，扫描结果由企业微信处理，1则直接返回扫描结果，
        scanType: ["qrCode"], // 可以指定扫二维码还是条形码（一维码），默认二者都有
        success: function(res) {
          console.log(res);
          // 回调
          var info = JSON.parse(res.resultStr);
          console.log(info);
          info.mode = "QR";
          _this.$router.push({
            path: "/engineer",
            query: info
          });
        },
        error: function(err) {
          console.log(err);
          if (err.errMsg.indexOf("function_not_exist") > 0) {
            alert("版本过低请升级");
          }
        }
      });
    },
    // 母婴室扫一扫
    scanMomInfantInit() {
      const _this = this;
      console.log("扫一扫母婴室");
      wx.scanQRCode({
        desc: "扫描母婴室二维码",
        needResult: 1,
        scanType: ["qrCode"],
        success(res) {
          console.log(res);
          // 回调
          var info = JSON.parse(res.resultStr);
          console.log(info);
          info.mode = "QR";
          _this.$router.push({
            path: "/mom",
            query: info
          });
        },
        error: function(err) {
          console.log(err);
          if (err.errMsg.indexOf("function_not_exist") > 0) {
            alert("版本过低请升级");
          }
        }
      });
    },
    // 进入profolio
    async profolioEntry() {
      var status = localStorage.getItem("status");
      var user_id = localStorage.getItem("user_id") * 1;

      try {
        var access_id = (await request.post("/api/profolio/LookUser")).data
          .data;
        console.log(access_id);
      } catch (e) {
        console.log(e);
        this.$toast.fail("验证身份失败！");
        return false;
      }

      if (status == 2 || status == 3 || access_id.indexOf(user_id) !== -1) {
        await this.$router.push("/profolio");
      } else {
        await this.$router.push(
          "/profolio_detail/" + localStorage.getItem("user_id")
        );
      }
    }
  }
};
</script>

<style scoped>
.menu-items {
  display: flex;
  text-align: center;
  margin-right: -1px;
  flex-wrap: wrap;
}

.m-wrp {
  flex: 0 0 33.333333333333%;
  height: 8rem;
  border-right: 1px solid #e5e5e5;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  box-sizing: border-box;
  padding: 1rem;
  line-height: 1.3;
}

.m-icon-wrp {
  height: 2.5rem;
}

.m-icon {
  font-size: 1.8rem;
  margin-bottom: 0.7rem;
}

.selection {
  width: 16rem;
  padding: 3rem 1rem 1rem;
  background-color: #fff;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.select-item {
  background-color: #dde0e5;
  padding: 0.8rem 1rem;
  width: 10rem;
  text-align: center;
  border-radius: 2px;
  color: #738081;
  margin-bottom: 1.5rem;
}

.select-item:active {
  background-color: #bec2c7;
}

.selection-close {
  display: block;
  padding: 0.5rem;
  width: 10rem;
  text-align: center;
}

.statistics {
  color: #fff;
  /*padding: 0.5rem 0.8rem;*/
  background: linear-gradient(135deg, #7adfff, #1e7cfb);
  box-shadow: 0 3px 13px #54cdff;
  position: fixed;
  right: 1.875rem;
  bottom: 6.875rem;
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  cursor: pointer;
}

.unopened {
  filter: grayscale(100%);
}

/*.statistics:active{*/
/*  background-color: #f2f4f9;*/
/*}*/
</style>

