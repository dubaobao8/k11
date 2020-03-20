<template>
  <div class="calendar-wrp">
    <section class="calendar-title">
      <p class="calendar-title-date">{{select.year()}}年{{select.month() +1}}月{{select.date()}}日</p>
      <div class="calendar-title-right">
        <span :class="{'today':isSameDay(current,select)}" @click="BackToToday" class="jin">今</span>
        <div class="calendar-title-arrow">
          <van-icon @click="prevMonth" class="arrow-icon" name="arrow-left" />
          <van-icon @click="nextMonth" class="arrow-icon" name="arrow" />
        </div>
      </div>
    </section>
    <section class="calendar-table" v-if="!setting || setting2">
      <ul class="calendar-table-head">
        <li :key="week" v-for="week in days">{{week}}</li>
      </ul>

      <ol class="calendar-table-body">
        <li
          :class="setDayClass(day)"
          :key="day.moment.valueOf()"
          @click="setDate(day.moment)"
          v-for="(day,day_index) in calendar"
        >
          <span class="calendar-day-text">{{day.moment.date()}}</span>
          <span
            :class="{'curdate':isSameDay(current,day.moment)}"
            class="selected"
            v-if="isSameDay(current,day.moment)"
          ></span>
          <span
            :class="{'curdate':isSameDay(current,day.moment)}"
            class="selected2"
            v-if="day.moment._d - new Date()>=0 && day.status ===1"
          ></span>
        </li>
      </ol>
    </section>
    <section class="calendar-table" v-if="setting && !setting2">
      <ul class="calendar-table-head">
        <li :key="week" v-for="week in days">{{week}}</li>
      </ul>

      <ol class="calendar-table-body">
        <li
          :class="setDayClass2(day)"
          :key="day.moment.valueOf()"
          @click="setDate(day.moment)"
          v-for="(day,day_index) in calendar"
        >
          <span class="calendar-day-text">{{day.moment.date()}}</span>
          <span
            :class="{'curdate':isSameDay(current,day.moment)}"
            class="selected"
            v-if="isSameDay(current,day.moment)"
          ></span>
        </li>
      </ol>
    </section>
    <!-- 图例 -->
    <!-- <section v-if="false">
      <p class="fs08 crbbb ml20 mb10">图例</p>
      <ul class="dpfx calendar-table-body mb20 fxjar">
        <div class="dpfx fxdc fxac mr15 ml15">
          <li class="curdate" style="margin:0">
            {{current.date()}}
            <span class="selected curdate"></span>
          </li>
          <p class="fs07 cr-grey mt10">今日</p>
        </div>
        <div class="dpfx fxdc fxac mr15 ml15">
          <li class style="margin:0">
            {{current.date()}}
            <span class="selected"></span>
          </li>
          <p class="fs07 cr-grey mt10">选中</p>
        </div>
        <div class="dpfx fxdc fxac mr15 ml15">
          <li class="tobe-assign" style="margin:0">{{current.date()}}</li>
          <p class="fs07 cr-grey mt10">未安排</p>
        </div>
        <div class="dpfx fxdc fxac mr15 ml15">
          <li class="tobe-assign assigined" style="margin:0">
            <span class="calendar-day-text">{{current.date()}}</span>
          </li>
          <p class="fs07 cr-grey mt10">已安排</p>
        </div>
      </ul>
    </section>-->

    <!-- 任务 -->
    <section class="cr3" v-if="!modify">
      <!-- 待安排的任务 （当日待安排的任务） -->
      <!-- <div v-if="setting || (update  && CanBeUpdate())"> -->
      <!-- <div v-if="CanBeUpdate()"> -->
      <div>
        <p
          class="ml5 mr5 mt15 fw-b fs1-04"
          style="color: #484952;"
          v-if="noTaskList&&noTaskList.length"
        >当日待安排的任务</p>
        <ul>
          <li
            :key="task.id"
            class="task-box ml5 mr5 mt15 fs08"
            v-for="(task,task_index) in noTaskList"
          >
            <p class="mb15">
              <span>任务名称：</span>
              <span>{{task.task_name}}</span>
            </p>
            <p class="mb15">
              <span>发布人：</span>
              <span>{{task.username}}</span>
            </p>
            <p class="mb15">工作类型：{{task.clean_type}}</p>
            <p class="mb15">工作内容：{{task.clean_content}}</p>
            <p class="mb10">
              <span>当前任务可安排次数：</span>
              <span>{{task.totalCount}}</span>
            </p>
            <p v-if="changeStatus || setting">
              <span>当日次数：</span>
              <v-counter
                :max="task.task_num"
                :value="task.count"
                @change="onSetCount(task,$event)"
              />
            </p>
          </li>
        </ul>
      </div>
      <a
        @click="settingNoTask"
        class="form-submit-block"
        style="margin: 30px 10px 0;"
        v-if="setting && noTaskList.length > 0"
      >安排任务提交</a>

      <!-- 已安排的任务 （当日任务） -->
      <div v-if="isAssignToday">
        <p class="ml5 mr5 mt15 fw-b fs1-04" style="color: #484952;">当日已安排的任务</p>
        <ul>
          <li :key="task.id" class="task-box ml5 mr5 mt15 cr3 fs08" v-for="task in alTaskList">
            <div class="mb10" style="line-height: 25px;display:flex">
              <div style="flex:1">任务名称：</div>
              <div style="flex:3">
                {{task.task.task_name}}
              <span
                :class="setDayClass3(task.status)"
              >{{task.status_name}}</span>
              </div>
              
            </div>
            <p class="mb10">发布人：{{task.task.user.username}}</p>
            <p class="mb10">工作类型：{{task.task.clean_type}}</p>
            <p class="mb10">工作内容：{{task.task.clean_content}}</p>
            <p>
              <span>当日安排次数：{{task.task.task_num}}</span>
            </p>
            <p class="mt15" v-if="changeStatus">
              <v-picker
                title="修改日期"
                type="datetime"
                @select:allData="(date)=>{selectDateTime(date,task)}"
              />
            </p>
            <div class="mt20 follow" v-if=" task.reason.length>0">
              <p class="fw-b fs09 cr-black-blue mb10">驳回批注</p>
              <div v-for="item in task.reason" :key="item.id">
                <p class="mb10">批注：{{item.content}}</p>
                <div style="display: flex;justify-content: flex-end; margin-right: 10px;">
                  -----
                  <span class="mb10" style="margin-right: 15px;">{{item.create_time}}</span>
                  <span class="mb10">{{item.user.username}}</span>
                </div>
              </div>
            </div>
            <!-- 添加跟进记录 -->
            <div
              class="mt20 follow"
              v-if="task.id&&setting&&(task.status === 1||task.status === 4) && !isPc()&&submitBtnStatus"
            >
              <p class="fw-b fs09 cr-black-blue">添加跟进记录</p>
              <div class="form-group">
                <v-input required title="跟进内容" v-model="task.content" />
                <v-file-container
                  :files="task.files"
                  :only-camera="true"
                  auto_del
                  auto_upload
                  required
                  @push:file="updateView"
                  @push:updateSuccess="updateSuccess"
                  @del:file="deleteFile"
                />
              </div>
              <a @click="submitFollow(task)" class="form-submit-block" style="margin: 0">提交当日跟进记录</a>
            </div>

            <!-- 已添加的跟进记录 -->
            <div class="mt20 follow" v-if="task.follow && task.follow.length">
              <p class="fw-b fs09 cr-black-blue">已添加的跟进记录</p>
              <div v-for="(item,index) in task.follow">
                <d-info-item :value="item.create_time | transTime" class="mt15" title="跟进时间" />
                <d-info-item :value="item.content" class="mt15" title="跟进内容" />
                <d-info-item class="mt10" title="附件" v-if="item.files&&item.files.length" />
                <v-file-preview :files="item.files" @change:thumb:raw="onFileChange(item,$event)" />

                <div v-if="item.curImg && task.status === 3">
                  <label class="add-commemt">
                    <p class="add-commemt__title">对附件【{{item.curImg.title}}】添加备注</p>
                    <textarea
                      class="add-commemt__field"
                      placeholder="请输入备注"
                      rows="2"
                      type="text"
                      v-model="item.curImgComment"
                    />
                  </label>
                  <a
                    @click="onAddComment(item,item.curImgComment)"
                    class="form-submit-block"
                    style="margin: 15px 0;background-color:#2196f3;"
                  >提交当前附件备注</a>
                </div>
                <div class="divider-1 mt20" v-if="index !== task.follow.length-1"></div>
              </div>
              <div v-if="ruleStatus === 0&&task.status === 2">
                <a @click="agreeApproval(task.id)" class="form-submit-block">同意</a>
                <a
                  @click="rejectApproval(task.id)"
                  class="form-submit-block form-submit-block__reject"
                >拒绝</a>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- 修改报告 -->
    <div v-if="cur_modify.assigned && modify">
      <p class="fs1-2 fw-b cr-black-blue ml15 mt15 ml15 mb10">修改跟进</p>
      <ul class="modify-list" v-if="cur_modify.tobelist.length">
        <li
          class="modify-list-item form-group"
          v-for="(task,task_index) in cur_modify.tobelist"
          :key="task.task_id + select.valueOf()"
          v-if="task.plan_id"
        >
          <p class="mb10 info-item">任务名称：{{task.task_name}}</p>
          <p class="mb10 info-item">工作类型：{{task.clean_type}}</p>
          <p class="mb10 info-item">工作内容：{{task.clean_content}}</p>

          <div v-for="(item,index) in task.follow">
            <v-detail-title
              :title="'跟进记录' + (index + 1)"
              del-text="删除跟进"
              @del="onDelFollow(task.follow,item,index)"
            />
            <v-input required title="跟进内容" v-model="item.content" />
            <v-file-container
              style="border-bottom: none;"
              :files="item.files"
              :only-camera="true"
              required
            />
            <div class="divider-1" v-if="task.follow.length-1 !== index"></div>
          </div>
          <action-line class="ml15" @click="onAddFollow(task.follow,task)">添加跟进</action-line>
        </li>
      </ul>
      <div class="form-submit-block" @click="onMofifySumit">提交当日修改</div>
    </div>

    <!-- 修改清洁大做 -->
    <a
      @click="chageUpdateChangeStatus"
      class="form-submit-block"
      style="margin: 30px 10px 0;background-color:rgb(0,183,195);"
      v-if="ruleStatus === 0&& showUpdateBtn && (noTaskList.length>0||alTaskList.length>0)"
    >修改清洁大做</a>
    <!-- 提交清洁大做 -->
    <a
      @click="submitCleanUpdate"
      class="form-submit-block"
      style="margin: 30px 10px 0;"
      v-if="ruleStatus === 0&& submitStatus"
    >提交清洁大做</a>
  </div>
