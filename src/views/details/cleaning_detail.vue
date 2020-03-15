<template>
  <div>
    <!-- <d-business-card :info="user_info" class="margin20"/>
    <section class="margin20">
      <p class="fs1-2 fw-b cr-black-blue mb15">任务列表</p>
      <div class="divider-1 mt15 mb15"></div>
      <div :key="index" v-for="(item,index) in info_data.task">
        <d-info-item :value="item.task_name" class="mb10" title="任务名称"/>
        <d-info-item :value="item.task_num" class="mb10" title="任务总次数"/>
        <d-info-item :value="item.start_time*1000 | transDate" class="mb10" title="开始日期"/>
        <d-info-item :value="item.end_time*1000 | transDate" class="mb10" title="结束日期"/>
        <div class="divider-1 mt15 mb15"></div>
      </div>
    </section>-->
    <section>
      <!-- <p class="fs1-2 fw-b cr-black-blue">任务安排</p> -->
      <v-calendar
        :setting="setting"
        :setting2="setting2"
        :show-following="info_data.status === 3 && info_data.is_plan === 1"
        :tasklist="tasklist"
        :modify="info_data.status === 7 && info_data.is_plan === 1"
        :can-add-commment="info_data.status === 4 && info_data.is_work === 1"
        :update="(info_data.status === 2  || info_data.status === 3 )&& info_data.is_work === 1"
        @submit="onSubmitClean"
        ref="calendar"
      />
    </section>

    <div v-if="canIApproval">
      <a @click="agreeApproval" class="form-submit-block">同意</a>
      <a @click="rejectApproval" class="form-submit-block form-submit-block__reject">拒绝</a>
    </div>

    <a
      @click="onFollowDone"
      class="form-submit-block"
      v-if="(info_data.status === 3 || info_data.status === 7) && !isPc()"
    >跟进完成</a>
    <p v-if="isPc()" class="nothing text-center mb30">请在手机上进行跟进</p>

    <div v-if="canICheck">
      <a class="form-submit-block" @click="onCheckAgree">通过</a>
      <a class="form-submit-block form-submit-block__reject" @click="onCheckRefuse">不通过</a>
    </div>
  </div>
</template>

<script>
import VCalendar from "@/components/common/v-calendar";
import request from "@/api";
import DBusinessCard from "@/components/details/d-business-card";
import DInfoItem from "@/components/details/d-info-item";
import moment from "moment";
import { isPc } from "@/util/util";

export default {
  name: "cleaning_detail",
  components: { DInfoItem, DBusinessCard, VCalendar },
  data() {
    return {
      user_info: {
        report_name: "清洁大做",
        report_type: "clean",
        report_status: "1"
      },
      port_id: this.$route.params.id,
      info_data: {
        status: 0,
        task: [{}]
      },
      tasklist: [],
      setting: false,
      // 第三个按钮 清洁日里更新
      setting2: false
    };
  },
  methods: {
    getPageData() {
      let port_id = this.$route.params.id;
      request.post("/api/clean/TimeTaskList").then(res => {
        let data = res.data.data;
        // this.info_data = data;
        // let info = this.user_info;
        // info.user_name = data.user.username;
        // info.user_avatar = data.user.user_logo;
        // info.report_status = data.status;
        // info.user_id = data.user.userid;
        // info.department = data.user.department;
        // info.position = data.user.position;

        // 生成任务表
        // this.tasklist = data.map(item => {
        //   return {
        //     task_name: item.task_name,
        //     clean_type: item.clean_type,
        //     clean_content: item.clean_content,
        //     task_id: item.id,
        //     start_date: moment(item.start_time * 1000).format('YYYY/MM/DD'),
        //     end_date: moment(item.end_time * 1000).format('YYYY/MM/DD'),
        //     remain_count: 0,
        //     exec_count: item.task_num,submit
        //     exec_date: item.plan
        //   }
        // });
        this.tasklist = data;
        setTimeout(() => {
          this.$refs.calendar.onResponse();
        }, 100);
      });
    },
    onSubmitClean(obj) {
      // let tasklist = this.tasklist;
      // let error = "";
      // let inComplete = tasklist.some(item => {
      //   if (item.remain_count) {
      //     error = `【${item.task_name}】未安排完整`;
      //     return true
      //   }
      // });

      // if (inComplete) {
      //   this.$notify(error);
      //   return false
      // }

      // let data = {
      //   port_id: this.port_id,
      //   taskList: tasklist
      // };

      request
        .post("/api/clean/CreateTimeTask", obj)
        .then(res => {
          this.ex.alert("提示", "提交成功").then(res => {
            location.reload();
          });
        })
        .catch(e => {
          this.ex.alert("提示", "提交失败", false);
        });
    },
    agreeApproval() {
      this.ex.confirm("提示", "确定同意该清洁大做安排？").then(res => {
        request
          .post("/api/clean/AgreeCleanTask", { port_id: this.port_id })
          .then(res => {
            this.ex.alert("提示", "操作成功！").then(res => {
              location.reload();
            });
          })
          .catch(e => {
            this.ex.alert("提示", "操作失败！");
          });
      });
    },
    rejectApproval() {
      this.ex
        .prompt("提示", "确定拒绝该清洁大做安排？", "请输入理由")
        .then(res => {
          if (!res) {
            this.$toast.fail("请输入理由");
            return false;
          }
          let data = {
            port_id: this.port_id,
            content: res
          };
          request
            .post("/api/clean/RefuseCleanTask", data)
            .then(res => {
              this.ex.alert("提示", "操作成功！").then(res => {
                location.reload();
              });
            })
            .catch(e => {
              this.ex.alert("提示", "操作失败！", false);
            });
        });
    },
    async onFollowDone() {
      await this.ex.confirm("提示", "请确定已完成跟进");
      try {
        await request.post("/api/clean/FinishFollow", {
          port_id: this.port_id
        });
        await this.ex.alert("提示", "操作成功！");
        location.reload();
      } catch (e) {
        await this.ex.alert("提示", "操作失败！", false);
      }
    },
    async onCheckAgree() {
      await this.ex.confirm("提示", "确定通过？");
      try {
        await request.post("/api/clean/CheckAgree", { port_id: this.port_id });
        await this.ex.alert("提示", "操作成功！");
        location.reload();
      } catch (e) {
        await this.ex.alert("提示", "操作失败！", false);
      }
    },
    async onCheckRefuse() {
      await this.ex.confirm("提示", "确定不通过？");
      try {
        await request.post("/api/clean/CheckRefuse", { port_id: this.port_id });
        await this.ex.alert("提示", "操作成功！");
        location.reload();
      } catch (e) {
        await this.ex.alert("提示", "操作失败！", false);
      }
    },
    isPc() {
      return isPc();
    }
  },
  computed: {
    canIApproval() {
      return this.info_data.is_work === 1 && this.info_data.status === 2;
    },
    canICheck() {
      return this.info_data.is_work === 1 && this.info_data.status === 6;
    }
  },
  
  async mounted() {
    let btnStatus = localStorage.getItem("btnNum")
    if(btnStatus === "3") {
      this.setting2 = true
    } else {
      this.setting2 = false
    }
    var res = await request.post("/api/Clean/UnPlanTask", {
      user_id: localStorage.getItem("user_id")
    });
    if (res.data.data.status === 1) {
      this.setting = false;
      this.getPageData();
    } else {
      this.setting = true;
      this.tasklist = res.data.data.task_list;
      setTimeout(() => {
        this.$refs.calendar.onResponse();
      }, 100);
    }
  }
};
</script>

<style scoped>
</style>
