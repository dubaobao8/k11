<template>
  <div class="position-relative">
    <main class="bg-white">
      <!-- 搜索框 -->
      <section class="search-wrp">
        <v-search :newSearchParam="newSearchParam" @select="onSelect" class="search" />
      </section>

      <section :class="{active:isPickerStatus}" class="action-bar horizontal-scroll">
        <div class="action-bar-main">
          <cube-scroll direction="horizontal" ref="scroll">
            <div class="action-content" v-if="isShowMultiAction">
              <template v-for="(action, actionIndex) in multiAction">
                <div
                  :style="{backgroundColor:action.color}"
                  @click="assignActionHandle(action.handle)"
                  class="action-item"
                >{{action.name}}</div>
              </template>
            </div>
          </cube-scroll>
        </div>
      </section>

      <!-- 列表 -->
      <section :class="{'scroll-wrp-action':isPickerStatus}" class="scroll-wrp">
        <v-list-reports
          :extra-params="extraParams"
          :is-picker-status="isPickerStatus"
          :picked-list="pickedList"
          :url="url"
          @load="onLoad"
          ref="reportList"
        />
      </section>
    </main>

    <!-- 悬浮按钮 -->
    <div
      :class="{active:isPickerStatus}"
      @click="changePickStatus"
      class="oneKey"
      v-show="isShowMultiAction"
    >
      <van-icon :name="isPickerStatus?'cross':'success'" />
    </div>
    <tab-bar class="tab-bar" curTab="approval" />
    <!--<v-popup ref="incidnetPopup">-->
    <!--  <div class="incidnetPopup">-->
    <!--    <p class="title-middle text-center">请填写审批意见及评星</p>-->
    <!--    <cube-input class="popup-input" placeholder="请填写审批意见" v-model="incidentApproveData.content"/>-->
    <!--    <cube-rate class="popup-star" v-model="incidentApproveData.star"/>-->
    <!--    <div class="popup-btns">-->
    <!--      <a @click="$refs.incidnetPopup.hide()" class="popup-btn popup-btn__cancel">取消</a>-->
    <!--      <a @click="" class="popup-btn popup-btn__primary">确定</a>-->
    <!--    </div>-->
    <!--  </div>-->
    <!--</v-popup>-->
  </div>
</template>

<script>
import VSearch from "@/components/search/v-search";
import TabBar from "@/components/tab-bar";
import VListReports from "@/components/srcollList/v-list-reports";
import bus from "@/js/event";
import {
  AgreeMultipleIncidentAndPatrolReports,
  RejectMultipleIncidentAndPatrolReports
} from "@/api/approval/approval";
import VPopup from "@/components/layer/v-popup";
import { mapMutations } from "vuex";

var multiActionMap = {
  "1": [
    {
      name: "一键同意",
      handle: "incidentMultiAgree",
      color: "#428cff"
    },
    {
      name: "一键拒绝",
      handle: "incidentMultiReject",
      color: "#ff0349"
    }
  ],
  "2": [
    {
      name: "一键同意",
      handle: "incidentMultiAgree",
      color: "#428cff"
    },
    {
      name: "一键拒绝",
      handle: "incidentMultiReject",
      color: "#ff0349"
    }
  ]
};

