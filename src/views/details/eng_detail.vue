<template>
  <div>
    <d-business-card :info="user_info" class="margin20" />
    <div class="divider-1 ml20 mr20"></div>
    <section class="info-list">
      <d-info-item :value="info_data.work_num" class="info-item" title="工程单号" />
      <d-info-item
        :value="`${info_data.place} ${info_data.detail_place} ${info_data.code_num?info_data.code_num:''} （${info_data.position}）`"
        class="info-item"
        title="工作地点"
      />
      <!--<d-info-item :value="info_data.place" class="info-item" title="故障位置"/>-->
      <!--<d-info-item :value="info_data.position" class="info-item" title="位置"/>-->
      <!--<d-info-item :value="info_data.detail_place" class="info-item" title="地点备注"/>-->
      <d-info-item :value="info_data.create_time | transDate" class="info-item" title="出单日期" />
      <d-info-item :value="info_data.content" class="info-item" title="故障描述" />
      <d-info-item :value="info_data.work_type	" class="info-item" title="工作类型" />
      <d-info-item :value="info_data.finish_time | transDate" class="info-item" title="要求完成日期" />
      <d-info-item :value="info_data.remark" class="info-item" title="维修备注" />
      <!--<d-info-item :value="info_data.lookUser" class="info-item" title="抄送人"/>-->
      <d-info-item
        class="info-item"
        title="附件"
        v-if="info_data.pro_file&&info_data.pro_file.length"
      />
      <v-file-preview :files="info_data.pro_file" class="file-wrp" />
    </section>

    <div class="divider-1 ml20 mr20"></div>

    <section class="info-list">
      <!--<div class="notes" v-if="!!info_data.notes">-->
      <!--  <p class="font-bold">维修备注 </p>-->
      <!--  <p class="notes-text">{{info_data.notes}}</p>-->
      <!--</div>-->
      <p class="form-detail-title-huge ml15 mb15" v-if="info_data.pro_follow.length">跟进记录</p>
      <div
        :key="Date.now() * Math.random()"
        class="ml15 mr15"
        v-for="(follow ,followIndex) in info_data.pro_follow"
      >
        <p
          class="form-detail-title mb10 fw-b"
          style="color: #444;font-size: 0.95rem;"
        >跟进记录{{followIndex + 1}}</p>
        <d-info-item :value="follow.pro_user.username" class="info-item" title="维修员" />
        <d-info-item :value="follow.pro_identity.type" class="info-item" title="维修班组" />
        <d-info-item :value="follow.create_time | transDate" class="info-item" title="接单时间" />
        <d-info-item :value="follow.type" class="info-item" title="指派类型" />

        <div class="mb20" v-for="(maintain,maintainIndex) in follow.pro_follow">
          <p class="form-detail-title mb15">维修记录 {{ followIndex + 1 }}-{{maintainIndex + 1}}</p>
          <d-info-item :value="maintain.start_time | transTime" class="info-item" title="开工时间" />
          <d-info-item :value="maintain.finish_time | transTime" class="info-item" title="完成时间" />
          <d-info-item :value="maintain.status_name" class="info-item" title="维修状态" />
          <d-info-item :value="maintain.content" class="info-item" title="维修备注" />
          <d-info-item :value="maintain.port_num" class="info-item" title="领料单编号" />
          <d-info-item :value="maintain.store_user" class="info-item" title="仓管员" />

          <d-info-item class="info-item" title="维修附件" />
          <v-file-preview :files="maintain.file" class="file-wrp" />
        </div>
        <div class="divider-1"></div>
      </div>
    </section>

    <!-- 填写维修记录开始 -->
    <section class="form-group maintain-record mt20" style="overflow:hidden" v-if="canIEdit">
      <p class="form-detail-title-huge ml15">添加维修记录</p>
      <transition-group name="follow" tag="div">
        <!-- 维修记录开始 -->
        <div
          :key="maintain.uid"
          class="form-second-detail"
          v-for="(maintain, index) in form_model.maintain_record"
        >
          <div class="form-detail-head">
            <p class="form-detail-title">维修记录</p>
            <span @click="delMaintainRecord(index)" class="form-detail-delete" v-if="index !== 0">
              <i class="fa fa-minus-square mr5"></i>
              删除维修记录
            </span>
          </div>

          <!--<v-input required title="维修描述" type="textarea" v-model="maintain.record"/>-->
          <!--<v-picker :p-display-text="maintain.timeText"-->
          <!--          required-->
          <!--          title="维修时间"-->
          <!--          type="datetime"-->
          <!--          v-model="maintain.create_time"/>-->
          <!--<v-input maxlength="3" required title="维修时长" type="number" v-model.number="maintain.duration">-->
          <!--  <template v-slot:append>-->
          <!--    <span class="fs08 ml5">-->
          <!--      分钟-->
          <!--    </span>-->
          <!--  </template>-->
          <!--</v-input>-->

          <v-picker required showTime title="开工时间" type="datetime" v-model="maintain.start_time" />
          <v-picker required showTime title="完工时间" type="datetime" v-model="maintain.finish_time" />
          <v-picker
            :options="[{text:'已完成',value:'已完成'},{text:'待料',value:'待料'},{text:'另约时间',value:'另约时间'},{text:'其他',value:'其他'}]"
            required
            title="维修状态"
            v-model="maintain.status_name"
          />
          <v-input
            :required="maintain.status_name !== '已完成'"
            title="维修备注"
            type="textarea"
            v-model="maintain.content"
          />
          <v-input title="领料单编号" v-model="maintain.port_num" />
          <v-input title="仓管员" v-model="maintain.store_user" />

          <v-file-container
            :auto_del="true"
            :auto_upload="true"
            :files="maintain.file"
            :requried-file-title="false"
            required
            multiple
            title="附件（现场照片）"
          />
        </div>
      </transition-group>
      <!-- 维修记录结束 -->
      <!--<action-line @click="addMaintainRecord" class="ml15 mr15" font-class="fa fa-plus-square">添加维修记录</action-line>-->
      <a @click="sendMaintain" class="form-submit-block">提交维修记录</a>
      <!--<a @click="completedMaintain"-->
      <!--   class="form-submit-block"-->
      <!--   style="background-color: #1ab2e8"-->
      <!--   v-if="info_data.pro_follow&&info_data.pro_follow.length"-->
      <!--&gt;维修完成</a>-->

      <!--<v-input style="border: none;" title="添加维修备注" type="textarea" v-model="notes"/>-->
      <!--<a @click="addNote" class="form-submit-block">添加维修备注</a>-->
    </section>
    <!-- 填写维修记录结束 -->

    <!-- 审批流程开始 -->
    <section class="margin20" v-if="approver.length">
      <p class="form-detail-title-huge">审批流程</p>
      <d-approval-process
        :accepts="info_data.lookUser.map(item=>item.username).join('，')"
        :approver="approver"
      />
    </section>
    <!-- 审批流程结束 -->

    <!-- 审批信息 -->
    <section class="pl5 pr5" v-if="info_data.operation.length">
      <p class="form-detail-title-huge ml15">审批记录</p>
      <d-approval-list
        :info="item"
        :key="Date.now() * Math.random()"
        report_type="engineer"
        v-for="item in info_data.operation"
      />
    </section>
    <!-- 审批信息结束 -->

    <v-picker
      :options="options.assignType"
      class="ml20 mr20"
      required
      text="type_name"
      title="请选择类型"
      v-if="canIAssign"
      v-model="form_model.assignType"
      values="type_name"
    />

    <!-- 操作按钮 -->
    <a @click="assignRepairmen" class="form-submit-block" v-if="canIAssign">指派维修员</a>

    <a @click="approvalAgreeMaintain" class="form-submit-block" v-if="canIApproval">维修通过</a>
    <a
      @click="approvalRejectMantain"
      class="form-submit-block form-submit-block__reject"
      v-if="canIApproval"
    >维修未通过</a>
    <!--<a @click="approvalDismissMantain" class="form-submit-block form-submit-block__reject" v-if="canIApproval">驳回</a>-->

    <a @click="acceptReport" class="form-submit-block" v-if="canIAccept">接受任务</a>
    <a
      @click="rejectReport"
      class="form-submit-block form-submit-block__reject"
      v-if="canIReject"
    >拒接任务</a>
  </div>
