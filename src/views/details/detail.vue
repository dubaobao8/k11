<template>
  <div class="detail-page bg-white">
    <!-- <navigate class="nav-bar" :navName="navName"></navigate> -->
    <main class="fs08 pd20">
      <!-- 标题 -->
      <div class="head-wrp">
        <!-- <img class="head-icon"> -->
        <div class="head-left">
          <img :src="desc.user_logo" class="fa fa-user-circle detail-head-img crtm">
          <h3 class="detail-user-info">
            <span class="detail-head-text detail-head-title">{{desc.username}}</span>
            <span class="detail-head-text ">事件报告
              <span :style="{color:statusColor,borderColor:statusColor}"
                    class="r-status">{{desc.status | transStatus}}</span>
            </span>
            <span class="detail-head-text ">员工号：{{desc.userid}}</span>
            <span class="detail-head-text ">所在部门：{{desc.department}}</span>
            <span class="detail-head-text ">职位：{{desc.position}}</span>

          </h3>
        </div>
        <div class="head-right" v-if="isPc">
          <a :href="$store.state.domain+'/print_report.html?port_id='+desc.id"
             class="fa fa-file-pdf-o h-pdf"
             target="_blank"></a>
          <!-- <i class="fa fa-print h-print" @click="getPrint"></i> -->
        </div>
      </div>
      <!-- 详细列表 -->
      <div class="divider"></div>
      <section class="part-list">
        <h5 class="p-title">报告摘要</h5>
        <span class="p-desc">{{desc.abstract}}</span>
      </section>
      <!--事件类型-->
      <section class="part-list">
        <h5 class="p-title">事件类型</h5>
        <span class="p-desc">{{desc.type}}{{desc.more_type?","+desc.more_type:""}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">事件报告编号</h5>
        <span class="p-desc">{{desc.work_num}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">项目名称</h5>
        <span class="p-desc">{{desc.title}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">大簿编号</h5>
        <span class="p-desc">{{desc.book_num}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">报告日期</h5>
        <span class="p-desc">{{desc.create_time | transDate}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">事件发生日期</h5>
        <span class="p-desc">{{desc.happen_time | transDate}}</span>
      </section>

      <section class="part-list">
        <h5 class="p-title">地点</h5>
        <span class="p-desc">{{desc.place}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">详细地点</h5>
        <span class="p-desc">{{desc.detail_place}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">保险相关</h5>
        <span class="p-desc">{{desc.is_safe | isSafe}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">警察/消防到达时间</h5>
        <span class="p-desc">{{desc.po_time | transTime}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">救伤车到达时间</h5>
        <span class="p-desc">{{desc.doc_time | transTime}}</span>
      </section>
      <div class="divider"></div>

      <!-- 明细 详情-->
      <section class="parti mb20">
        <div class="fw-b mb10 mt10">明细</div>
        <!-- 明细 模版-->
        <template v-for="(item,index) in desc.details">
          <div :key="index">
            <section class="part-list">
              <h5 class="p-title">日期+时间</h5>
              <span class="p-desc">{{item.date_time | transTime}}</span>
            </section>
            <section class="part-list">
              <h5 class="p-title">详情</h5>
              <span class="p-desc">{{item.content}}</span>
            </section>

            <v-file-preview :files="item.file" v-if="item.file&&item.file.length"/>

            <div class="divider"></div>
          </div>
        </template>

        <!-- 附件-->
        <section class="part-list mt20"
                 id="file-de"
                 style="display: block;padding: 0;"
                 v-if="desc.file_url && desc.file_url.length">
          <h5 class="p-title mb15" style="text-align: left">附件</h5>
          <div class="p-f-wrp">

            <v-file-preview :files="desc.file_url.concat()"/>

          </div>
        </section>
        <!--<p v-if="isMounted">{{file_swiper.realIndex}} / {{file_swiper.slides.length}}</p>-->

        <!--<div class="divider"></div>-->

        <!-- 追加明细 -->
        <div class="details-wrp" v-if="access.isUpload">
          <!-- 添加明细模版 -->
          <template v-for="(item,index) in detials">
            <div :key="index">
              <p class="mxindex">明细{{index+1}}</p>
              <div @click="showDetailDatePicker('add_detial_time_'+index,index)" class="details-time">
                <div class="form-title fx100">
                  日期+时间
                  <span class="required">*</span>
                </div>
                <div class="crbbb dpfx fxac">
                  <span v-if="!item.date_time">请选择&nbsp;</span>
                  <span v-else>{{item.date_time | transDate}}</span>
                  <i class="ml5 fa fa-chevron-right"></i>
                </div>
              </div>
              <div class="details-d">
                <div class="form-title mb10">
                  详情
                  <span class="required">*</span>
                </div>
                <cube-textarea :autoExpand="false"
                               :maxlength="200"
                               placeholder="请输入"
                               v-model="item.content"></cube-textarea>
              </div>

              <file-add :file-obj="fileObj"
                        :key="fileIndex"
                        @del="item.file.splice(fileIndex,1)"
                        class="pl15 pr15 mb15"
                        v-for="(fileObj,fileIndex) in item.file"
                        v-model="fileObj.title"/>

              <label class="add-details-inside-file">
                <i class="fa fa-plus-circle"></i>
                <input @change="addInsideFile(item,$event)" class="file-input" type="file">
                添加明细附件
              </label>

              <div class="del-detail clear ">
                <div @click="delDetail(index)" class="fl-right">
                  <i class="fa fa-minus-circle"></i>
                  删除该明细
                </div>
              </div>
              <div class="divider"></div>
            </div>
          </template>

          <!-- 添加明细按钮 -->
          <div @click="addDetail" class="add-details">
            <i class="fa fa-plus-circle"></i>
            添加明细
          </div>

          <!--<div class="divider"></div>-->

          <!-- 已添加附件 -->
          <section>
            <file-add :file-obj="item"
                      :key="index"
                      @del="delFile(index)"
                      class="pl15 pr15 mb15"
                      v-for="(item, index) in atfile"
                      v-model="item.title"/>
          </section>

          <!-- 添加附件 -->
          <label @change="chooseFile" class="add-details-file" style="color: #00ABC6;" v-if="access.isUpload">
            <input class="file-input" type="file">
            <i class="fa fa-plus-circle" style="color: #00ABC6;"></i>
            添加附件
          </label>

          <!-- 提交跟进 按钮 -->
          <cube-button :inline="true"
                       :primary="true"
                       @click="FollowAdd"
                       class="form-sub"
                       style="background-color: #00ABC6;"
                       type="submit"
                       v-if="access.isUpload">提交跟进
          </cube-button>

          <!-- <cube-button class="pd15" type="submit" :primary="true">上传明细</cube-button> -->
        </div>
        <!-- 追加备注 -->
        <div class="details-wrp">
          <div class="form-title mb10 fw-b">备注</div>
          <!-- 已追加的备注列表 -->
          <template v-for="(item, index) in desc.postil">
            <section :key="index" class="approve-w">
              <h5 class="fs08 fw-b mb15">{{item.username}}的备注：</h5>
              <div>{{item.postil}}</div>
            </section>
          </template>
          <!-- 添加备注 -->
          <div>
            <div class="details-d" style="padding:15px 0">
              <div class="form-title mb10">
                添加备注
                <!-- <span class="required">*</span> -->
              </div>
              <cube-textarea :autoExpand="false" :maxlength="200" placeholder="请输入" v-model="yj"></cube-textarea>
            </div>
          </div>

          <cube-button :primary="true"
                       @click="Suggest"
                       class="pd15"
                       style="height: 2.4rem;padding: 0;font-size: 1rem;"
                       type="submit">提交备注
          </cube-button>
        </div>
      </section>
      <!-- 审批流程 -->
      <div class="divider"></div>
      <section class="approve-w">
        <div class="cr8 fw-b">审批流程</div>

        <div :key="index" class="approve-list" v-for="(item, index) in desc.check_user">
          <i :class="item.Sclass" :style="{color:item.Scolor}" class="a-status"></i>
          <img :src="item.user_logo" class="a-img">
          <span class="a-name">
            <span>
              {{item.username}} · {{item.agree | transStatus}}
              <span class="mr10" v-if="item.agree==5&&desc.transfer_name"> → {{desc.transfer_name}}
              </span>
            </span>
          </span>
          <span class="a-date">{{item.time | transTime}}</span>
        </div>

        <!-- <div class="approve-list" v-if="desc.check_user">
                  <i class="a-status fa fa-circle-o"></i>
                  <img class="a-img" :src="desc.check_user[1].user_logo">
                  <span class="a-name">{{desc.check_user[1].username}} · {{desc.fin_agree | transStatus}}</span>
                  <span class="a-date">{{desc.boss_time | transTime}}</span>
                </div>-->
        <div class="divider"></div>
        <div class="copy-men">
          抄送人：
          <span :key="index" v-for="(item,index) in desc.look_user">{{item.username }}&nbsp;</span>
        </div>
      </section>
      <!-- ----------------------------------------------------------------------------- -->
      <!-- 审批意见列表 -->
      <section :key="index" class="operation" v-for="(item, index) in desc.operation">
        <h5 class="operation__section">
          <span class="operation__title">{{item.status*1===(2||4)?'终审人':'审批人'}}：</span>
          <span class="operation__operator">{{item.username}}</span>
          <span class="operation__position">{{item.position}}</span>
        </h5>
        <p class="operation__section">
          <span class="operation__title">操作结果：</span>
          <span class="operation__result">{{item.status | operationType}}</span>
        </p>
        <p class="operation__section">
          <span class="operation__title">审批时间：</span>
          <span class="operation__time">{{item.create_time | transTime}}</span>
        </p>
        <div class="operation__section">
          <span class="operation__title">审批意见：</span>
          <span class="operation__content__text">{{item.content}}</span>
        </div>
        <div class="divider mt15 mb15"></div>
      </section>

      <!-- 审批意见输入框 -->
      <section class="approve-w" v-if="access.isOpinion">
        <h5 class="fs08 fw-b mb15">
          审批意见
          <span class="required">*</span>
        </h5>
        <cube-input :disabled="!access.canOpinion" v-model="opinions"></cube-input>
      </section>

      <!-- 转审意见输入框 -->
      <section class="approve-w" v-if="access.isZs">
        <h5 class="fs08 fw-b mb15">
          转审意见
          <span class="required">*</span>
        </h5>
        <cube-input v-model="ZSopinions"></cube-input>
      </section>

      <!-- 审批评分（星星） -->
      <section class="approve-w" v-if="access.isRate&&isStar">
        <h5 class="fs08 fw-b mb15" style="position:relative;">
          审批评分
          <span @click="isStar=false" class="noRate" v-if="access.canRate">不评分</span>
        </h5>

        <div class="ap-star-wrp">
          <cube-rate :disabled="!access.canRate" :justify="true" class="ap-stars" v-model="star"></cube-rate>
        </div>
      </section>

      <!-- 操作按钮 -->
      <section class="approve-w ap-btns" v-if="access.isButton">
        <button @click="Agree"
                @mouseout="isPc&&$refs.agree.hide()"
                @mouseover="isPc&&$refs.agree.show()"
                class="ap-btn">
          同意
          <cube-tip direction="bottom" ref="agree" style="margin-left:-2rem">
            同意审批此事件报告
          </cube-tip>
        </button>
        <button @click="Reject"
                @mouseout="isPc&&$refs.reject.hide()"
                @mouseover="isPc&&$refs.reject.show()"
                class="ap-btn">
          驳回
          <cube-tip direction="bottom" ref="reject" style="margin-left:-4rem" v-if="isPc">拒绝审批此事件报告，报告将回到发起人
          </cube-tip>
        </button>
        <button @click="Transfer"
                @mouseout="isPc&&$refs.trans.hide()"
                @mouseover="isPc&&$refs.trans.show()"
                class="ap-btn">
          转审
          <cube-tip direction="bottom" ref="trans" style="margin-left:-2rem" v-if="isPc">转交给相关同事进行批注<br>批注后该报告仍需要审批
          </cube-tip>
        </button>
        <button @click="Follow" class="ap-btn" v-show="access.isFollowUp">跟进</button>
        <!-- ------------------------------------------------------------------------- -->
      </section>
      <div class="mt15" v-if="access.isButton&&!isPc">
        <p class="longtips">同意：同意审批此事件报告。</p>
        <p class="longtips" style="background-color: #fef0f0; color: #f56c6c;">拒绝：拒绝审批此事件报告，报告将回到发起人。</p>
        <p class="longtips" style="background-color: #fdf6ec; color: #e6a23c;">转审：转交给相关同事进行批注，批注后该报告仍需要审批。</p>
      </div>

      <div class="add-copier" v-if="access.isButton">
        <v-ccp-container :ccp="ccp" :ccp_selection="ccp_selection" class="mt20"/>
        <div @click="addCopier" class="form-submit-block">添加抄送人</div>
      </div>

      <!-- 确定转审 -->
      <cube-button :inline="true" :primary="true" @click="Postil" class="form-sub" type="submit" v-if="access.isZsBtn">
        确定
      </cube-button>
      <!-- 撤回申请 -->
      <!-- <cube-button
              v-if="access.isWithdraw"
              class="form-sub form-sub-red"
              type="submit"
              :inline="true"
              @click="Withdraw"
            >撤回</cube-button>-->
      <!-- 重新填写 -->
      <cube-button :inline="true"
                   @click="fillAgain"
                   class="form-sub form-sub-red"
                   type="submit"
                   v-if="access.isfillAgain">重新填写
      </cube-button>
    </main>
  </div>
</template>

<script>
  import axios from "axios/index";
  import util from "../../util/util.js";
  import FileAdd from "@/components/file-add/file-add";
  import {deepCopy} from "../../util/util";
  import {uploadDetailFile} from "@/api/initiate/initiate";
  import {incidentSendFollow} from "@/api/details/detail";
  import bus from "@/js/event";
  import VCcpContainer from "@/components/form/v-ccp-container";
  import {CopierInfo} from "@/api/initiate/purchase";
  import request from "@/api";
  import VFilePreview from "@/components/details/v-file-preview";

  const operationType = {
    "1": "同意",
    "2": "同意",
    "3": "驳回",
    "4": "驳回",
    "5": "跟进",
    "6": "转审",
    "7": "提交转审批注",
    "8": "提交跟进内容",
    "9": "重新提交",
    "10": "备注"
  };

  export default {
    components: {
      VFilePreview,
      VCcpContainer,
      FileAdd,
    },
    data() {
      return {
        isStar: true,
        navName: "我的事件报告",
        access: {
          isOpinion: false,
          canOpinion: false,
          isRate: false,
          canRate: false,
          isButton: false,
          isUpload: false,
          isZs: false,
          isZsBtn: false,
          canZSOpinion: false,
          isWithdraw: false,
          isFollowUp: false,
          isDelfile: false,
          isfillAgain: false
        },

        desc: {
          create_time: 0,
          date_time: 0,
          doc_time: 0,
          happen_time: 0,
          po_time: 0
        },
        status: "",
        opinions: "",
        ZSopinions: "",
        star: 0,
        atfile: [],
        detials: [
          {
            date_time: "",
            content: "",
            file: []
          }
        ],
        sub_detials: [
          {
            date_time: "",
            content: ""
          }
        ],
        transMen: [],
        isUpwrp: false,
        yj: "",
        imgs: [],
        ccp: [],
        ccp_selection: []
      };
    },
    methods: {
      // 显示附件上传的框框

      // 转审跟进上传
      chooseFile(e) {
        var file = e.target.files[0];
        this.atfile.push({
          file: file,
          title: "",
          image: window.URL.createObjectURL(file)
        });
        e.target.value = "";
      },
      // 删除转审跟进
      delFile(i) {
        this.atfile.splice(i, 1);
      },
      // 选择明细日期
      showDetailDatePicker(n, i) {
        var vm = this;
        var name = n + "DetailDatePicker";
        if (!this[name]) {
          this[name] = this.$createDatePicker({
            title: "请选择日期",
            value: new Date(),
            columnCount: 5,
            format: {
              year: "YYYY年",
              month: "MM月",
              date: "DD日",
              hour: "hh时",
              minute: "mm分"
            },
            onSelect(date, val, text) {
              var newList = vm.detials.concat();
              newList[i].date_time = vm.transStamp(date.getTime());
              vm.detials = newList;
            }
          });
        }
        this[name].show();
      },
      delDetail(i) {
        this.$createDialog({
          type: "confirm",
          icon: "cubeic-alert",
          title: "确定删除该明细吗？",
          onConfirm: () => {
            this.detials.splice(i, 1);
            this.sub_detials.splice(i, 1);
          },
          onCancel: () => {
          }
        }).show();
      },
      addDetail() {
        var obj1 = {
          file: []
        };
        this.detials.push(obj1);
      },
      getPrint() {
        window.print();
      },

      // 审批操作
      // 撤回申请
      Withdraw(e) {
        this.$createDialog({
          type: "prompt",
          title: "请填写撤销理由",
          prompt: {
            value: "",
            placeholder: "请输入撤销理由"
          },
          onConfirm: (e, promptValue) => {
            if (!promptValue) {
              this.$createToast({
                type: "warn",
                time: 1000,
                txt: "请填写撤销理由！"
              }).show();
              return false;
            } else {
              var note = promptValue;
              // 提交撤销
              axios({
                baseURL: this.$store.state.domain,
                url: "/api/Approval/Withdraw",
                headers: {
                  token: localStorage.getItem("token")
                },
                method: "POST",
                data: {
                  port_id: this.$route.params.id
                }
              })
                .then(res => {
                  this.$root
                    .$createToast({
                      time: 1000,
                      type: "txt",
                      txt: "操作成功！您已撤回审批",
                      mask: true
                    })
                    .show();
                  // 提交备注
                  axios({
                    baseURL: this.$store.state.domain,
                    url: "/api/Approval/Suggest",
                    headers: {
                      token: localStorage.getItem("token")
                    },
                    method: "POST",
                    data: {
                      port_id: this.$route.params.id,
                      user_id: localStorage.getItem("user_id"),
                      content: note
                    }
                  }).then(res => {
                    setTimeout(() => {
                      this.$router.go(-1);
                    }, 800);
                  });
                })
                .catch(err => {
                  this.$createToast({
                    time: 1000,
                    type: "txt",
                    txt: "操作失败"
                  }).show();
                });
            }
          },
          onCancel: () => {
            return false;
          }
        }).show();
      },
      // 同意审批
      Agree() {
        if (localStorage.getItem("status") != 3) {
          this.star = 0;
        }
        if (!this.opinions) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请填写审批意见！"
          }).show();
          return false;
        }

        // if (localStorage.getItem("status") == 3 && !this.star) {
        //   this.$createToast({
        //     time: 1000,
        //     type: "txt",
        //     txt: "请评星！"
        //   }).show();
        //   return false;
        // }

        var tip = this.$createToast({
          time: 0,
          txt: "正在提交...",
          mask: true
        });
        tip.show();

        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Approval/Agree",
          headers: {
            token: localStorage.getItem("token")
          },
          method: "POST",
          data: {
            port_id: this.$route.params.id,
            user_id: localStorage.getItem("user_id"),
            content: this.opinions,
            star: this.star
          }
        })
          .then(res => {
            tip.hide();
            this.$root
              .$createToast({
                time: 1000,
                type: "txt",
                txt: "操作成功！您已同意审批",
                mask: true
              })
              .show();
            bus.$emit("del_list_item", this.$route.params.id);
            this.$router.go(-1);
          })
          .catch(err => {
            tip.hide();
            this.$createToast({
              time: 1000,
              type: "txt",
              txt: "操作失败"
            }).show();
          });
      },
      // 驳回审批
      Reject() {
        if (localStorage.getItem("status") != 3) {
          this.star = 0;
        }
        if (!this.opinions) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请填写审批意见！"
          }).show();
          return false;
        }

        var tip = this.$createToast({
          time: 0,
          txt: "正在提交...",
          mask: true
        });
        tip.show();

        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Approval/Reject",
          headers: {
            token: localStorage.getItem("token")
          },
          method: "POST",
          data: {
            port_id: this.$route.params.id,
            user_id: localStorage.getItem("user_id"),
            content: this.opinions,
            star: this.star
          }
        })
          .then(res => {
            tip.hide();
            this.$root
              .$createToast({
                time: 1000,
                type: "txt",
                txt: "操作成功！您已驳回审批",
                mask: true
              })
              .show();
            this.$router.go(-1);
            bus.$emit("del_list_item", this.$route.params.id);
          })
          .catch(err => {
            tip.hide();
            this.$createToast({
              time: 1000,
              type: "txt",
              txt: "操作失败"
            }).show();
          });
      },
      // 跟进
      Follow() {
        var vm = this;
        if (!this.opinions) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请填写跟进意见！"
          }).show();
          return false;
        }

        var tip = this.$createToast({
          time: 0,
          txt: "正在提交...",
          mask: true
        });
        tip.show();

        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Approval/Follow",
          headers: {
            token: localStorage.getItem("token")
          },
          method: "POST",
          data: {
            port_id: this.$route.params.id,
            user_id: localStorage.getItem("user_id"),
            content: this.opinions
          }
        })
          .then(res => {
            tip.hide();
            this.$root
              .$createToast({
                time: 1000,
                type: "txt",
                txt: "操作成功！您已选择跟进审批",
                mask: true
              })
              .show();
            this.$router.go(-1);
            bus.$emit("del_list_item", this.$route.params.id);
          })
          .catch(err => {
            tip.hide();
            this.$createToast({
              time: 1000,
              type: "txt",
              txt: "操作失败"
            }).show();
          });
      },
      // 转审
      Transfer() {
        var vm = this;
        if (!this.opinions) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请填写转审意见！"
          }).show();
          return false;
        }
        // 调起选择转审人
        if (!this.transSelectPicker) {
          this.transSelectPicker = this.$createCascadePicker({
            title: "请选择转审人",
            data: this.transMen,
            maskClosable: false,
            onSelect: (value, index, text) => {
              if (!vm.opinions) {
                this.$createToast({
                  time: 1000,
                  type: "txt",
                  txt: "获取转审意见失败，请重试"
                }).show();
                this.transSelectPicker.hide();
                return false;
              }

              var tip = this.$createToast({
                time: 0,
                txt: "正在提交...",
                mask: true
              });
              tip.show();

              axios({
                baseURL: vm.$store.state.domain,
                url: "/api/Approval/SendTrans",
                headers: {
                  token: localStorage.getItem("token")
                },
                method: "POST",
                data: {
                  port_id: vm.$route.params.id,
                  send_id: value[1],
                  check_id: localStorage.getItem("user_id"),
                  content: vm.opinions
                }
              })
                .then(res => {
                  tip.hide();
                  vm.$root
                    .$createToast({
                      time: 1000,
                      type: "txt",
                      txt: "操作成功！您已选择转审"
                    })
                    .show();
                  vm.$router.go(-1);
                  bus.$emit("del_list_item", this.$route.params.id);
                })
                .catch(err => {
                  tip.hide();
                  vm.$createToast({
                    time: 1000,
                    type: "txt",
                    txt: "操作失败"
                  }).show();
                });
            },
            cancel: () => {
              this.transSelectPicker.hide();
            }
          });
        }
        this.transSelectPicker.show();
      },
      //  ///////////////////////////////////////////////////
      // 转审意见提交（批注）
      Postil() {
        var vm = this;
        if (!this.ZSopinions) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请填写转审意见！"
          }).show();
          return false;
        }

        var tip = this.$createToast({
          time: 0,
          txt: "正在提交...",
          mask: true
        });
        tip.show();

        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Approval/Postil",
          headers: {
            token: localStorage.getItem("token")
          },
          method: "POST",
          data: {
            port_id: this.$route.params.id,
            user_id: localStorage.getItem("user_id"),
            content: this.ZSopinions
          }
        })
          .then(res => {
            tip.hide();
            this.$root
              .$createToast({
                time: 1000,
                type: "txt",
                txt: "转审意见提交成功！"
              })
              .show();
            vm.$router.go(-1);
          })
          .catch(err => {
            tip.hide();
            vm.$createToast({
              time: 1000,
              type: "txt",
              txt: "操作失败"
            }).show();
          });
      },

      // 跟进提交校验
      verifyFollow() {
        var vm = this;
        // if (!this.atfile.length) {
        //     this.$createToast({
        //         time: 1000,
        //         type: "txt",
        //         txt: "请选择附件！"
        //     }).show();
        //     return false;
        // }

        // 至少有一个附件
        var details_has_file = this.detials.some(detail => detail.file.length);
        if (!this.atfile.length && !details_has_file) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请至少上传一个附件！"
          }).show();
          return false;
        }

        if (!this.detials.length) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请填写明细！"
          }).show();
          return false;
        }

        if (
          this.detials.some((v, i, arr) => {
            return !v.content || !v.date_time;
          })
        ) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请将明细填写完整！"
          }).show();
          return false;
        }

        if (
          this.atfile.some((value, index) => {
            if (!value.title) {
              return true;
            }
          })
        ) {
          vm.$createToast({
            txt: "请将附件标题填写完整",
            time: 1500,
            type: "error"
          }).show();
          return false;
        }
        var details = this.detials;

        // 验证明细及明细内附件标题
        var verifyDetails = (element, index) => {
          // 验证明细是否填写完整
          if (!element.content || !element.date_time) {
            this.$createToast({
              type: "error",
              txt: `请将明细${index + 1}填写完整！`
            }).show();
            return true;
          }
          let files = element.file;
          // 验证明细内附件标题
          if (files.some((ele, i) => !ele.title)) {
            this.$createToast({
              type: "error",
              txt: `请将明细${index + 1}内附件标题填写完整！`
            }).show();
            return true;
          }
        };
        if (details.some(verifyDetails)) {
          return false;
        }
        return true;
      },
      /**
       * 提取明细内文件
       * @param i 索引
       * @return 一个包含一组明细内所有附件的FormData 和 没有文件的detail
       */
      getFileFormData(i) {
        let detail = deepCopy(this.detials[i]);
        detail.file = [];
        let fileFormData = new FormData();
        this.detials[i].file.forEach((e, i) => {
          fileFormData.append("file[]", e.file);
          fileFormData.append("title[]", e.title);
        });

        return {
          fileFormData,
          detail
        };
      },
      // 处理跟进数据，并转成FormData
      resolveFollow(details) {
        let formData = new FormData();
        formData.append("details", JSON.stringify(details));
        formData.append("port_id", this.$route.params.id);
        formData.append("user_id", localStorage.getItem("user_id"));

        this.atfile.forEach((e, i) => {
          formData.append("file[]", e.file);
          formData.append("file_title[]", e.title);
        });

        return formData;
      },

      // 跟进添加附件提交
      FollowAdd() {
        // 校验表单
        if (!this.verifyFollow()) {
          return false;
        }

        let details = deepCopy(this.detials);

        var loading = this.$createToast({
          txt: "正在提交...",
          time: 0,
          mask: true
        });
        loading.show();

        let counter = details.length;
        details.forEach((e, i) => {
          let {fileFormData, detail} = this.getFileFormData(i);
          details[i] = detail;
          uploadDetailFile(fileFormData)
            .then(res => {
              if (Array.isArray(res.data.data)) {
                details[i].file = details[i].file.concat(res.data.data);
              }
              counter--;
              if (counter < 1) {
                let formData = this.resolveFollow(details);
                incidentSendFollow(formData)
                  .then(res => {
                    loading.hide();
                    this.$root
                      .$createToast({txt: "提交成功", type: "correct"})
                      .show();
                    this.$router.go(-1);
                  })
                  .catch(err => {
                    loading.hide();
                    this.$createToast({
                      txt: "上传表单失败",
                      type: "error"
                    }).show();
                    console.log(err);
                  });
              }
            })
            .catch(err => {
              loading.hide();
              this.$createToast({
                txt: "上传明细附件失败",
                type: "error"
              }).show();
              console.log("上传明细附件失败", err);
            });
        });
      },

      // 添加明细内附件
      addInsideFile(item, event) {
        var file = event.target.files[0];
        item.file.push({
          file: file,
          title: "",
          image: window.URL.createObjectURL(file)
        });
        event.target.value = "";
        this.detials = this.detials.concat();
      },

      // 上传备注
      Suggest() {
        if (!this.yj) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请填写备注！"
          }).show();
          return false;
        }
        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Approval/Suggest",
          headers: {
            token: localStorage.getItem("token")
          },
          method: "POST",
          data: {
            port_id: this.$route.params.id,
            user_id: localStorage.getItem("user_id"),
            content: this.yj
          }
        }).then(res => {
          this.$root
            .$createToast({
              time: 1000,
              type: "txt",
              txt: "添加成功！",
              mask: true
            })
            .show();
          setTimeout(() => {
            location.reload();
          }, 1000);
        });
      },
      // 删除附件
      deleteFile(id, i) {
        var vm = this;
        this.$createDialog({
          type: "confirm",
          icon: "cubeic-alert",
          title: "确定删除附件？",
          onConfirm: () => {
            axios({
              baseURL: this.$store.state.domain,
              url: "/api/approval/Delete",
              headers: {
                token: localStorage.getItem("token")
              },
              method: "POST",
              data: {
                id: id
              }
            })
              .then(res => {
                vm.$createToast({
                  type: "warn",
                  time: 1000,
                  txt: "删除成功！"
                }).show();
                vm.desc.file_url.splice(i, 1);
              })
              .catch(err => {
                console.log(err);
                vm.$createToast({
                  type: "warn",
                  time: 1000,
                  txt: "操作失败！"
                }).show();
              });
          }
        }).show();
      },
      // 时间戳转10位
      transStamp(n) {
        if (n.toString().length > 10) {
          return Math.floor(n / 1000);
        }
      },
      // 驳回重新填写
      fillAgain() {
        this.$router.push({
          path: "/report",
          query: {
            mode: "change",
            id: this.$route.params.id
          }
        });
      },
      // 显示气泡
      showTip(n) {
        console.log(this.$refs);
        this.$refs[n].show();
      },
      // 添加抄送人
      addCopier() {
        if (!this.ccp.length) {
          this.$toast({message: "请添加抄送人！"});
          return false
        }

        var ccpSource = this.ccp.map(item => item.id).concat(this.desc.look_user.map(item => item.id));
        var ccp = Array.from(new Set(ccpSource)).join(',');

        request.post('/api/Approval/CheckLook', {
          port_id: this.$route.params.id,
          look_user: ccp
        }).then(res => {
          this.$toast.success('添加成功！');
          setTimeout(() => {
            location.reload()
          }, 500)
        }).catch(err => {
          this.$toast.fail('操作失败！');
        })
      }
    },
    computed: {
      isPc() {
        var userAgentInfo = navigator.userAgent;
        var Agents = [
          "Android",
          "iPhone",
          "SymbianOS",
          "Windows Phone",
          "iPad",
          "iPod"
        ];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
            flag = false;
            break;
          }
        }
        return flag;
      },
      statusColor() {
        switch (this.desc.status) {
          case 1:
            return "rgba(85, 133, 240, 1)";
          case 2:
            return "#69AF50";
          case 3:
            return "#D9932D";
          case 4:
            return "#C79BDD";
          case 5:
            return "#009688";
        }
      }
    },
    mounted() {
      var vm = this;
      // 请求页面
      axios({
        baseURL: this.$store.state.domain,
        url: "/api/Report/Details",
        method: "POST",
        headers: {
          token: localStorage.getItem("token")
        },
        data: {
          user_id: localStorage.getItem("user_id"),
          port_id: this.$route.params.id
        }
      }).then(res => {
        var data = res.data.data[0];

        vm.desc = data;

        // 权限判断
        switch (this.desc.my_type) {
          // 我的申请
          case 1:
            switch (this.desc.status) {
              case 1:
                this.access.isWithdraw = true;
                break;
              case 2:
                this.access.isRate = true;
                break;
              case 3:
                this.access.isRate = true;
                this.access.isfillAgain = true;
                break;
              case 4:
                this.access.isUpload = true;
                break;
              case 5:
                this.access.isZs = true;
                break;
            }
            break;
          // 待我审批
          case 2:
            switch (this.desc.status) {
              case 1:
                this.access.isButton = true;
                this.access.isOpinion = true;
                this.access.canOpinion = true;
                if (localStorage.getItem("status") == 3 && this.desc.agree == 2) {
                  this.access.canRate = true;
                  this.access.isRate = true;
                  this.star = 0;
                }
                break;
              case 2:
              case 3:
                this.access.isRate = true;
                break;
              case 4:
                break;
              case 5:
                this.access.isZs = true;
                this.access.canZSOpinion = true;
                this.access.isZsBtn = true;
            }

            break;
          // 抄送我的
          case 3:
            switch (this.desc.status) {
              case 1:
                break;
              case 2:
              case 3:
                this.access.isRate = true;
                break;
              case 4:
                break;
              case 5:
                this.access.isZs = true;
                break;
            }
            break;
        }

        // 如果已读，不可撤回
        if (this.desc.read == 2) {
          this.access.isWithdraw = false;
        }
        // 设置已读
        if (this.desc.my_type == 2) {
          axios({
            baseURL: this.$store.state.domain,
            url: "/api/Report/ReadReport",
            headers: {
              token: localStorage.getItem("token")
            },
            method: "POST",
            data: {
              port_id: this.$route.params.id
            }
          })
        }
        // 处理审批人状态
        if (this.desc.check_user[0]) {
          this.desc.check_user[0].agree = this.desc.agree;
          this.desc.check_user[0].time = this.desc.lead_time;
        }
        if (this.desc.check_user[1]) {
          this.desc.check_user[1].agree = this.desc.fin_agree;
          this.desc.check_user[1].time = this.desc.boss_time;
        }
        // 审批流程状态图标
        this.desc.check_user.forEach((e, i) => {
          switch (e.agree) {
            case 1:
              e.Scolor = "rgba(85, 133, 240, 1)";
              e.Sclass = "fa fa-circle-o";
              break;
            case 2:
              e.Scolor = "rgba(85, 133, 240, 1)";
              e.Sclass = "fa fa-check-circle";
              break;
            case 3:
              e.Scolor = "rgb(255, 0, 76)";
              e.Sclass = "fa fa-times-circle";
              break;
            case 4:
              e.Scolor = "#C79BDD";
              e.Sclass = "fa fa-dot-circle-o";
              break;
            case 5:
              e.Scolor = "#009688";
              e.Sclass = "fa fa-refresh";
              break;
          }
        });
        // 只能同意一次
        var id = localStorage.getItem("user_id") * 1;
        this.desc.check_user.forEach((e, i) => {
          if (e.id == id && e.agree != 1) {
            // console.log(e.id, e.agree);
            this.access.isButton = false;
            this.access.isOpinion = false;
            this.access.canOpinion = false;
          }
        });
        // 不是转审人不能填写审批意见
        // console.log(this.desc.transfer, localStorage.getItem("user_id"));
        if (this.desc.transfer != localStorage.getItem("user_id") * 1) {
          this.access.isZs = false;
          this.access.isZsBtn = false;
        }
        // 上级未通过，BOSS不能操作
        if (this.desc.agree != 2 && localStorage.getItem("status") == 3) {
          this.access.isButton = false;
          this.access.isOpinion = false;
          this.access.isRate = false;
        }
        // 星星展示
        try {
          var star = 0;
          if (this.desc.operation && this.desc.operation.length) {
            star = this.desc.operation[this.desc.operation.length - 1].star;
          } else {
            star = 0;
          }
          this.star = star;
        } catch (err) {
        }
        // 只有BOSS可以点击跟进按钮
        if (localStorage.getItem("status") == 3) {
          this.access.isFollowUp = true;
        }
        // 只有自己可以删除文件
        if (this.desc.user_id == localStorage.getItem("user_id")) {
          this.access.isDelfile = true;
        }
        // 判断是否为特殊类型，特殊终审人
        if (this.desc.special_user == localStorage.getItem("user_id") && this.desc.agree == 2 && this.desc.fin_agree != 2) {
          this.access.isFollowUp = true;
          this.access.isButton = true;
          this.access.isOpinion = true;
          this.access.canOpinion = true;
          this.access.canRate = true;
          this.access.isRate = true;
          this.star = 0;
        }
      });
      axios({
        baseURL: this.$store.state.domain,
        url: "/api/report/lookuser",
        headers: {
          token: localStorage.getItem("token")
        },
        method: "POST",
        data: {}
      }).then(res => {
        var data = res.data.data;
        var list = [];
        data.forEach((e, i) => {
          var dep = {};
          dep.value = e.department;
          dep.text = e.department;
          dep.children = [];
          e.user.forEach((e, i) => {
            var user = {};
            user.value = e.id;
            user.text = e.username;
            dep.children.push(user);
          });
          list.push(dep);
        });
        this.transMen = list;
      });

      // 获取抄送人列表
      request.post('/api/report/lookuser').then(res => {
        console.log(res.data.data)
        this.ccp_selection = res.data.data.map(item => {
          return {
            text: item.department,
            value: item.id,
            children: item.user.map(user => {
              return {
                text: user.username,
                value: {
                  avatar: user.user_logo,
                  username: user.username,
                  id: user.id
                }
              }
            })
          }
        })
      })
    },

    filters: {
      transDate(v) {
        return util.stampToString(v);
      },
      transTime(v) {
        return util.stampToString(v, "/", true);
      },
      transStatus(v) {
        switch (v) {
          case 1:
            return "待审批";
          case 2:
            return "已通过";
          case 3:
            return "已驳回";
          case 4:
            return "跟进中";
          case 5:
            return "转审中";
        }
      },
      isSafe(v) {
        switch (v) {
          case 1:
            return "否";
          case 2:
            return "是";
        }
        return;
      },
      operationType(v) {
        return operationType[v];
      }
    }
  };
