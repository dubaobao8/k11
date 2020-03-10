<template>
  <div class="todotask_detail">
    <d-business-card :info="user_info" class="margin20"/>
    <d-info-item :value="info_data.title" class="info-item" title="任务名称"/>
    <d-info-item :value="info_data.accept.username" class="info-item" title="收件人"/>
    <d-info-item :value="info_data.accept.department" class="info-item" title="收件人所属部门"/>
    <d-info-item :value="info_data.accept.phone" class="info-item" title="收件人联系方式"/>
    <div class="divider-1 ml20 mr20"></div>
    <d-info-item :value="info_data.user.username" class="info-item" title="发件人"/>
    <d-info-item :value="info_data.department" class="info-item" title="发件人所属部门"/>
    <d-info-item :value="info_data.phone" class="info-item" title="发件人联系方式"/>
    <d-info-item :value="info_data.start_time | transDate" class="info-item" title="工作指派日期"/>
    <d-info-item :value="info_data.finish_time | transDate" class="info-item" title="整体完成时间"/>
    <d-info-item class="info-item" title="附件"/>
    <v-file-preview :files="info_data.follow" class="margin20"/>

    <!-- 明细开始 -->
    <p class="form-detail-title-huge margin20">明细</p>
    <!-- 明细循环开始 -->
    <ul class="margin20">
      <li :key="item.id" class="mb30" v-for="(item,index) in info_data.details">
        <p class="form-detail-title mb10 fw-b"><span class="detail-order dpib mr5">{{index+1}}</span>明细{{index+1}}</p>
        <d-info-item :value="item.content" class="info-item" title="任务描述"/>
        <d-info-item :value="item.done_time | transDate" class="info-item" title="该任务完成时间"/>
        <d-info-item class="info-item" title="任务附件" v-if="item.file&&item.file.length"/>
        <v-file-preview :files="item.file"/>

        <!-- 已添加的跟进记录开始 -->
        <div>
          <!--<p class="form-detail-title mt15 fw-b">已添加的跟进</p>-->
          <ul>
            <li v-for="(follow,follow_index) in item.follow">
              <p class="form-detail-title mt15 fw-b mb15">已添加的跟进 {{index + 1}}-{{follow_index + 1}}</p>
              <d-info-item :value="follow.create_time" class="info-item" title="跟进时间"/>
              <d-info-item :value="follow.content" class="info-item" title="跟进记录"/>
              <d-info-item :value="relate.port.abstract"
                           class="info-item"
                           title="关联单据"
                           v-for="(relate,relate_index) in follow.report"/>
              <d-info-item class="info-item" title="跟进附件" v-if="follow.file&&follow.file.length"/>
              <v-file-preview :files="follow.file"/>
            </li>
          </ul>

        </div>
        <!-- 已添加的跟进记录结束 -->

        <section v-if="isInTheFollowUp">
          <p class="form-detail-title fw-b mt20 fs09">添加跟进</p>
          <!-- 跟进循环开始 -->
          <ul class="form-group">
            <li :key="follow_item.uid" v-for="(follow_item,follow_index) in followUp[index]">
              <p class="form-detail-title mt15 fw-b fxjbw dpfx">
                <span>新增跟进 {{index+1}}-{{follow_index + 1}}</span>

                <!-- 删除跟进按钮 -->
                <span @click="delFollowUp(index, follow_index)" class="fs08" style="color: #ff4e69;">
                <i class="fa fa-minus-square mr5"></i>删除新增跟进 {{index+1}}-{{follow_index + 1}}
              </span>
              </p>
              <div style="margin: 0 -15px;">
                <v-input :maxlength="300" required title="跟进记录" type="textarea" v-model="follow_item.content"/>
              </div>

              <!-- 关联单据开始 -->
              <p class="form-detail-title fw-b mt20">添加关联单据</p>
              <ul>
                <li :key="relate.uid" v-for="(relate,relate_index) in follow_item.report_id">
                  <v-datalist :options="relate.options"
                              @select:option="seletedReport($event,index,follow_index, relate_index)"
                              @send:value="searchReport($event,index,follow_index, relate_index)"
                              empty-text="没有相关单据"
                              options_title="请选择单据"
                              placeholder="请输入单据编号"
                              text="abstract"
                              title="关联单据"
                              v-model="relate.text"
                  >
                    <template #prepend>
                      <i @click="delRelate(index,follow_index,relate_index)"
                         class="fa fa-minus-square fs08 position-relative"
                         style="color: #ff4e69;padding:8px 8px 8px 4px"></i>
                    </template>
                  </v-datalist>
                </li>
              </ul>
              <action-line @click="addRelate(index,follow_index)">添加关联单据</action-line>
              <action-line @click="newReport" font-class="fa fa-plus" style="margin-top: -7px;">发起新单据</action-line>
              <!-- 关联单据结束 -->
              <div style="margin: 0 -15px;">
                <v-file-container :files="follow_item.file" auto_del auto_upload style="margin-top: -10px;"/>
              </div>
              <div class="divider-dash-1"></div>
            </li>
            <action-line @click="addFollowUp(index,item.id)" color="#5799EF">添加跟进</action-line>
          </ul>
        </section>

      </li>
    </ul>
    <!-- 明细循环结束 -->
    <!-- 明细结束 -->

    <!-- 审批记录开始 -->
    <section class="pl5 pr5" v-if="info_data.operation.length">
      <p class="form-detail-title-huge ml15">审批记录</p>
      <d-approval-list :info="item"
                       :key="Date.now() * Math.random()"
                       report_type="todotask"
                       v-for="item in info_data.operation"/>
    </section>
    <!-- 审批记录结束 -->

    <!-- 操作按钮开始 -->
    <!-- 收件人待接受 -->
    <div v-if="isTodoAccept">
      <a @click="recipientPostReceive" class="form-submit-block">接受任务</a>
      <a @click="recipientPostRefuse" class="form-submit-block form-submit-block__reject">拒绝任务</a>
    </div>

    <!-- 收件人跟进时 -->
    <div v-if="isInTheFollowUp">
      <a @click="updateUserFolow" class="form-submit-block">更新跟进</a>
      <a @click="userFollowFinish" class="form-submit-block" style="background-color: #57b2ef;">跟进完成</a>
    </div>

    <!-- 发起人审批 -->
    <div v-if="isFollwUpDone">
      <p class="form-detail-title text-center font-bold margin20">跟进是否完成？</p>
      <a @click="senderUserAgree" class="form-submit-block">跟进已完成</a>
      <a @click="senderUserRefuse" class="form-submit-block form-submit-block__reject">跟进未完成</a>
    </div>

    <!-- 收件人上级操作，协商阶段 -->
    <div v-if="isSuperiorAssign">
      <a @click="leadUserAgree" class="form-submit-block">接受任务（指派原收件人）</a>
      <a @click="leadUserAssign" class="form-submit-block" style="background-color: #57b2ef;">接受并重新指派</a>
    </div>
    <a @click="leadUserRefuse" class="form-submit-block form-submit-block__reject" v-if="isSuperiorReject">拒绝任务</a>


    <!-- 发件人上级和终审人操作 -->
    <div v-if="isApprovalReasonable">
      <p class="form-detail-title text-center font-bold margin20">该单据是否合理？</p>
      <a @click="ReportReasonable" class="form-submit-block">合理</a>
      <a @click="ReportUnReasonable" class="form-submit-block form-submit-block__reject">不合理</a>
    </div>

    <!-- 操作按钮结束 -->

  </div>