</template>

<script>
import dBusinessCard from "@/components/details/d-business-card";
import dInfoItem from "@/components/details/d-info-item";
import vInput from "@/components/form/v-input";
import vPicker from "@/components/form/v-picker";
import vFileContainer from "@/components/form/v-file-container";
import actionLine from "@/components/form/action-line";
import dApprovalProcess from "@/components/details/d-approval-process/d-approval-process";
import {
  ApprovalAgreeMaintain,
  ApprovalAgainAdopt,
  ApprovalSingleAgainAdopt,
  AssignRepairmen,
  CompletedMaintain,
  EngineerGroupAccept,
  GetEngineerDetail,
  GetEngineerGroup,
  GetRepairmenList,
  ApprovalRejectMantain,
  SendEngineerMaintainRecord,
  RejectEngineer,
  EngineerAddNote,
  GetProTypeList,
  ApprovalLeadRefuse
} from "@/api/details/eng_detail";
import VFilePreview from "@/components/details/v-file-preview";
import DApprovalList from "@/components/details/d-approval-list";
import { MarkRead } from "@/api/details/detail";
import { stampToString } from "../../util/util";

const MaintainRecord = function() {
  this.finish_time = "";
  this.port_num = "";
  this.start_time = "";
  this.status_name = "";
  this.store_user = "";
  this.file = [];
  this.content = "";
  this.uid = new Date().getTime() * Math.random();
};