export default {
  name: "approval",
  components: { VPopup, VListReports, VSearch, TabBar },
  data() {
    return {
      url: "/api/News/WaitAppReport",
      extraParams: {},
      isPickerStatus: false,
      isSearchMode: false,
      ReportType: 0,
      pickedList: [],
      multiActionMap,
      incidentApproveData: {
        star: 0,
        content: ""
      },
      newSearchParam: {}
    };
  },
  methods: {
    ...mapMutations(["addSearchParam", "deleteSearchParam"]),
    // 列表加载完毕
    onLoad() {
      bus.$emit("getUnRead");
    },
    // 多选模式
    changePickStatus() {
      if (this.isPickerStatus) {
        this.isPickerStatus = false;
        this.$refs.reportList.clearAllPicked();
        this.$toast({
          message: "已退出多选模式",
          position: "bottom",
          duration: 1500
        });
      } else {
        this.isPickerStatus = true;
        this.$toast({
          message: "已进入多选模式",
          position: "bottom",
          duration: 1500
        });
      }
    },
    // 搜索框选择完毕
    onSelect(data) {
      let searchParam = {
        page: "approvalPage"
      };
      this.ReportType = data.type;
      if (!data.status && !data.text && !data.type) {
        this.url = "/api/News/WaitAppReport";
        this.isSearchMode = false;
        this.extraParams = {};
        searchParam.param = this.extraParams;
        this.deleteSearchParam(searchParam);
      } else {
        this.url = "/api/News/SearchCheckReport";
        this.isSearchMode = true;
        this.extraParams = {
          port_type: data.type * 1,
          status: data.status ? data.status : 0,
          content: data.text,
          selectedText: data.selectedText
        };
        searchParam.param = this.extraParams;
      }
      this.addSearchParam(searchParam);
    },
    // 分发多选操作的操作函数
    assignActionHandle(handle) {
      typeof this[handle] === "function" && this[handle]();
    },

    // 一键同意事件报告，巡查报告审批
    incidentMultiAgree() {
      var _this = this;
      this.showApprovalBox()
        .then(res => {
          AgreeMultipleIncidentAndPatrolReports(
            res.content,
            res.star,
            this.pickedList
          )
            .then(res => {
              _this.$toast.success("操作成功！");
              setTimeout(() => {
                location.reload();
              }, 500);
            })
            .catch(err => {
              console.log(err);
              _this.$toast.fail("操作失败！");
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    // 一键拒绝事件报告，巡查报告
    incidentMultiReject() {
      var _this = this;
      this.showApprovalBox()
        .then(res => {
          RejectMultipleIncidentAndPatrolReports(
            res.content,
            res.star,
            this.pickedList
          )
            .then(res => {
              _this.$toast.success("操作成功！");
              setTimeout(() => {
                location.reload();
              }, 500);
            })
            .catch(err => {
              console.log(err);
              _this.$toast.fail("操作失败！");
            });
        })
        .catch(err => {
          console.log(err);
        });
    },

    // 弹出审批确认框
    async showApprovalBox() {
      if (!this.pickedList.length) {
        this.$toast("请至少选择一个单据");
        return Promise.reject("未选择单据");
      }
      var _this = this;
      return await new Promise((resolve, reject) => {
        _this.incidentApproveData.content = "";
        _this.incidentApproveData.star = 0;
        this.$createDialog(
          {
            type: "confirm",
            onConfirm: event => {
              if (!_this.incidentApproveData.content) {
                this.$toast("请填写审批意见！");
                reject();
                return false;
              } else {
                resolve({
                  content: _this.incidentApproveData.content,
                  star: _this.incidentApproveData.star
                });
              }
            }
          },
          h => {
            var title = h(
              "p",
              { class: { mt20: true }, slot: "title" },
              "请填写审批意见及评星"
            );

            var content_main = [];
            content_main.push(
              h("cube-input", {
                class: {
                  ml20: true,
                  mr20: true,
                  mt15: true
                },
                props: {
                  placeholder: "请填写审批意见",
                  value: _this.incidentApproveData.content
                },
                on: {
                  input(value) {
                    _this.incidentApproveData.content = value;
                  }
                }
              })
            );

            if (localStorage.getItem("status") == 3) {
              content_main.push(
                h("cube-rate", {
                  style: {
                    margin: "1rem 2rem",
                    justifyContent: "space-between",
                    display: "flex"
                  },
                  on: {
                    input(value) {
                      _this.incidentApproveData.star = value;
                    }
                  },
                  props: {
                    value: _this.incidentApproveData.star
                  }
                })
              );
            }

            var content = h("div", { slot: "content" }, content_main);
            return [title, content];
          }
        ).show();
      });
    }
  },
  computed: {
    isShowMultiAction() {
      return (
        !!multiActionMap[this.ReportType] &&
        !!multiActionMap[this.ReportType].length
      );
    },
    multiAction() {
      return multiActionMap[this.ReportType];
    }
  },
  mounted() {
    let searhList = this.$store.state.searchParamList;
    searhList.forEach(item => {
      if (item && item.page == "approvalPage") {
        let param = {
          type: item.param.port_type,
          status: item.param.status,
          text: item.param.content,
          selectedText: item.param.selectedText
        };
        this.newSearchParam = param;
      }
    });
  }
};
</script>

<style scoped>
.scroll-wrp {
  height: calc(100vh - 6.5rem);
  transition: 0.3s all;
  height: calc(100vh - 6.5rem - constant(safe-area-inset-bottom));
  height: calc(100vh - 6.5rem - env(safe-area-inset-bottom));
}

.scroll-wrp-action {
  height: calc(100vh - 9rem);
  height: calc(100vh - 9rem - constant(safe-area-inset-bottom));
  height: calc(100vh - 9rem - env(safe-area-inset-bottom));
}

.scroll-wrp .list-wrp {
  padding-bottom: 3rem;
}

.search-wrp {
  height: 3.5rem;
}

.search {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  max-width: 620px;
  margin: 0 auto;
}

.oneKey {
  position: fixed;
  bottom: 5.2rem;
  right: 2.2rem;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #428cff;
  color: #fff;
  font-size: 1.4rem;
  box-shadow: 0 3px 10px #428cff, inset 0 -3px 13px #2a7dff;
  cursor: pointer;
  z-index: 100;
  transition: 0.3s transform;
  text-shadow: 0 2px 8px #0366ff;
}

.oneKey.active {
  background-color: #ff426e;
  box-shadow: 0 -3px 10px #ff4276, inset 0 3px 13px #ff2a3e;
  text-shadow: 0 -2px 8px #ff0349;
  transform: rotate(180deg);
}

.action-bar {
  height: 0;
  overflow: hidden;
  transition: 0.3s all;
}

.action-bar.active {
  height: 2.5rem;
}

.action-bar-main {
  position: fixed;
  top: 3.5rem;
  left: 0;
  right: 0;
  background-color: #fafafa;
  max-width: 620px;
  margin: 0 auto;
  height: 0;
  overflow: hidden;
  transition: 0.3s all;
  z-index: 99;
}

.action-bar.active .action-bar-main {
  height: 2.5rem;
}

.action-content {
  line-height: 2.5rem;
  height: 2.5rem;
  vertical-align: middle;
  white-space: nowrap;
  display: inline-block;
  padding-left: 10px;
  text-align: right;
  min-width: 100%;
  box-sizing: border-box;
}

.action-item {
  display: inline-block;
  font-size: 0.875rem;
  padding: 0.4rem 0.6rem;
  color: #fff;
  margin-right: 10px;
  border-radius: 4px;
  line-height: 1rem;
}

.action-item.red {
  background-color: #ff0349;
}

.action-item.blue {
  background-color: #428cff;
}

/*.incidnetPopup {*/
/*  width: 18rem;*/
/*  padding-top: 20px;*/
/*  background-color: #fff;*/
/*  border-radius: 2px;*/
/*}*/

/*.popup-input {*/
/*  margin: 0.875rem 1rem 1rem;*/
/*}*/

/*.popup-star {*/
/*  margin: 0 2rem;*/
/*  justify-content: space-between;*/
/*  display: flex;*/
/*}*/

/*.popup-btns {*/
/*  margin-top: 1.2rem;*/
/*  display: flex;*/
/*}*/

/*.popup-btn {*/
/*  border-top: 1px solid #ebebeb;*/
/*  flex: 1;*/
/*  padding: 0.95rem 0.7rem;*/
/*  text-align: center;*/
/*  font-size: 1rem;*/
/*}*/

/*.popup-btn + .popup-btn {*/
/*  border-left: 1px solid #ebebeb;*/
/*}*/

/*.popup-btn__cancel {*/
/*  color: #999;*/
/*}*/

/*.popup-btn__primary {*/
/*  color: #2a7dff;*/
/*}*/
</style>

<style>
.horizontal-scroll .cube-scroll-content {
  display: inline-block;
  min-width: 100%;
}
</style>