</template>

<script>
  import DBusinessCard from "@/components/details/d-business-card";
  import DInfoItem from "@/components/details/d-info-item";
  import VFilePreview from "@/components/details/v-file-preview";
  import ActionLine from "@/components/form/action-line";
  import VDatalist from "@/components/form/v-datalist";
  import VInput from "@/components/form/v-input";
  import VPicker from "@/components/form/v-picker";
  import VFileContainer from "@/components/form/v-file-container";
  import {
    BossAgree, BossRefuse,
    GetMyDepartmentStaff,
    GetTaskDetail, LeadUserAgree, LeadUserAssign, LeadUserRefuse,
    RecipientPostReceive, RecipientPostRefuse,
    SearchReport,
    SendUserFollow,
    SendUserFollowFinish, StartLeadUserAgree, StartLeadUserRefuse, StartUserAgree, StartUserRefuse
  } from "@/api/details/todotask";
  import {arrayFlatten} from "@/util/util";
  import DApprovalList from "@/components/details/d-approval-list";

  const FollowUpModel = function (detail_id) {
    this.detail_id = detail_id;
    this.content = "";
    this.file = [];
    this.report_id = []; // 关联其他报告id
    this.uid = Math.random() * Date.now();
  };

  export default {
    name: "todotask_detail",
    components: {
      DApprovalList,
      VFileContainer, VPicker, VInput, VDatalist, ActionLine, VFilePreview, DInfoItem, DBusinessCard
    },
    data() {
      return {
        user_id: 0,
        port_id: "",
        user_info: {
          user_name: "User",
          user_avatar: "",
          report_name: "To Do Task",
          report_type: "todotask",
          report_status: "1",
          user_id: "",
          department: "",
          position: ""
        },
        info_data: {
          user: {},
          accept: {},
          details: [],
          operation: []
        },
        followUp: []
      }
    },
    computed: {
      // 收件人接受或者拒绝
      isTodoAccept() {
        return this.info_data.action_user == this.user_id && this.info_data.status == 1;
      },
      // 收件人跟进
      isInTheFollowUp() {
        return this.info_data.action_user == this.user_id && this.info_data.status == 2;
      },
      // 跟进完成，发起人审批
      isFollwUpDone() {
        return this.info_data.action_user == this.user_id && this.info_data.status == 3;
      },
      // 上级接受任务或者接受并指派
      isSuperiorAssign() {
        return this.info_data.action_user == this.user_id && (this.info_data.status == 5 || this.info_data.status == 6);
      },
      // 上级拒绝
      isSuperiorReject() {
        return this.info_data.action_user == this.user_id && this.info_data.status == 5;
      },
      // 终审人和发件人上级审批是否合理
      isApprovalReasonable() {
        return this.info_data.action_user == this.user_id && (this.info_data.status == 7 || this.info_data.status == 9);
      }
    },
    methods: {
      // 获取页面数据
      getPageData() {
        this.user_id = localStorage.getItem("user_id");
        this.port_id = this.$route.params.id;
        GetTaskDetail(this.port_id).then(res => {
          let data = res.data.data;
          this.info_data = data;
          this.user_info.user_name = data.accept.username;
          this.user_info.user_avatar = data.accept.user_logo;
          this.user_info.user_id = data.accept.userid;
          this.user_info.department = data.accept.department;
          this.user_info.position = data.accept.position;
          this.user_info.report_status = data.status;
          data.details.forEach((item, index) => {
            if (item.file) {
              item.file = JSON.parse(item.file);
            } else {
              item.file = [];
            }

            item.follow.forEach((follow, follow_index) => {
              if (follow.file) {
                follow.file = JSON.parse(follow.file)
              } else {
                follow.file = [];
              }

            });

            this.followUp.push([]);
            // this.addFollowUp(index, item.id);
          });
        })
      },
      // 添加跟进
      addFollowUp(detail_index, detail_id) {
        if (!this.followUp[detail_index]) {
          this.followUp[detail_index] = [];
        }
        this.followUp[detail_index].push(new FollowUpModel(detail_id))
      },
      // 删除跟进
      delFollowUp(detail_index, follow_index) {
        this.followUp[detail_index].splice(follow_index, 1);
      },
      // 添加关联单据
      addRelate(detail_index, follow_index) {
        this.followUp[detail_index][follow_index].report_id.push({
          uid: Math.random() * Date.now(),
          value: "",
          text: "",
          options: []
        });
      },
      // 删除关联单据
      delRelate(detail_index, follow_index, relate_index) {
        this.followUp[detail_index][follow_index].report_id.splice(relate_index, 1);
      },
      //搜索单据
      searchReport(key, detail_index, follow_index, relate_index) {
        SearchReport(key).then(res => {
          this.followUp[detail_index][follow_index].report_id[relate_index].options = res.data.data;
        })
      },
      // 选择单据
      seletedReport(value, detail_index, follow_index, relate_index) {
        this.followUp[detail_index][follow_index].report_id[relate_index].text = value.work_num;
        this.followUp[detail_index][follow_index].report_id[relate_index].value = value.id;
      },
      // 新增单据
      newReport() {
        this.$createActionSheet({
          title: "请选择单据类型",
          data: [
            {
              content: "取号",
              path: "/sde"
            }, {
              content: "事件报告",
              path: "/report"
            },
            // {
            //   content: "工程单"
            // }, {
            //   content: "采购/报销单"
            // }
          ],
          onSelect: (item, index) => {
            let paths = ["/sde", "/report"];
            this.$router.push(paths[index])
          }
        }).show();
      },

      // 更新跟进
      updateUserFolow() {

        let followUp = this.followUp;
        followUp = arrayFlatten(followUp);

        if (!followUp.length) {
          this.$notify('请添加跟进记录');
          return false
        }

        if (followUp.some(item => !item.content)) {
          this.$notify('请把【跟进记录】填写完成');
          return false
        }

        let isFileDone = followUp.some(item => {
          return item.file.some(file => {
            return !file.file_title
          })
        });

        if (isFileDone) {
          this.$notify('请把【附件标题】填写完整');
          return false
        }

        this.ex.confirm('提示', '确定提交跟进？').then(res => {

          let loading = this.$toast.loading('正在提交跟进...');

          followUp = followUp.map(item => {
            let report_id = item.report_id.map(follow => {
              return follow.value
            });

            report_id = report_id.filter(follow => follow);
            return {
              detail_id: item.detail_id,
              content: item.content,
              file: JSON.stringify(item.file.map(file => {
                return {
                  "file_url": file.image,
                  "title": file.file_title,
                  "small_image": file.small_image
                }
              })),
              report_id: report_id
            }
          });


          let data = {
            details: followUp,
            port_id: this.$route.params.id
          };

          SendUserFollow(data).then(res => {
            loading.clear();
            this.$root.$toast.success('更新跟进成功！');
            setTimeout(() => {
              location.reload();
            }, 300);
          }).catch(err => {
            loading.clear();
            this.$toast.fail('请求失败！');
          })
        })

      },
      // 跟进完成
      userFollowFinish() {
        let isInCompleted = this.info_data.details.some(item => !item.follow || !item.follow.length);
        if (isInCompleted){
          this.$notify('每个明细下至少添加一条跟进记录，才能完成跟进！');
          return false;
        }

        this.ex.confirm('确认跟进完成', '请确保所有跟进记录已提交完毕！').then(res => {
          SendUserFollowFinish(this.$route.params.id).then(res => {
            this.$root.$toast.success('跟进完成！');
            this.$router.replace({
              path: "/mine"
            })
          }).catch(err => {
            this.$toast.fail('操作失败！');
          })
        });
      },
      // 收件人接受任务
      recipientPostReceive() {
        this.ex.confirm('提示', '确认接受任务').then(res => {
          RecipientPostReceive(this.$route.params.id).then(res => {
            this.$root.$toast.success('已接受任务！');
            setTimeout(() => {
              location.reload();
            }, 300)
          }).catch(err => {
            this.$toast.fail('操作失败！');
          })
        });
      },
      // 收件人拒绝任务
      recipientPostRefuse() {
        this.ex.prompt('确定拒绝任务？', '拒绝任务后，流程将流转到上级协商', "请输入拒绝理由").then(res => {
          if (!res) {
            this.$toast.fail("请填写理由");
            return false
          }
          RecipientPostRefuse(this.$route.params.id, res).then(res => {
            this.$root.$toast.success('已拒绝任务！');
            setTimeout(() => {
              location.reload();
            }, 300)
          }).catch(err => {
            this.$toast.fail('操作失败！');
          })
        });
      },
      // 发起人审批跟进--同意
      senderUserAgree() {
        this.ex.confirm('提示？', '确定跟进已完成').then(res => {
          StartUserAgree(this.$route.params.id).then(res => {
            this.$root.$toast.success('操作成功！');
            setTimeout(() => {
              location.reload();
            }, 300)
          }).catch(err => {
            this.$toast.fail('操作失败！');
          })
        });
      },
      // 发起人审批跟进--拒绝
      senderUserRefuse() {
        this.ex.prompt('确定跟进未完成？', '流程将回到收件人', "请填写理由").then(res => {
          if (!res) {
            this.$toast.fail("请填写理由");
            return false
          }
          StartUserRefuse(this.$route.params.id, res).then(res => {
            this.$root.$toast.success('操作成功！');
            setTimeout(() => {
              location.reload();
            }, 300)
          }).catch(err => {
            this.$toast.fail('操作失败！');
          })
        });
      },
      // 上级接受任务
      leadUserAgree() {
        this.ex.confirm('确定接受任务？', '将由原收件人跟进').then(res => {
          LeadUserAgree(this.$route.params.id).then(res => {
            this.$root.$toast.success('操作成功！');
            setTimeout(() => {
              location.reload();
            }, 300)
          }).catch(err => {
            this.$toast.fail('操作失败！');
          })
        });
      },
      // 上级接受任务，重新指派
      async leadUserAssign() {
        let loading = this.$createToast({
          type: "loading",
          txt: "请稍等..."
        }).show();

        let res = await GetMyDepartmentStaff();
        let userList = res.data.data;
        loading.hide();

        this.$createPicker({
          title: "请重新指派收件人",
          data: [userList],
          alias: {
            value: "id",
            text: "username"
          },
          onSelect: (value) => {
            console.log(value);
            let user_id = value[0];
            LeadUserAssign(this.$route.params.id, user_id).then(res => {
              this.$root.$toast.success('已重新指派收件人！');
              setTimeout(() => {
                location.reload();
              }, 300)
            }).catch(err => {
              this.$toast.fail('操作失败！');
            })
          }
        }).show();
      },
      // 上级拒绝
      leadUserRefuse() {
        this.ex.prompt('确定拒绝任务？', '流程将回到发件人上级', "请输入拒绝理由").then(res => {

          if (!res) {
            this.$toast.fail("请填写拒绝理由");
            return false
          }
          LeadUserRefuse(this.$route.params.id, res).then(res => {
            this.$root.$toast.success('操作成功！');
            setTimeout(() => {
              location.reload();
            }, 300)
          }).catch(err => {
            this.$toast.fail('操作失败！');
          })
        });
      },
      // 单据合理
      ReportReasonable() {
        this.ex.confirm('提示', '确认该单据合理？').then(res => {
          if (this.info_data.status == 7) {
            StartLeadUserAgree(this.$route.params.id).then(this.operationDone).catch(this.operationCatch);
          } else if (this.info_data.status == 9) {
            BossAgree(this.$route.params.id).then(this.operationDone).catch(this.operationCatch);
          } else {
            this.$toast.fail("状态错误");
          }
        });

      },
      // 单据不合理
      ReportUnReasonable() {
        this.ex.prompt('提示', '确认该单据不合理？', "请输入理由").then(res => {
          if (!res) {
            this.$toast.fail("请输入理由！");
            return false;
          }
          if (this.info_data.status == 7) {
            StartLeadUserRefuse(this.$route.params.id, res).then(this.operationDone).catch(this.operationCatch);
          } else if (this.info_data.status == 9) {
            BossRefuse(this.$route.params.id, res).then(this.operationDone).catch(this.operationCatch);
          } else {
            this.$toast.fail("状态错误");
          }
        });
      },
      operationDone(res) {
        this.$root.$toast.success('操作成功！');
        setTimeout(() => {
          location.reload();
        }, 300)
      },
      operationCatch(err) {
        console.warn(err);
        this.$toast.fail('操作失败！');
      }
    },
    mounted() {
      this.getPageData();
    }
  }
</script>

<style scoped src="./details.css"></style>
<style>
  .todotask_detail .form-group .form-item {
    margin: 0;
  }

</style>