const maintain_group = [
  "无班组",
  "强电班",
  "弱电班",
  "空调班",
  "电梯班",
  "综合班"
];

export default {
  name: "eng_detail",
  components: {
    DApprovalList,
    VFilePreview,
    dBusinessCard,
    dInfoItem,
    vInput,
    vPicker,
    vFileContainer,
    actionLine,
    dApprovalProcess
  },
  data() {
    return {
      maintain_group,
      // 表单发起人信息
      user_info: {
        user_name: "Name", //用户名
        user_avatar: "", //用户头像
        report_name: "工程单", //报告名字 如：事件报告
        report_type: "engineer", //报告类型 [incident,sde]
        report_status: "1", //报告状态 [1,2,3,4,5,6,7]
        user_id: "", // 员工号
        department: "", // 员工部门
        position: "" // 员工职位
      },
      // 页面信息
      info_data: {
        operation: [],
        pro_follow: [],
        user_role: {}
      },
      // 需要填写的表单
      form_model: {
        maintain_record: [new MaintainRecord()],
        assignType: ""
      },
      //  审批信息
      approver: [],
      notes: "",
      options: {
        assignType: []
      }
    };
  },

  computed: {
    // 是否可以编辑维修记录
    canIEdit() {
      if (this.info_data.status != 3) {
        return false;
      }

      let user_id = localStorage.getItem("user_id");

      let assign_id = this.info_data.transfer.tran_user.id;

      return user_id == assign_id && this.info_data.status == 3;
    },
    // 是否可以接受工程单
    canIAccept() {
      let role = [2, 3];
      let resRole = this.info_data.user_role.role;
      resRole = resRole && resRole.split(",");
      let newArr = [];
      if (role && resRole) {
        for (let i = 0; i < role.length; i++) {
          for (let j = 0; j < resRole.length; j++) {
            if (resRole[j] == role[i]) {
              newArr.push(resRole[j]);
            }
          }
        }
      }
      return newArr.length > 0 && this.info_data.status == 1;
    },
    // 是否可以拒绝工程单
    canIReject() {
      let resArr = this.info_data.user_role.role;
      let resStatus = resArr && resArr.split(",").indexOf("3");
      return resStatus >= 0 && this.info_data.status == 1;
    },
    // 是否可以指派维修员
    canIAssign() {
      let resArr = this.info_data.user_role.role;
      let resArr2 = this.info_data.user_role.type;
      let resStatus = resArr && resArr.split(",").indexOf("2");
      let resStatus2 = resArr2 && resArr2.split(",").indexOf(this.info_data.group_type + "");
      return (
        resStatus >= 0 &&
        this.info_data.status == 2 &&
        resStatus2 >= 0
      );
    },
    // 是否可以审批维修记录(通过或者不通过)
    canIApproval() {
      let resArr = this.info_data.user_role.role;
      let resStatus1 = resArr && resArr.split(",").indexOf("2");
      let resStatus2 = resArr && resArr.split(",").indexOf("6");
      return (
        ((resStatus1 >= 0 && this.info_data.status == 4) ||
          (resStatus2 >= 0 && this.info_data.status == 7) ||
          (this.info_data.pro_user &&
            this.info_data.pro_user.id == localStorage.getItem("user_id") &&
            this.info_data.status == 8)) &&
        this.info_data.pro_follow.slice(-1)[0].pro_follow.some(item => {
          return item.status_name === "已完成";
        })
      );
    }
  },

  methods: {
    // 添加维修记录
    addMaintainRecord() {
      this.form_model.maintain_record.push(new MaintainRecord());
    },
    // 删除维修记录
    delMaintainRecord(index) {
      this.$createDialog({
        type: "confirm",
        icon: "cubeic-warn",
        title: "提示",
        content: `是否删除维修记录？`,
        onConfirm: () => {
          this.form_model.maintain_record.splice(index, 1);
        }
      }).show();
    },
    // 添加维修中备注
    addNote() {
      if (!this.notes) {
        this.$toast("请填写备注");
        return false;
      }
      EngineerAddNote(this.$route.params.id, this.notes)
        .then(res => {
          this.$toast.success("添加成功！");
          setTimeout(() => {
            location.reload();
          }, 500);
        })
        .catch(err => {
          this.$toast.fail("添加失败！");
        });
    },
    // 验证维修记录单
    validateMaintain() {
      var error = [];
      let form = this.form_model;
      form.maintain_record.some(maintain => {
        if (!maintain.start_time) {
          error.push("请选择【开工时间】！");
        }
        if (!maintain.finish_time) {
          error.push("请选择【完成时间】！");
        }
        if (maintain.finish_time < maintain.start_time) {
          error.push("【完工时间】早于【开工时间】！");
        }
        if (!maintain.status_name) {
          error.push("请填写【维修状态】！");
        }
        if (maintain.status_name !== "已完成" && !maintain.content) {
          error.push("请填写【维修备注】！");
        }
        if (!maintain.file.length) {
          error.push("请把【附件】添加完整！");
        }
        if (
          maintain.file.some(file => {
            return !file.file_title;
          })
        ) {
          error.push("请把【附件标题】填写完整！");
        }

        if (maintain.file.some(item => item.need_reupload)) {
          error.push("请将【上传失败】的文件手动删除后再提交！");
        }

        return error.length;
      });

      if (error.length) {
        this.$notify(error[0]);
        return false;
      } else {
        return true;
      }
    },
    // 处理维修记录单数据
    processMaintain() {
      return {
        port_id: this.$route.params.id,
        detail: this.form_model.maintain_record.map(item => {
          return {
            start_time: item.start_time,
            finish_time: item.finish_time,
            status_name: item.status_name,
            content: item.content,
            port_num: item.port_num,
            store_user: item.store_user,
            repair_id: this.info_data.pro_follow.slice(-1)[0].id,
            file: item.file.map(file => {
              return {
                file_url: file.image,
                title: file.file_title,
                small_image: file.small_image
              };
            })
          };
        })
      };
    },

    /* 流程操作开始 */
    // 提交维修记录
    sendMaintain() {
      if (!this.validateMaintain()) {
        return false;
      }
      var data = this.processMaintain();
      var loading = this.$toast.loading({
        message: "正在提交维修记录..."
      });

      SendEngineerMaintainRecord(data)
        .then(res => {
          loading.clear();
          this.$toast.success({ message: "已成功提交维修记录！", mask: true });
          setTimeout(() => {
            location.reload();
          }, 1000);
        })
        .catch(err => {
          console.log(err);
          loading.clear();
          this.$root.$toast.fail("维修记录提交失败！");
        });
    },
    // 工程小组接受工程单
    acceptReport() {
      var _this = this;
      var type = this.info_data.user_role.type;
      let resStatus = type && type.split(",").indexOf("6");
      this.$createDialog({
        title: "确定接受任务？",
        icon: "cubeic-warn",
        type: "confirm",
        onConfirm: () => {
          if (!resStatus) {
            GetEngineerGroup()
              .then(res => {
                this.$createPicker({
                  title: "请选择班组",
                  data: [res.data.data],
                  alias: {
                    value: "group_type",
                    text: "group_name"
                  },
                  onSelect: (value, index, text) => {
                    startAccept(value[0]);
                  }
                }).show();
              })
              .catch(err => {
                console.error(err);
              });
          } else {
            startAccept("");
          }
        }
      }).show();

      function startAccept(group) {
        EngineerGroupAccept(_this.$route.params.id, group)
          .then(res => {
            _this.$toast.success({ message: "已成功接受任务！", mask: true });
            setTimeout(() => {
              location.reload();
            }, 1000);
          })
          .catch(err => {
            _this.$toast.fail("接受任务失败！");
          });
      }
    },
    // 管理员拒绝工程单
    rejectReport() {
      var _this = this;
      this.$createDialog({
        title: "请填写拒绝理由",
        icon: "cubeic-warn",
        type: "prompt",
        onConfirm: (event, value) => {
          if (!value) {
            _this.$notify("请填写拒绝理由！");
            return false;
          }

          RejectEngineer(this.$route.params.id, value)
            .then(res => {
              this.$toast.success({ message: "已拒绝该工程单！", mask: true });
              setTimeout(() => {
                location.reload();
              }, 1000);
            })
            .catch(err => {
              this.$toast.fail("操作失败！");
            });
        }
      }).show();
    },
    // 选择维修员
    async chooseRepairmen() {
      let res = await GetRepairmenList();
      return new Promise((resolve, reject) => {
        this.$createPicker({
          title: "请选择维修员",
          data: [res.data.data],
          alias: {
            value: "user_id",
            text: "username"
          },
          onSelect: (value, index, text) => {
            resolve(value[0]);
          },
          onCancel: e => {
            reject(e);
          }
        }).show();
      });
    },
    // 指派维修员
    assignRepairmen() {
      if (!this.form_model.assignType) {
        this.$toast("请选择类型");
        return false;
      }

      GetRepairmenList().then(res => {
        this.$createPicker({
          title: "请选择维修员",
          data: [res.data.data],
          alias: {
            value: "user_id",
            text: "username"
          },
          onSelect: (value, index, text) => {
            AssignRepairmen(
              value[0],
              this.$route.params.id,
              this.form_model.assignType
            )
              .then(res => {
                this.$toast.success({
                  message: "已成功指派维修员！",
                  mask: true
                });
                setTimeout(() => {
                  location.reload();
                }, 1000);
              })
              .catch(err => {
                this.$toast.fail("指派维修员失败！");
              });
          }
        }).show();
      });
    },
    // 提交维修完成
    completedMaintain() {
      this.$createDialog({
        title: "确定维修完成？",
        content: "请确保已提交所有维修记录",
        icon: "cubeic-warn",
        type: "confirm",
        onConfirm: () => {
          CompletedMaintain(this.$route.params.id)
            .then(res => {
              this.$toast.success({
                message: "已提交完成，请等待领班审核",
                mask: true
              });
              setTimeout(() => {
                location.reload();
              }, 1000);
            })
            .catch(err => {
              this.$toast.fail("提交失败！");
            });
        }
      }).show();
    },
    // 领班审批维修通过
    approvalAgreeMaintain() {
      this.$createDialog({
        title: "确定维修通过？",
        icon: "cubeic-warn",
        type: "confirm",
        onConfirm: () => {
          let follow_id = this.info_data.pro_follow
            .slice(-1)[0]
            .pro_follow.slice(-1)[0].id;
          if (this.info_data.status == 7) {
            ApprovalAgainAdopt(this.$route.params.id, follow_id)
              .then(res => {
                this.$toast.success({ message: "已通过审批", mask: true });
                setTimeout(() => {
                  location.reload();
                }, 1000);
              })
              .catch(err => {
                this.$toast.fail("操作失败！");
              });
          } else if (this.info_data.status == 8) {
            ApprovalSingleAgainAdopt(this.$route.params.id, follow_id)
              .then(res => {
                this.$toast.success({ message: "已通过审批", mask: true });
                setTimeout(() => {
                  location.reload();
                }, 1000);
              })
              .catch(err => {
                this.$toast.fail("操作失败！");
              });
          } else {
            ApprovalAgreeMaintain(this.$route.params.id, follow_id)
              .then(res => {
                this.$toast.success({ message: "已通过审批", mask: true });
                setTimeout(() => {
                  location.reload();
                }, 1000);
              })
              .catch(err => {
                this.$toast.fail("操作失败！");
              });
          }
        }
      }).show();
    },
    // 领班驳回维修记录
    approvalRejectMantain() {
      var _this = this;
      this.$createDialog({
        title: "请填写未通过理由",
        type: "prompt",
        content: "将重新指派维修员",
        onConfirm: onEdited
      }).show();

      async function onEdited(event, value) {
        if (!value) {
          _this.$notify("请填写未通过理由！");
          return false;
        }

        let follow_id = _this.info_data.pro_follow
          .slice(-1)[0]
          .pro_follow.slice(-1)[0].id;

        ApprovalRejectMantain(_this.$route.params.id, value, follow_id)
          .then(res => {
            _this.$toast.success({ message: "操作成功", mask: true });
            setTimeout(() => {
              location.reload();
            }, 1000);
          })
          .catch(err => {
            _this.$toast.fail("操作失败！");
          });
      }
    },
    // 领班驳回
    approvalDismissMantain() {
      var _this = this;
      this.$createDialog({
        title: "请填写驳回理由",
        type: "prompt",
        content: "流程将回到待领取",
        onConfirm: (event, value) => {
          if (!value) {
            _this.$notify("请填写拒绝理由！");
            return false;
          }
          ApprovalLeadRefuse(_this.$route.params.id, value)
            .then(res => {
              _this.$toast.success({ message: "操作成功", mask: true });
              setTimeout(() => {
                location.reload();
              }, 1000);
            })
            .catch(err => {
              _this.$toast.fail("操作失败！");
            });
        }
      }).show();
    }
  },

  mounted() {
    //  获取页面数据
    GetEngineerDetail(this.$route.params.id).then(res => {
      var data = res.data.data;
      // 维修附件JSON格式转换
      data.pro_follow.forEach(item => {
        item.pro_follow.forEach(follow => {
          follow.file = JSON.parse(follow.file);
        });
      });

      this.info_data = data;
      // 填单人信息
      var info = this.user_info;
      info.user_name = data.pro_user.username;
      info.user_avatar = data.pro_user.user_logo;
      info.report_status = data.status;
      info.user_id = data.pro_user.userid;
      info.department = data.pro_user.department;
      info.position = data.pro_user.position;

      this.approver = data.user_approval.map(item => {
        return {
          approver_name: item.user.username,
          approver_avatar: item.user.user_logo,
          approver_status: item.status,
          approver_date: item.create_time,
          transfer_men: item.tran_user && item.tran_user.username
        };
      });

      if (this.info_data.my_type == 2) {
        MarkRead(this.$route.params.id);
      }
    });

    // 获取指派类型
    GetProTypeList().then(res => {
      this.options.assignType = res.data.data;
    });
  }
};
</script>

<style scoped src="./details.css"></style>
<style>
</style>