</script>

<style>
  .files-wrp {
    width: 80%;
    margin: 0 auto;
    position: relative;
  }

  .file_swiper_page {
    color: #999999;
    text-align: right;
    margin-top: 0.3rem;
  }

  .detail-head-img {
    width: 10rem;
    height: 10rem;
  }

  .detail-head-text {
    font-size: 0.9rem;
    /*margin-bottom: 0.85rem;*/
    color: #888;
    word-break: break-word;
    line-height: 1.3em;
  }

  .detail-head-title {
    font-size: 0.95rem;
    font-weight: bold;
    color: #333333;
  }

  .detail-user-info {
    display: flex;
    flex-direction: column;
    margin-left: 1.2rem;
    justify-content: space-between;
  }

  .add-details-inside-file {
    color: rgb(0, 171, 198);
    padding: 0 15px 15px 15px;
    font-weight: 500;
    font-size: 0.9rem;
    display: block;
  }

  .mxindex {
    font-size: 0.875rem;
    color: #999;
  }

  .operation {
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 0 15px;
  }

  .operation__title {
    font-size: 0.875rem;
    color: #999;
    display: inline-block;
  }

  .operation__section {
    margin-bottom: 0.6em;
  }

  .operation__operator {
    color: #666;
  }

  .operation__position {
    margin-left: 0.5rem;
    color: #aaaaaa;
    font-size: 0.75rem;
  }

  .operation__result {
    font-weight: bold;
  }

  .operation__time {
    color: #666666;
  }

  .operation__content__text {
    line-height: 1.5em;
  }
