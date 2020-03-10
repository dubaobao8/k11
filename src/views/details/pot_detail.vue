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
            <span class="detail-head-text ">巡查报告
                        <span
                          :style="{color:statusColor,borderColor:statusColor}"
                          class="r-status"
                        >{{desc.status | transStatus}}</span>
                        </span>

            <span class="detail-head-text ">员工号：{{desc.userid}}</span>
            <span class="detail-head-text ">所在部门：{{desc.department}}</span>
            <span class="detail-head-text ">职位：{{desc.position}}</span>

          </h3>
        </div>
        <div class="head-right" v-if="isPc">
          <a
            :href="$store.state.domain+'/print_patrol.html?port_id='+desc.id"
            class="fa fa-file-pdf-o h-pdf"
            target="_blank"
          ></a>
          <!-- <i class="fa fa-print h-print" @click="getPrint"></i> -->
        </div>
      </div>
      <!-- 详细列表 -->
      <div class="divider"></div>
      <section class="part-list">
        <h5 class="p-title">巡查报告</h5>
        <span class="p-desc">{{desc.abstract}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">巡查报告编号</h5>
        <span class="p-desc">{{desc.work_num}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">项目名称</h5>
        <span class="p-desc">{{desc.title}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">报告日期</h5>
        <span class="p-desc">{{desc.create_time | transDate}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">巡查日期</h5>
        <span class="p-desc">{{desc.happen_time | transSegTime}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">巡查范围</h5>
        <span class="p-desc">{{desc.potrol_scope}}</span>
      </section>
      <section class="part-list">
        <h5 class="p-title">所属外判公司</h5>
        <span class="p-desc">{{desc.wp_company}}</span>
      </section>

      <div class="divider"></div>

      <!-- 明细 -->
      <section class="parti mb20">
        <div class="fw-b mb10 mt10">明细</div>
        <!-- 明细 模版-->
        <template v-for="(item,index) in desc.detail">
          <div :key="index">
            <section class="part-list">
              <h5 class="p-title">巡查时间</h5>
              <span class="p-desc">{{item.patrol_time | transSegTime}}</span>
            </section>
            <section class="part-list">
              <h5 class="p-title">巡查地点</h5>
              <span class="p-desc">{{item.patrol_place}}</span>
            </section>
            <section class="part-list">
              <h5 class="p-title">巡查内容</h5>
              <span class="p-desc">{{item.patrol_content}}</span>
            </section>
            <v-file-preview :files="item.file" v-if="item.file&&item.file.length"/>
            <div class="divider"></div>
          </div>
        </template>

        <!-- 附件 -->
        <section class="part-list mt20"
                 id="file-de"
                 style="display: block;padding: 0"
                 v-if="desc.file_url && desc.file_url.length"
        >
          <h5 class="p-title mb15" style="text-align: left">附件</h5>
          <v-file-preview :files="desc.file_url"/>
        </section>

        <div class="divider"></div>

        <!-- 追加明细 -->
        <div class="details-wrp" v-if="access.isUpload">
          <!-- v-if="access.isDelfile" -->
          <!-- 添加明细模版 -->
          <template v-for="(item,index) in detials">
            <div :key="index">
              <div @click="showSegDate(index)" class="details-time">
                <div class="form-title fx100">
                  巡查时间
                  <span class="required">*</span>
                </div>
                <div class="crbbb dpfx fxac xctime">
                  <span v-if="!item.potrol_time">请选择&nbsp;</span>
                  <span class="segtime" v-else>{{item.potrol_time | transSegTime}}</span>
                  <i class="ml5 fa fa-chevron-right"></i>
                </div>
              </div>


              <div class="details-d">
                <div class="form-title mb10">
                  巡查地点
                  <span class="required">*</span>
                </div>
                <cube-textarea
                  :autoExpand="false"
                  :maxlength="500"
                  placeholder="请输入"
                  v-model="item.potrol_place"
                ></cube-textarea>
              </div>

              <div class="details-d">
                <div class="form-title mb10">
                  巡查内容
                  <span class="required">*</span>
                </div>
                <cube-textarea
                  :autoExpand="false"
                  :maxlength="500"
                  placeholder="请输入"
                  v-model="item.potrol_content"
                ></cube-textarea>
              </div>

              <file-add :file-obj="fileObj"
                        @del="item.file.splice(fileIndex,1)"
                        class="pl15 pr15 mb15"
                        v-for="(fileObj,fileIndex) in item.file"
                        v-model="fileObj.title"
              />

              <label class="add-details-inside-file">
                <i class="fa fa-plus-circle"></i>
                <input @change="addInsideFile(item,$event)" class="file-input" type="file">
                添加明细附件
              </label>

              <div class="del-detail clear">
                <div @click="delDetail(index)" class="fl-right">
                  <i class="fa fa-minus-circle"></i>
                  删除该明细
                </div>
              </div>
              <div class="divider"></div>
            </div>
          </template>
          <!-- 添加明细 -->
          <div @click="addDetail" class="add-details">
            <i class="fa fa-plus-circle"></i>
            添加明细
          </div>
          <!-- <cube-button class="pd15" type="submit" :primary="true">上传明细</cube-button> -->

          <!-- 已添加附件 -->
          <section>
            <file-add :file-obj="item"
                      @del="delFile(index)"
                      class="pl15 pr15 mb15"
                      v-for="(item, index) in atfile"
                      v-model="item.title"
            />

          </section>

          <!-- 添加附件 -->
          <label @change="chooseFile" class="add-details-file" style="color: #00ABC6;" v-if="access.isUpload">
            <input class="file-input" type="file">
            <i class="fa fa-plus-circle" style="color: #00ABC6;"></i>
            添加附件
          </label>

          <!-- 提交跟进 按钮 -->
          <cube-button
            :inline="true"
            :primary="true"
            @click="FollowAdd"
            class="form-sub"
            style="background-color: #00ABC6;"
            type="submit"
            v-if="access.isUpload"
          >提交跟进
          </cube-button>

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
              <cube-textarea :autoExpand="false"
                             :maxlength="500"
                             placeholder="请输入"
                             v-model="yj">
              </cube-textarea>
            </div>
          </div>

          <cube-button
            :primary="true"
            @click="Suggest"
            class="pd15"
            style="height: 2.4rem;padding: 0;font-size: 1rem;"
            type="submit"
          >提交备注
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
              <span
                class="mr10"
                v-if="item.agree==5&&desc.transfer_name"
              >→ {{desc.transfer_name}}</span>
            </span>
          </span>
          <span class="a-date">{{item.time | transTime}}</span>
        </div>

        <div class="divider"></div>
        <div class="copy-men">
          抄送人：
          <span :key="index" v-for="(item,index) in desc.look_user">{{item.username }}&nbsp;</span>
        </div>
      </section>
      <!-- ----------------------------------------------------------------------------- -->

      <!-- 审批意见列表 -->
      <section class="operation" v-for="(item, index) in desc.operation">

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

      <!-- 转审意见 -->
      <section class="approve-w" v-if="access.isZs">
        <h5 class="fs08 fw-b mb15">
          转审意见
          <span class="required">*</span>
        </h5>
        <cube-input :disabled="!access.canZSOpinion" v-model="ZSopinions"></cube-input>
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
        <button
          @click="Agree"
          @mouseout="isPc&&$refs.agree.hide()"
          @mouseover="isPc&&$refs.agree.show()"
          class="ap-btn"
        >
          同意
          <cube-tip direction="bottom" ref="agree" style="margin-left:-2rem" v-if="isPc">同意审批此事件报告</cube-tip>
        </button>
        <button
          @click="Reject"
          @mouseout="isPc&&$refs.reject.hide()"
          @mouseover="isPc&&$refs.reject.show()"
          class="ap-btn"
        >
          驳回
          <cube-tip
            direction="bottom"
            ref="reject"
            style="margin-left:-4rem"
            v-if="isPc"
          >拒绝审批此事件报告，报告将回到发起人
          </cube-tip>
        </button>
        <button
          @click="Transfer"
          @mouseout="isPc&&$refs.trans.hide()"
          @mouseover="isPc&&$refs.trans.show()"
          class="ap-btn"
        >
          转审
          <cube-tip direction="bottom" ref="trans" style="margin-left:-2rem" v-if="isPc">转交给相关同事进行批注<br>批注后该报告仍需要审批
          </cube-tip>
        </button>
        <button @click="Follow" class="ap-btn" v-show="access.isFollowUp">跟进</button>
        <!-- ------------------------------------------------------------------------- -->
      </section>
      <div class="mt15" v-if="access.isButton&&!isPc">
        <p class="longtips">同意：同意审批此事件报告。</p>
        <p
          class="longtips"
          style="background-color: #fef0f0; color: #f56c6c;"
        >拒绝：拒绝审批此事件报告，报告将回到发起人。</p>
        <p
          class="longtips"
          style="background-color: #fdf6ec; color: #e6a23c;"
        >转审：转交给相关同事进行批注，批注后该报告仍需要审批。</p>
      </div>

      <div class="add-copier" v-if="access.isButton">
        <v-ccp-container :ccp="ccp" :ccp_selection="ccp_selection" class="mt20"/>
        <div @click="addCopier" class="form-submit-block">添加抄送人</div>
      </div>

      <!-- 上传附件 -->
      <cube-button
        :inline="true"
        :primary="true"
        @click="isUpwrp=true"
        class="form-sub"
        type="submit"
        v-if="access.isUpload"
      >提交跟进
      </cube-button>
      <!-- 确定转审 -->
      <cube-button
        :inline="true"
        :primary="true"
        @click="Postil"
        class="form-sub"
        type="submit"
        v-if="access.isZsBtn"
      >确定
      </cube-button>

      <!-- 重新填写 -->
      <cube-button
        :inline="true"
        @click="fillAgain"
        class="form-sub form-sub-red"
        type="submit"
        v-if="access.isfillAgain"
      >重新填写
      </cube-button>
    </main>

  </div>
</template>

<script>
  import axios from "axios/index";
  import util from "../../util/util.js";
  import FileAdd from "@/components/file-add/file-add";
  import {patrolSendFollow} from "@/api/details/detail";
  import {uploadDetailFile} from "@/api/initiate/initiate";
  import {deepCopy} from "../../util/util";
  import bus from "@/js/event";
  import request from "@/api";
  import VCcpContainer from "@/components/form/v-ccp-container";
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
      FileAdd
    },
    data() {
      return {
        ccp: [],
        ccp_selection: [],
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
        mx: [],

        detials: [
          {
            potrol_place: "",
            potrol_time: "",
            potrol_content: "",
            file: []
          }
        ],
        select: {
          potrol_place: []
        },

        transMen: [],
        isUpwrp: false,
        yj: "",
        config: {
          file_slide_options: {
            pagination: {
              el: '.file_swiper_page',
              type: 'fraction'
            },
            spaceBetween: 10
          }
        },
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
        var name = n + i + "DetailDatePicker";
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
              newList[i][n] = vm.transStamp(date.getTime());
              vm.detials = newList;
            }
          });
        }
        this[name].show();
      },

      // (明细)一般选择器
      showMXPick(name, i) {
        var sn = name + i + "Picker";
        var vm = this;

        if (!this[sn]) {
          this[sn] = this.$createPicker({
            title: "请选择",
            data: [this.select[name]],
            onSelect(value, index, text) {
              var newList = vm.detials.concat();
              newList[i][name] = text[0];
              vm.detials = newList;
            }
          });
        }
        this[sn].show();
      },
      delDetail(i) {
        this.$createDialog({
          type: "confirm",
          icon: "cubeic-alert",
          title: "确定删除该明细吗？",
          onConfirm: () => {
            this.detials.splice(i, 1);
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

      // 巡查时间选择器
      showSegDate(index) {
        var fullName = index + "segDate";
        var vm = this;
        this[fullName] = this.$createSegmentPicker({
          data: [{
            is: 'cube-date-picker',
            title: "请选择巡查开始时间",
            value: new Date(),
            columnCount: 5,
            format: {
              year: 'YYYY年',
              month: 'MM月',
              date: 'D日',
              hour: "hh时",
              minute: "mm分"
            },
          }, {
            is: 'cube-date-picker',
            title: "请选择巡查结束时间",
            value: new Date(),
            columnCount: 5,
            format: {
              year: 'YYYY年',
              month: 'MM月',
              date: 'D日',
              hour: "hh时",
              minute: "mm分"
            },
          }],
          onSelect: (date, val, text) => {
            if (date[0].getTime() > date[1].getTime()) {
              vm.$createToast({
                txt: "结束时间不能早于开始时间！",
                type: "error",
                time: 1500
              }).show();
              return false;
            }
            var time = date.map(function (e) {
              return util.transStamp(e.getTime())
            });
            var details = this.detials.concat();
            details[index].potrol_time = time.join(",");
            this.detials = details;
          }
        });
        this[fullName].show();
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
                headers: {token: localStorage.getItem("token")},
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
                  setTimeout(() => {
                    this.$router.go(-1);
                  }, 800);
                  // 提交备注
                  axios({
                    baseURL: this.$store.state.domain,
                    url: "/api/Approval/Suggest",
                    headers: {token: localStorage.getItem("token")},
                    method: "POST",
                    data: {
                      port_id: this.$route.params.id,
                      user_id: localStorage.getItem("user_id"),
                      content: note
                    }
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

        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Approval/Agree",
          headers: {token: localStorage.getItem("token")},
          method: "POST",
          data: {
            port_id: this.$route.params.id,
            user_id: localStorage.getItem("user_id"),
            content: this.opinions,
            star: this.star
          }
        })
          .then(res => {
            this.$root.$createToast({
              time: 1000,
              type: "txt",
              txt: "操作成功！您已同意审批",
              mask: true
            }).show();

            bus.$emit('del_list_item', this.$route.params.id);
            this.$router.go(-1);

          })
          .catch(err => {
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
        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Approval/Reject",
          headers: {token: localStorage.getItem("token")},
          method: "POST",
          data: {
            port_id: this.$route.params.id,
            user_id: localStorage.getItem("user_id"),
            content: this.opinions,
            star: this.star
          }
        })
          .then(res => {
            this.$root
              .$createToast({
                time: 1000,
                type: "txt",
                txt: "操作成功！您已驳回审批",
                mask: true
              })
              .show();
            this.$router.go(-1);
            bus.$emit('del_list_item', this.$route.params.id);
          })
          .catch(err => {
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
        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Approval/Follow",
          headers: {token: localStorage.getItem("token")},
          method: "POST",
          data: {
            port_id: this.$route.params.id,
            user_id: localStorage.getItem("user_id"),
            content: this.opinions
          }
        })
          .then(res => {
            this.$root
              .$createToast({
                time: 1000,
                type: "txt",
                txt: "操作成功！您已选择跟进审批",
                mask: true
              })
              .show();
            this.$router.go(-1);
            bus.$emit('del_list_item', this.$route.params.id);
          })
          .catch(err => {
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
              console.log(value);
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
                  vm.$root
                    .$createToast({
                      time: 1000,
                      type: "txt",
                      txt: "操作成功！您已选择转审"
                    })
                    .show();
                  vm.$router.go(-1);
                  bus.$emit('del_list_item', this.$route.params.id);
                })
                .catch(err => {
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

        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Approval/Postil",
          headers: {token: localStorage.getItem("token")},
          method: "POST",
          data: {
            port_id: this.$route.params.id,
            user_id: localStorage.getItem("user_id"),
            content: this.ZSopinions
          }
        })
          .then(res => {
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
          this.$createToast({time: 1000, type: "txt", txt: "请至少上传一个附件！"}).show();
          return false;
        }

        if (!this.detials.length) {
          this.$createToast({time: 1000, type: "txt", txt: "请填写明细！"}).show();
          return false;
        }

        if (this.detials.some((v, i, arr) => {
          return !v.potrol_place || !v.potrol_time || !v.potrol_content;
        })) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请将明细填写完整！"
          }).show();
          return false;
        }


        if (this.atfile.some((value, index) => {
          if (!value.title) {
            return true;
          }
        })) {
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
          if (!element.potrol_place || !element.potrol_time || !element.potrol_content) {
            this.$createToast({type: "error", txt: `请将明细${index + 1}填写完整！`}).show();
            return true;
          }
          let files = element.file;
          // 验证明细内附件标题
          if (files.some((ele, i) => !ele.title)) {
            this.$createToast({type: "error", txt: `请将明细${index + 1}内附件标题填写完整！`}).show();
            return true;
          }
        };
        if (details.some(verifyDetails)) {
          return false
        }
        return true
      },

      // 处理跟进数据，并转成FormData
      resolveFollow(details) {
        let formData = new FormData();
        formData.append('details', JSON.stringify(details));
        formData.append("port_id", this.$route.params.id);
        formData.append("user_id", localStorage.getItem("user_id"));

        this.atfile.forEach((e, i) => {
          formData.append("file[]", e.file);
          formData.append("file_title[]", e.title);
        });

        return formData;
      },

      // 提取明细内文件
      getFileFormData(i) {
        let detail = deepCopy(this.detials[i]);
        detail.file = [];
        let fileFormData = new FormData();
        this.detials[i].file.forEach((e, i) => {
          fileFormData.append('file[]', e.file);
          fileFormData.append('title[]', e.title);
        });

        return {
          fileFormData,
          detail
        }
      },

      // 跟进添加附件提交
      FollowAdd() {
        // 校验表单
        if (!this.verifyFollow()) {
          return false;
        }

        let details = deepCopy(this.detials);

        var loading = this.$createToast({txt: '正在提交...', time: 0, mask: true});
        loading.show();

        let counter = details.length;
        details.forEach((e, i) => {
          let {fileFormData, detail} = this.getFileFormData(i);
          details[i] = detail;
          uploadDetailFile(fileFormData).then(res => {
            if (Array.isArray(res.data.data)) {
              details[i].file = details[i].file.concat(res.data.data);
            }
            counter--;
            if (counter < 1) {
              let formData = this.resolveFollow(details);
              patrolSendFollow(formData).then(res => {
                loading.hide();
                this.$root.$createToast({txt: "提交成功", type: "correct"}).show();
                this.$router.go(-1);
              }).catch(err => {
                loading.hide();
                this.$createToast({txt: "上传表单失败", type: "error"}).show();
                console.log(err);
              })
            }
          }).catch(err => {
            loading.hide();
            this.$createToast({txt: "上传明细附件失败", type: "error"}).show();
            console.log('上传明细附件失败', err);
          })
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
          headers: {token: localStorage.getItem("token")},
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
      deleteFile(id) {
        this.$createDialog({
          type: "confirm",
          icon: "cubeic-alert",
          title: "确定删除附件？",
          onConfirm: () => {
            axios({
              baseURL: this.$store.state.domain,
              url: "/api/approval/Delete",
              headers: {token: localStorage.getItem("token")},
              method: "POST",
              data: {
                id: id
              }
            })
              .then(res => {
                this.$createToast({
                  type: "warn",
                  time: 1000,
                  txt: "删除成功！"
                }).show();
                vm.desc.file_url.splice(i, 1);
              })
              .catch(res => {
                this.$createToast({
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
          path: "/potrol",
          query: {mode: "change", id: this.$route.params.id}
        });
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
        url: "/api/patrol/Details",
        method: "POST",
        headers: {token: localStorage.getItem("token")},
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
            headers: {token: localStorage.getItem("token")},
            method: "POST",
            data: {
              port_id: this.$route.params.id
            }
          }).then(res => {
            // console.log("已读");
          });
        }
        // 处理明细信息
        // this.desc.date_time.forEach((e, i) => {
        //   if (!this.mx[i]) {
        //     this.mx[i] = {};
        //   }
        //   this.mx[i].date_time = e;
        // });
        // this.desc.content.forEach((e, i) => {
        //   if (!this.mx[i]) {
        //     this.mx[i] = {};
        //   }
        //   this.mx[i].content = e;
        // });
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
        // 跟进按钮
        if (localStorage.getItem("status") == 3) {
          this.access.isFollowUp = true;
        }
        // 只有自己可以删除文件
        if (this.desc.user_id == localStorage.getItem("user_id")) {
          this.access.isDelfile = true;
        }
      });
      // 信息回调
      axios({
        baseURL: this.$store.state.domain,
        url: "/api/Patrol/CallBack",
        method: "POST",
        data: {
          user_id: localStorage.getItem("user_id")
        }
      }).then(res => {
        var data = res.data.data;
        // 选项
        data.potrol_place.forEach((e, i) => {
          if (!this.select.potrol_place[i]) {
            this.select.potrol_place[i] = {};
          }
          this.select.potrol_place[i].text = e.content;
          this.select.potrol_place[i].value = e.content;
        });
      });
      /* 2019/4/10
       * 添加转审人二级联动
       * tang
       */
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
      transSegTime(v) {
        if (v) {
          return v.split(",").map((e) => {
            return util.stampToString(e, "/", true)
          }).join(" - ");
        } else {
          return false;
        }
      },
      operationType(v) {
        return operationType[v]
      }
    }
  };
</script>

<style>
  .segtime {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .xctime {
    width: 73%;
    text-align: right;
    display: flex;
    justify-content: flex-end;
  }

  .file-lim {
    max-height: 420px;
    overflow-y: scroll;
  }
</style>