</template>

<script>
import moment from "moment";
import VCounter from "@/components/common/v-counter";
import VInput from "@/components/form/v-input";
import VFileContainer from "@/components/form/v-file-container";
import DInfoItem from "@/components/details/d-info-item";
import request from "@/api";
import VFilePreview from "@/components/details/v-file-preview";
import _ from "lodash";
import { isPc } from "@/util/util";
import VDetailTitle from "@/components/form/v-detail-title";
import ActionLine from "@/components/form/action-line";
import VPicker from "@/components/form/v-picker";

export default {
  name: "v-calendar",
  components: {
    ActionLine,
    VDetailTitle,
    VFilePreview,
    DInfoItem,
    VFileContainer,
    VInput,
    VCounter,
    VPicker
  },
  props: {
    tasklist: null,
    // 是否可以安排任务
    setting: {
      type: Boolean,
      defaule: false
    },
    setting2: {
      type: Boolean,
      defaule: false
    },
    // 是否可以提交跟进
    showFollowing: {
      type: Boolean,
      default: false
    },
    update: {
      type: Boolean,
      default: false
    },
    // 是否可以添加图片评论
    canAddCommment: {
      type: Boolean,
      default: false
    },
    // 是否驳回后修改状态
    modify: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      calendar: [],
      dateList: [],
      select: moment(),
      current: moment(),
      noTaskList: [],
      alTaskList: [],
      ruleStatus: null,
      changeStatus: false,
      submitStatus: false,
      showUpdateBtn: false,
      cur_calendar: {},
      cur_modify: {
        tobelist: []
      },
      submitBtnStatus: false
    };
  },
  filter: {},
  methods: {
    updateView() {
      this.$forceUpdate();
    },
    updateSuccess() {
      this.$forceUpdate();
    },
    deleteFile() {
      this.$forceUpdate();
    },
    settingNoTask() {
      this.noTaskList.forEach(element => {
        (element.clean_id = element.id),
          (element.plan_time = moment(this.select).format("YYYY/MM/DD"));
      });
      let obj = {
        al_task: [],
        no_task: this.noTaskList
      };
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
    agreeApproval(id) {
      this.ex.confirm("提示", "确定同意该清洁大做安排？").then(res => {
        request
          .post("/api/clean/AgreeCleanTask", { plan_id: id })
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
    rejectApproval(id) {
      this.ex
        .prompt("提示", "确定拒绝该清洁大做安排？", "请输入理由")
        .then(res => {
          if (!res) {
            this.$toast.fail("请输入理由");
            return false;
          }
          let data = {
            plan_id: id,
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
    /**
     * @desc 判断选中日是否可以修改清洁任务
     * @return {boolean}
     */
    CanBeUpdate() {
      let deadline = this.select.clone().startOf("days");
      return moment().isBefore(deadline);
    },
    chageUpdateChangeStatus() {
      this.changeStatus = true;
      this.submitStatus = true;
    },
    selectDateTime(date, task) {
      task.selectDate = moment(date.date).format("YYYY/MM/DD");
    },

    submitCleanUpdate() {
      let list1 = [];
      this.alTaskList.forEach(ele => {
        ele.plan_id = ele.id;
        ele.clean_id = ele.task.id;
        ele.count = ele.task.count;
        ele.update_time = ele.selectDate;
        list1.push(ele);
      });
      let list2 = [];
      this.noTaskList.forEach(ele => {
        ele.clean_id = ele.id;
        ele.count = ele.count;
        ele.plan_time = moment(this.select).format("YYYY/MM/DD");
        list2.push(ele);
      });
      let obj = {
        al_task: list1,
        no_task: list2
      };
      this.$emit("submit", obj);
    },
    setCalendar(targetMoment) {
      let firstDate;
      if (!arguments.length) {
        firstDate = moment().date(1);
      } else {
        firstDate = targetMoment.clone().date(1);
      }

      let start_date;
      let first_weekday = firstDate.isoWeekday();

      if (first_weekday == 7) {
        start_date = firstDate;
      } else {
        start_date = firstDate.subtract(first_weekday, "days");
      }

      let days = [];
      for (let i = 0; i < 35; i += 1) {
        days.push({
          moment: start_date.clone(),
          tobelist: [],
          assigned: []
        });
        start_date.add(1, "days");
      }
      this.calendar = days;
      this.attachToDate();
    },
    setDate(day) {
      this.submitStatus = false;
      this.changeStatus = false;
      this.noTaskList = [];
      this.alTaskList = [];
      this.select = day;
      this.submitBtnStatus = day._d <= new Date();
      if (moment().add("days", 1) <= moment(day)) {
        this.showUpdateBtn = true;
      } else {
        this.showUpdateBtn = false;
      }
      let param = moment(day).format("YYYY/MM/DD");
      request.post("/api/clean/CleanDetail", { date: param }).then(res => {
        let data = res.data.data;
        if (data.is_work === 1) {
          this.ruleStatus = 0;
        } else if (data.is_plan === 0) {
          this.ruleStatus = 1;
        }
        this.noTaskList = data.no_task;
        this.noTaskList.forEach(element => {
          element.count = 0;
          element.totalCount = element.task_num;
        });
        this.alTaskList = data.al_task;
        this.alTaskList.forEach(element => {
          element.selectDate = "";
          element.content = "";
          element.files = [];
          element.reason.forEach(item => {
            item.create_time = moment(item.create_time).format('YYYY-MM-DD HH:mm:ss')
          });
          element.follow.forEach(item => {
            item.curImg = item.files[0];
          });
        });
      });

      // let date;
      // if (!arguments.length) {
      //   date = moment();
      // } else {
      //   date = day;
      // }

      // let old = this.select.clone();

      // if (!old.isSame(this.select, "month")) {
      //   this.setCalendar(date);
      // }

      // this.cur_calendar = this.calendar.find(item =>
      //   this.isSameDay(this.select, item.moment)
      // );
      // this.cur_modify = _.cloneDeep(this.cur_calendar);

      // this.cur_modify.tobelist.forEach(task => {
      //   task.follow &&7
      //     task.follow.forEach(follow => {
      //       follow.files &&
      //         follow.files.forEach(item => {
      //           item.file_img = item.file_url;
      //           item.image = item.file_img;
      //           item.file_desc = "已上传";
      //           item.file_img = item.file_url;
      //           item.file_name = item.title;
      //           item.file_title = item.title;
      //           item.need_reupload = false;
      //         });
      //     });
      // });
    },
    prevMonth() {
      let day = this.select.clone().subtract(1, "month");
      let date;
        if (!arguments.length) {
          date = moment();
        } else {
          date = day;
        }

        let old = this.select.clone();

        this.select = date;

        if (!old.isSame(this.select, 'month')) {
          this.setCalendar(date);
        }

        this.cur_calendar = this.calendar.find(item => this.isSameDay(this.select, item.moment));
        this.cur_modify = _.cloneDeep(this.cur_calendar);

        this.cur_modify.tobelist.forEach(task => {
          task.follow && task.follow.forEach(follow => {
            follow.files && follow.files.forEach(item => {
              item.file_img = item.file_url;
              item.image = item.file_img;
              item.file_desc = "已上传";
              item.file_img = item.file_url;
              item.file_name = item.title;
              item.file_title = item.title;
              item.need_reupload = false;
            })
          })
        })
    },
    nextMonth() {
      let day = this.select.clone().add(1, "month");
      let date;
        if (!arguments.length) {
          date = moment();
        } else {
          date = day;
        }

        let old = this.select.clone();

        this.select = date;

        if (!old.isSame(this.select, 'month')) {
          this.setCalendar(date);
        }

        this.cur_calendar = this.calendar.find(item => this.isSameDay(this.select, item.moment));
        this.cur_modify = _.cloneDeep(this.cur_calendar);

        this.cur_modify.tobelist.forEach(task => {
          task.follow && task.follow.forEach(follow => {
            follow.files && follow.files.forEach(item => {
              item.file_img = item.file_url;
              item.image = item.file_img;
              item.file_desc = "已上传";
              item.file_img = item.file_url;
              item.file_name = item.title;
              item.file_title = item.title;
              item.need_reupload = false;
            })
          })
        })
      
    },
    BackToToday() {
      // this.setDate(moment());
      let day = moment()
      let date;
        if (!arguments.length) {
          date = moment();
        } else {
          date = day;
        }

        let old = this.select.clone();

        this.select = date;

        if (!old.isSame(this.select, 'month')) {
          this.setCalendar(date);
        }

        this.cur_calendar = this.calendar.find(item => this.isSameDay(this.select, item.moment));
        this.cur_modify = _.cloneDeep(this.cur_calendar);

        this.cur_modify.tobelist.forEach(task => {
          task.follow && task.follow.forEach(follow => {
            follow.files && follow.files.forEach(item => {
              item.file_img = item.file_url;
              item.image = item.file_img;
              item.file_desc = "已上传";
              item.file_img = item.file_url;
              item.file_name = item.title;
              item.file_title = item.title;
              item.need_reupload = false;
            })
          })
        })
    },
    setDayClass(date) {
      let nowDate = new Date();
      let stu = date.moment._d - nowDate;
      return {
        "no-selected-month": !date.moment.isSame(this.select, "month"),
        "curdate": this.isSameDay(date.moment, this.current),
        "tobe-assign": date.status && date.status !== 3 && stu <= 0,
        "tobe-assign-new": date.status && date.status === 3 && stu <= 0,
        "tobe-assign-new2": stu >= 0,
        "assigined": date.assigned
      };
    },
    setDayClass2(date) {
      let nowDate = new Date();
      let stu = date.moment._d - nowDate;
      return {
        "no-selected-month": !date.moment.isSame(this.select, "month"),
        "curdate": this.isSameDay(date.moment, this.current),
        "tobe-assign": false,
        "tobe-assign-new": false,
        "tobe-assign-new2": false,
        "assigined": false,
        "border-area": date.status && date.status === 5
      };
    },
    setDayClass3(status) {
      return {
        "font-size1": status === 2,
        "font-size2": status === 1,
        "font-size3": status === 4,
        "font-size4": status === 3
      };
    },
    // 比较是否在日期范围内
    isWithinRange(startmoment, endmoment, moment) {
      return moment.isBetween(
        startmoment
          .clone()
          .startOf("day")
          .subtract(1, "day"),
        endmoment
          .clone()
          .startOf("day")
          .add(1, "day")
      );
    },
    // 是否同一天
    isSameDay(moment1, moment2) {
      return moment1.isSame(moment2, "day");
    },
    // 计算任务的剩余添加次数
    calcTaskCount(id) {
      let taskIndex = this.tasklist.findIndex(item => item.task_id === id);
      let taskItem = this.tasklist[taskIndex];
      let count_sum = taskItem.exec_date
        .map(exec => exec.count)
        .reduce((total, count) => total + count, 0);
      taskItem.remain_count = taskItem.exec_count - count_sum;
    },
    // 获取当前任务的剩余次数
    getTaskCount(id) {
      return this.noTaskList.find(item => item.id === id).task_num;
    },
    // 设置安排任务
    onSetCount(calendar_task, count) {
      let id = calendar_task.id;
      let task = this.noTaskList.find(item => item.id === id);
      if (!task) {
        return false;
      }
      task.totalCount = task.task_num - count;
      task.count = count;
      this.noTaskList.forEach((ele, index) => {
        if (ele.id == id) {
          this.noTaskList.splice(index, 1, task);
        }
      });

      // this.noTaskList = []
      // this.noTaskList.push(task)
      // task.count = task.task_num + count;
      // } else {
      // task.task_num = task.task_num + 1;
      // task.count = task.task_num - 1;
      // }
      // task.count = 1
      // console.log(this.noTaskList, "this.noTaskList")

      // if (count > 0) {
      //   let execItem = task.date.find(item =>
      //     this.isSameDay(moment(item.date, "YYYY/MM/DD"), this.select)
      //   );
      //   if (execItem) {
      //     execItem.count = count;
      //   } else {
      //     task.date.push({
      //       date: this.select.format("YYYY/MM/DD"),
      //       count: count
      //     });
      //   }
      // } else {
      //   let execIndex = task.date.findIndex(item =>
      //     this.isSameDay(moment(item.date, "YYYY/MM/DD"), this.select)
      //   );
      //   task.date.splice(execIndex, 1);
      // }

      // calendar_task.count = count;
      // this.cur_calendar.assigned = this.cur_calendar.tobelist.some(
      //   item => item.count > 0
      // );
      // this.calcTaskCount(calendar_task.task_id);
      // this.attachToDate();
    },

    // 把日历数组的数据放到日历上去
    attachToDate() {
      this.dateList.forEach(day => {
        let dayMoment = moment(day.date, "YYYY/MM/DD");
        let calendarItem = this.calendar.find(item =>
          this.isSameDay(item.moment, dayMoment)
        );
        // console.log(calendarItem, "calendarItem")
        if (calendarItem) {
          // calendarItem.tobelist = day.tobelist;
          // calendarItem.assigned = day.tobelist.some(item => item.count > 0);
          calendarItem.status = day.status;
        }
      });
    },

    // 生成日期数组
    taskToDate() {
      let tasklist = this.tasklist;
      let dateList = [];
      tasklist &&
        tasklist.forEach(task => {
          dateList.push(task);
          // // 已安排的任务
          // let taskItem = {
          //   task_name: task.task_name,
          //   clean_type: task.clean_type,
          //   clean_content: task.clean_content,
          //   task_id: task.task_id,
          //   exec_count: task.exec_count,
          //   remain_count: task.remain_count,
          // };
          // task.exec_date.forEach(exec_date => {
          //   let dateObj = dateList.find(item => item.date === exec_date.date);
          //   let todoItem = {count: exec_date.count, ...taskItem};
          //   let follow = exec_date.follow;
          //   if (!dateObj) {
          //     dateObj = {
          //       date: exec_date.date,
          //       tobelist: [],
          //     };
          //     // follow.curImg = follow.files[0];
          //     // follow.forEach(item => {
          //     //   item.files = JSON.parse(item.files);
          //     // });

          //     dateObj.tobelist.push({
          //         plan_id: exec_date.id,
          //         follow_edit: {
          //           content: "",
          //           files: []
          //         },
          //         follow: follow,
          //         ...todoItem
          //       }
          //     );
          //     dateList.push(dateObj);
          //   } else {
          //     // follow.forEach(item => {
          //     //   item.files = JSON.parse(item.files);
          //     // });

          //     dateObj.tobelist.push({
          //         plan_id: exec_date.id,
          //         follow_edit: {
          //           content: "",
          //           files: []
          //         },
          //         follow: follow,
          //         ...todoItem
          //       }
          //     );
          //   }
          //   follow.forEach(item => {
          //     item.curImg = item.files[0] || null;
          //     item.curImgComment = "";
          //   })
          // });

          // // 待安排的任务
          // let start = moment(task.start_date, 'YYYY/MM/DD');
          // let end = moment(task.end_date, 'YYYY/MM/DD');
          // let cur = moment(task.start_date, 'YYYY/MM/DD');

          // while (this.isWithinRange(start, end, cur)) {
          //   let date = cur.format('YYYY/MM/DD');
          //   let dateObj = dateList.find(item => item.date === date);

          //   let todoItem = {count: 0, ...taskItem};

          //   if (!dateObj) {
          //     dateObj = {
          //       date: date,
          //       tobelist: []
          //     };

          //     dateObj.tobelist.push(todoItem);
          //     dateList.push(dateObj);
          //   } else {
          //     if (dateObj.tobelist.findIndex(item => item.task_id === task.task_id) === -1) {
          //       dateObj.tobelist.push(todoItem);
          //     }
          //   }
          //   cur.add(1, 'day')
          // }

          // this.calcTaskCount(task.task_id);
        });

      this.dateList = dateList;
    },
    onResponse() {
      this.taskToDate();
      this.setCalendar();
      // this.setDate();
    },

    // 提交跟进记录
    submitFollow(task) {
      let data = {
        plan_id: task.id,
        port_id: this.$route.params.id,
        ...task
      };
      data.files =
        data.files &&
        data.files.map(file => {
          return {
            file_url: file.image,
            title: file.file_title,
            small_image: file.small_image
          };
        });
      let errors = [];

      if (!data.content) {
        errors.push("请填写跟进内容");
      }

      if (!data.files && data.files.length) {
        errors.push("请上传附件");
      }

      if (data.files && data.files.some(item => !item.title)) {
        errors.push("请把附件标题填写完整");
      }

      if (errors && errors.length) {
        this.$toast.fail(errors[0]);
        return false;
      }

      request
        .post("/api/clean/FollowUp", data)
        .then(res => {
          this.ex.alert("提示", "操作成功！").then(res => {
            location.reload();
          });
        })
        .catch(e => {
          this.ex.alert("提示", "操作失败！", false);
        });
    },
    onFileChange(item, value) {
      this.$set(item, "curImg", value);
      item.curImgComment = "";
      this.$forceUpdate();
    },
    onAddComment(item, comment) {
      let data = {
        remark: comment,
        follow_id: item.curImg.id
      };
      request
        .post("/api/clean/AdminReason", data)
        .then(res => {
          this.ex.alert("提示", "添加成功！").then(res => {
            location.reload();
          });
        })
        .catch(e => {
          this.ex.alert("提示", "操作失败！", false);
        });
    },
    onDelFollow(follow, item, index) {
      const loading = this.$toast.loading("正在删除...");
      request
        .post("/api/clean/DeleteFollow", { follow_id: item.id })
        .then(res => {
          this.$toast("删除成功！");
          follow.splice(index, 1);
        })
        .catch(e => {
          console.log(e);
          this.$toast("删除失败！");
        })
        .finally(() => {
          loading.clear();
        });
    },
    onAddFollow(follow, task) {
      follow.push({
        id: "",
        port_id: this.$route.params.id,
        plan_id: task.plan_id,
        content: "",
        files: []
      });
    },
    onMofifySumit() {
      let tobelist = this.cur_modify.tobelist;
      tobelist = tobelist.map(task => {
        return task.follow.map(follow => {
          return {
            id: follow.id,
            plan_id: task.plan_id,
            content: follow.content,
            files: follow.files.map(file => {
              return {
                file_url: file.image,
                title: file.file_title,
                small_image: file.small_image,
                id: file.id
              };
            })
          };
        });
      });
      const followlist = tobelist.reduce((prev, next) => {
        return prev.concat(next);
      }, []);

      if (
        followlist.some(item => {
          return !item.content;
        })
      ) {
        this.$notify("请把跟进内容填写完整");
        return false;
      }

      if (
        followlist.some(item => {
          return !item.files.length;
        })
      ) {
        this.$notify("请把附件上传完整");
        return false;
      }
      const detail = followlist;
      const data = {
        port_id: this.$route.params.id,
        detail
      };
      request
        .post("/api/clean/AgreeFollow", data)
        .then(res => {
          this.ex.alert("提示", "修改成功！").then(res => {
            location.reload();
          });
        })
        .catch(e => {
          console.log(e);
          this.ex.alert("提示", "操作失败！", false);
        });
    },
    isPc() {
      return isPc();
    }
  },
  watch: {},
  computed: {
    isAssignToday() {
      return (
        this.alTaskList &&
        this.alTaskList.some(item => item.task && item.task.task_num > 0)
      );
    }
  }
};
</script>

<style scoped>
.font-size1 {
  padding: 2px;
  border-radius: 2px;
  border: solid 1px #1e90ff;
  margin-left: 5px;
  color: #1e90ff;
}
.font-size2 {
  padding: 2px;
  border-radius: 2px;
  border: solid 1px #00ffff;
  margin-left: 5px;
  color: #00ffff;
}
.font-size3 {
  padding: 2px;
  border-radius: 2px;
  border: solid 1px #dc143c;
  margin-left: 5px;
  color: #dc143c;
}
.font-size4 {
  padding: 2px;
  border-radius: 2px;
  border: solid 1px #32cd32;
  margin-left: 5px;
  color: #32cd32;
}
.calendar-wrp {
  background-color: #fff;
  padding-bottom: 0.45rem;
}

.calendar-table {
  border-collapse: collapse;
  width: 100%;
  text-align: center;
}

.calendar-table-head,
.calendar-table-body {
  display: flex;
  align-items: center;
}

.calendar-table-head {
  padding: 0 0.4rem;
  margin-bottom: 0.6rem;
}

.calendar-table-body {
  padding: 0 0.4rem;
  flex-wrap: wrap;
}

.calendar-table-head li {
  font-size: 0.75rem;
  color: #999;
  padding: 0.7rem 0;
  border-bottom: 1px solid #efefef;
  flex: 1;
}

.calendar-table-body li {
  font-size: 1rem;
  color: #2a2a2a;
  padding: 0.6rem;
  margin: 0.6rem 0;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  flex: 0 0 14.28%;
  box-sizing: border-box;
}

.calendar-table-body li.no-selected-month {
  color: #c9c9c9;
}

.calendar-table-body li.curdate {
  color: #1d9cf3;
}

.calendar-table-body li .selected {
  position: absolute;
  border-radius: 50%;
  background-color: #ccc;
  bottom: 2px;
  left: 50%;
  width: 4px;
  height: 4px;
  transform: translateX(-50%);
  z-index: 2;
}
.calendar-table-body li .selected2 {
  position: absolute;
  border-radius: 50%;
  background-color: #ccc;
  bottom: 2px;
  left: 50%;
  width: 4px;
  height: 4px;
  transform: translateX(-50%);
  z-index: 2;
}

.calendar-table-body li .selected.curdate {
  background-color: #1d9cf3;
}

.calendar-table-body li.tobe-assign::after {
  content: "";
  position: absolute;
  border: 1px solid #c4c8ca;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  width: 2.4rem;
  height: 2.4rem;
  max-width: 60px;
  max-height: 60px;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.calendar-table-body li.tobe-assign-new::after {
  content: "";
  position: absolute;
  border: 1px solid #c4c8ca;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  width: 2.4rem;
  height: 2.4rem;
  max-width: 60px;
  max-height: 60px;
  transform: translate(-50%, -50%);
  z-index: 1;
}
.calendar-table-body li.border-area {
  background-color: #ffff00;
}
.calendar-table-body li.tobe-assign-new2::after {
  content: "";
  position: absolute;
  border: 1px solid #ccc;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  width: 2.4rem;
  height: 2.4rem;
  max-width: 60px;
  max-height: 60px;
  transform: translate(-50%, -50%);
  z-index: 1;
}
/*.calendar-table-body li:nth-of-type(7).tobe-assign::after{*/
/*  border-right-width: 1px;*/
/*}*/

/*.calendar-table-body:last-of-type li.tobe-assign::after{*/
/*  border-bottom-width: 1px;*/
/*}*/

.calendar-table-body li.tobe-assign.assigined::after {
  border: 1px solid #36adff;
  background-color: #36adff;
}
.calendar-table-body li.tobe-assign-new.assigined::after {
  border: 1px solid #1cd3ca;
  background-color: #1cd3ca;
}

.calendar-table-body li.tobe-assign.assigined .calendar-day-text {
  color: #fff;
  font-weight: bold;
}
.calendar-table-body li.tobe-assign-new.assigined .calendar-day-text {
  color: #fff;
  font-weight: bold;
}

.calendar-table-body
  li.no-selected-month.tobe-assign.assigined
  .calendar-day-text {
  color: #7ccaff;
}
.calendar-table-body
  li.no-selected-month.tobe-assign-new.assigined
  .calendar-day-text {
  color: #cffaf8;
}

.calendar-table-body li.tobe-assign.assigined .selected.curdate {
  background-color: #fff;
}
.calendar-table-body li.tobe-assign-new.assigined .selected.curdate {
  background-color: #fff;
}

.calendar-table-body li.tobe-assign.assigined .selected {
  background-color: #97d5ff;
}
.calendar-table-body li.tobe-assign-new.assigined .selected {
  background-color: #cffaf8;
}
.calendar-table-body li.tobe-assign-new2.assigined .selected2 {
  background-color: #1e9efd;
}

.calendar-day-text {
  position: relative;
  z-index: 5;
  font-weight: bold;
}

.calendar-title {
  padding: 1rem 0.6rem 0.7rem;
  display: flex;
  align-items: center;
}

.calendar-title-date {
  font-size: 1.2rem;
  font-weight: bold;
}

.calendar-title-right {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.calendar-title-arrow {
  font-size: 1.2rem;
  padding: 0.1rem;
}

.jin {
  font-size: 0.9rem;
  width: 2.1rem;
  height: 2.1rem;
  line-height: 2.1rem;
  text-align: center;
  margin-right: 0.3rem;
}

.jin.today {
  background-color: #36adff;
  color: #fff;
  border-radius: 50%;
}

.task-box {
  /*background-color: #FEFEFE;*/
  border: 1px solid #e9e9e9;
  border-radius: 0.5rem;
  padding: 12px;
}

.arrow-icon {
  width: 2.1rem;
  height: 2.1rem;
  line-height: 2.1rem;
  text-align: center;
  border-radius: 50%;
}

.arrow-icon:active {
  background-color: #d1d1d1;
}

.follow .form-item {
  margin: 0 !important;
}

.add-commemt {
}

.add-commemt__title {
  font-size: 0.875rem;
  color: #333;
  margin-top: 15px;
}

.add-commemt__field {
  border: 1px solid #ddd;
  border-radius: 3px;
  margin-top: 10px;
  display: block;
  line-height: 1.2;
  box-sizing: border-box;
  width: 100%;
  padding: 8px 8px;
  resize: none;
}

.modify-list {
}

.modify-list-item .info-item {
  font-size: 0.875rem;
  color: #555;
  margin-left: 15px;
  margin-top: 5px;
}

.modify-list-item {
  padding: 10px 0;
  border: 1px solid #e9e9e9;
  border-radius: 8px;
  margin-top: 20px;
}
</style>