</style>

<style>
  .up-btn.up-cal {
    color: #ef5662;
    border-right: 1px solid #ebebeb;
  }

  .up-btn {
    width: 50%;
  }

  .saf {
    margin: 1.6rem 0;
  }

  .up-btn {
    outline: none;
    border: none;
    color: rgba(85, 133, 240, 1);
    font-weight: 400;
    line-height: 2.5rem;
    background-color: #fff;
    border-top: 1px solid #ebebeb;
    box-sizing: border-box;
  }

  .up-title {
    text-align: center;
    font-size: 1rem;
    margin: 15px;
    color: #333;
  }

  .file-input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .up-file-wrp {
    position: relative;
    flex: 1;
  }

  .up-content-wrp {
    width: 80%;
    max-width: 400px;
    /* height: 200px; */
    background-color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    border-radius: 2px;
  }

  .upLoadwrp {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99;
  }

  .upLoadwrp .attach {
    width: 50px;
    height: 50px;
    position: relative;
    border: 1px solid #888;
    display: block;
    margin: 0px auto 20px;
  }

  .at-wrp {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .at-r {
    width: 22px;
    height: 2px;
    background-color: #434552;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .at-c {
    width: 2px;
    height: 22px;
    background-color: #434552;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .p-desc {
    color: #333;
    flex: 1 0 0;
    white-space: normal;
    word-break: break-all;
    line-height: normal;
    /*margin-bottom: 15px;*/
    width: 100%;
  }

  .p-f-wrp {
    position: relative;
  }

  #file-de .f-del {
    display: flex;
    flex: 1;
    justify-content: flex-end;
    position: absolute;
    z-index: 99;
    right: 0;
    top: 0;
    transform: translate(50%, -50%);
  }

  .up-file-wrp .f-del {
    display: flex;
    flex: 1;
    justify-content: flex-end;
  }

  .f-del-ico {
    padding: 16px 10px;
    background: #ef5662;
    display: inline-block;
  }

  .f-name {
    margin-right: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }

  .f-wrp {
    background-color: rgba(250, 250, 250, 1);
    border: 1px solid rgba(242, 240, 240, 1);
    display: flex;
    align-items: stretch;
    padding: 10px;
    box-sizing: border-box;
    width: 100%;
    justify-content: space-between;
  }

  .ap-btn:focus {
    border-color: rgba(85, 133, 240, 1);
    color: #fff;
    background-color: rgba(85, 133, 240, 1);
  }

  .form-sub-red {
    background: rgb(255, 0, 76);
    margin: 20px auto !important;
    padding-bottom: 20px;
  }

  .required {
    color: rgb(255, 0, 76);
    font-weight: bold;
  }

  .ap-btns {
    display: flex;
    justify-content: space-around;
  }

  .ap-btn {
    width: 3.6rem;
    line-height: 1.3rem;
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0);
    color: rgba(110, 120, 130, 1);
    font-size: 0.7rem;
    text-align: center;
    border: 1px solid rgba(110, 120, 130, 1);
    cursor: pointer;
    position: relative;
  }

  .ap-star-wrp {
    padding: 0 5%;
  }

  .head-left {
    display: flex;
    width: 100%;
    box-sizing: border-box;
  }

  .head-right {
    font-size: 1.2rem;
  }

  .head-right i {
    cursor: pointer;
    padding: 0.5rem;
    color: #555;
  }

  .h-pdf {
    color: #666;
  }

  /* .h-print {
      } */
  .copy-men {
    color: #999999;
    font-size: 0.875rem;
  }

  .approve-list {
    display: flex;
    align-items: center;
    margin: 0.9rem 0;
  }

  .a-date {
    font-size: 0.75rem;
    color: #9b9b9b;
    line-height: normal;
    text-align: center;
  }

  .a-status {
    padding-right: 0.8rem;
    font-size: 1.3rem;
    color: rgba(85, 133, 240, 1);
  }

  .approve-w {
    padding: 15px;
  }

  .a-name {
    flex: 1 0 auto;
    font-size: 0.75rem;
    line-height: normal;
  }

  .a-img {
    background: #bbb;
    height: 2.6rem;
    width: 2.6rem;
    margin-right: 0.8rem;
    border-radius: 50%;
  }

  .details-wrp {
    margin-bottom: 20px;
    background-color: #fff;
  }

  .details-time {
    line-height: 2.8rem;
    display: flex;
    padding: 0 15px;
    align-items: center;
  }

  .details-d {
    padding: 15px;
    /* border-top: 1px solid #f3f3f3; */
    /* border-bottom: 1px solid #f3f3f3; */
  }

  .add-details {
    color: rgba(85, 133, 240, 1);
    padding: 15px;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .add-details-file {
    color: rgba(85, 133, 240, 1);
    padding: 15px;
    font-weight: 500;
    font-size: 0.9rem;
    display: block;
  }

  .del-detail {
    background-color: #f4f4f4;
    padding: 0 15px;
    line-height: 2.6rem;
    color: #ef5662;
    text-align: right;
    margin: 0 15px;
  }

  .form-title {
    font-weight: bold;
    font-size: 0.875rem;
  }

  .f-wrp {
    background-color: rgba(250, 250, 250, 1);
    border: 1px solid rgba(242, 240, 240, 1);
    display: flex;
    align-items: stretch;
    padding: 10px;
  }

  .f-icon {
    flex: 0 0 50px;
    background-color: rgba(84, 185, 110, 1);
    height: 50px;
    line-height: 50px;
    text-align: center;
    font-size: 1.5rem;
    color: #fff;
  }

  .f-text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 72%;
  }

  .part-list {
    display: flex;
    font-size: 0.875rem;
    margin-bottom: 12px;
    padding: 0 15px;
  }

  .p-title {
    color: #9b9b9b;
    margin-right: 10px;
    min-width:9em;
    text-align: left;
    line-height: normal;
  }

  /*.p-desc {*/
  /*color: #333;*/
  /*flex: 1 0 0;*/
  /*white-space: normal;*/
  /*word-break: break-all;*/
  /*line-height: normal;*/
  /*position: relative;*/
  /*}*/

  .head-wrp {
    display: flex;
    /*align-items: center;*/
    margin-bottom: 20px;
    /*padding: 15px 15px 0px;*/
  }

  .head-icon {
    width: 40px;
    height: 40px;
  }

  .r-status {
    /*margin-left: 10px;*/
    font-size: 0.75rem;
    color: rgba(85, 133, 240, 1);
    line-height: 1rem;
    border: 1px solid rgba(85, 133, 240, 1);
    padding: 1px 5px;
    border-radius: 3px;
    flex: 0 0 auto;
    text-align: center;
    align-self: flex-start;
  }

  .divider {
    width: 100%;
    height: 1px;
    background-color: #eee;
    margin: 10px 0;
  }

  .form-sub {
    width: 100%;
    height: 2.4rem;
    font-size: 1rem;
    margin: 20px auto;
    display: block;
  }

  .noRate {
    color: #fff;
    padding: 6px 8px;
    position: absolute;
    right: 0;
    margin-top: -6px;
    background-color: rgba(85, 133, 240, 1);
    border-radius: 2px;
  }

  .longtips {
    background-color: #f0f9eb;
    color: #67c23a;
    border-radius: 5px;
    padding: 8px 16px;
    margin-bottom: 15px;
    line-height: normal;
  }
</style>

<style>
  .ap-stars .cube-rate-item-def {
    background-image: url(data:image/png;base64,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);
  }

  .ap-stars .cube-rate-item_active .cube-rate-item-def {
    background-image: url(data:image/png;base64,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);
  }

  .approve-w .cube-tip {
    /* left:-50%; */
    bottom: 2rem;
    white-space: pre;
    padding: 10px 16px;
    line-height: normal;
  }

  .approve-w .cube-tip button {
    display: none;
  }

  .detail-file-name__input {
    padding: 10px;
    color: #666;
    border-radius: 2px;
    box-sizing: border-box;
    border: 1px solid #f2f0f0;
    outline: none;
    width: 100%;
    margin-top: -1px;
  }
</style>
