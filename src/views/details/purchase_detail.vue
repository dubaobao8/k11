<template>
  <div>
    <d-business-card :info="user_info"
                     :print-url="$store.state.domain+'/print_purchase.html?purchase_id='+$route.params.id"
                     class="margin20"
                     print/>
    <div class="divider-1 ml20 mr20"></div>
    <section class="info-list pl5 pr5">
      <d-info-item :value="info_data.title" class="info-item" title="采购 / 报销主题"/>
      <div class="divider-1 ml15 mr15"></div>
      <d-info-item :value="info_data.purpose" class="info-item" title="采购用途"/>
      <d-info-item :value="info_data.application_department" class="info-item" title="申请部门"/>
      <d-info-item :value="info_data.deduction_department" class="info-item" title="费用扣除部门"/>
      <d-info-item :value="info_data.budget_type" class="info-item" title="预算类型"/>
      <d-info-item :value="info_data.budget_caliber" class="info-item" title="预算口径"/>
      <d-info-item :value="info_data.budget_surplus" class="info-item" title="剩余预算"/>
      <d-info-item :value="info_data.created_at" class="info-item" title="申请日期"/>
      <d-info-item :value="info_data.purchase_number" class="info-item" title="采购编号"/>
      <d-info-item :value="parseInt(info_data.type)===1?'采购':'报销'" class="info-item" title="单据类型"/>
      <d-info-item :value="info_data.is_contract == 2?'是':'否'" class="info-item" title="是否签订合同"/>
      <d-info-item :value="info_data.contract_num" class="info-item" title="合同签订编号"/>
      <d-info-item :value="info_data.price_year" class="info-item" title="财年"/>
    </section>

    <div class="divider-1 ml20 mr20"></div>

    <!-- 采购表详情开始 -->
    <section class="info-list" v-if="info_data.type==1">
      <p class="form-detail-title-huge ml15 mb15">采购表</p>
      <div>
        <d-info-item :value="info_data.procurement_method" class="info-item" title="采购方式"/>
        <d-info-item :value="info_data.post_id"
                     class="info-item"
                     title="事件报告补充"
                     v-if="info_data.post_id"/>
        <d-info-item :value="info_data.is_new_year == 2?'是':'否'" class="info-item" title="是否跨财年采购"/>
        <d-info-item :value="info_data.year_price + '元'" class="info-item" title="本财年金额" v-if="info_data.year_price"/>

        <!--<div class="divider-1  ml20 mr20"></div>-->
        <!--<swiper ref="contractor">-->
        <section :key="index" v-for="(shopItem,index) in info_data.detail ">
          <p class="form-detail-title-bold ml15 mb15">承包商{{index+1}}</p>
          <!--<p class="fs08 plr15 mt10 mb10 text-center">承包商{{index+1}}</p>-->

          <d-info-item :value="shopItem.contractor" class="info-item" title="承包商"/>
          <!--<purchase-list :list="shopItem" class="ml15 mr15"/>-->
          <!--<d-info-item :value="shopItem.recommend==1?'是':'否'" class="info-item" title="是否推荐为承包商"/>-->
          <d-info-item :value="shopItem.total_price + '元'" class="info-item" title="总价"/>
          <!--<div class="divider-1 ml20 mr20"></div>-->
        </section>
        <!--</swiper>-->

        <a :href="$store.state.domain+'/print_purchase.html?purchase_id='+$route.params.id + '&showPrint=false'"
           class="text-center crtm fs08 mt10 mb10 dpbk"
           target="_blank">查看报价明细</a>

        <d-info-item :value="info_data.advice" class="info-item" title="建议原因"/>
        <section v-for="(item,index) in info_data.reason">
          <d-info-item :title="'原因'+(index+1)" :value="item.reason" class="info-item"/>
        </section>
        <d-info-item class="info-item" title="补充附件"/>
        <v-file-preview :files="info_data.enclosure" class="file-wrp"/>
      </div>
      <div class="divider-1 ml20 mr20"></div>
      <div v-if="info_data.status==6&&info_data.id==this.user_id">
        <p class="form-detail-title-huge ml15 mb15">付款单</p>
        <div class="form-group">
          <v-input placeholder="请输入" required title="本次支付金额（元）" type="text" v-model="payment.payment_amount"/>
          <v-input :value="shopTotlePrice - paidAmount - payment.payment_amount"
                   placeholder=""
                   readonly
                   title="剩余待支付金额（元）"
                   type="text"/>
          <v-file-container :files="paymentEnclosure"
                            ref="uploadFile"
                            required required-notice="必须添加收货见证"/>
        </div>

      </div>
      <p class="form-detail-title-huge ml15 mb15 mt15" v-if="info_data.payment.length">历史付款单</p>
      <!-- 历史付款单 -->
      <div v-if="info_data.payment">
        <div v-for="item in info_data.payment">
          <d-info-item :value="item.created_at" class="info-item" title="申请时间"/>
          <d-info-item :value="item.payment_amount" class="info-item" title="本次支付金额"/>
          <v-file-preview :files="item.enclosure" class="file-wrp"/>
          <a :href="$store.state.domain+'/print_payment.html?payment_id=' + item.id"
             class="text-center crtm fs08 mt15 mb10 dpbk"
             target="_blank"
             v-if="isPc()"
          >打印该付款单</a>
          <div class="divider-1 mt20"></div>
        </div>
      </div>
    </section>
    <!-- 采购表详情结束 -->
    <section class="info-list" v-else>
      <p class="form-detail-title-huge ml15 mb15">一般报销单</p>
      <!--<d-info-item :value="info_data.price.price_purpose" class="info-item" title="费用用途补充" title-width="6em"/>-->
      <d-info-item :value="info_data.price.total_price" class="info-item" title="总金额" title-width="6em"/>
      <d-info-item :value="info_data.remark" class="info-item" title="备注" title-width="6em"/>
      <d-info-item :value="info_data.enclosure.length===0?'无附件': ''" class="info-item" title="补充附件" title-width="6em"/>
      <!--      <file-preview  v-if="info_data.enclosure.length>0" :files="info_data.enclosure" file_url="image"  class="file-wrp"/>-->
      <v-file-preview :files="info_data.enclosure" class="file-wrp" v-if="info_data.enclosure.length>0"/>
    </section>


    <!-- 审批流程开始 -->
    <!--<section class="margin20" v-if="info_data.status!=8">-->
    <!--  <p class="form-detail-title-huge">审批流程</p>-->
    <!--  <d-approval-process-->
    <!--    :accepts="info_data.copier.join(',')"-->
    <!--    :approver="info_data.approval"-->
    <!--    :group="info_data.group.join(',')"-->
    <!--    approver_avatar="user_logo"-->
    <!--    approver_date="create_time"-->
    <!--    approver_name="username"-->
    <!--    approver_status="status"-->
    <!--    report_type="purchase"/>-->
    <!--</section>-->
    <!-- 审批意见 -->
    <!--<p class="form-detail-title-huge ml15 mb15 mt20" v-if="info_data.action.length>0&&info_data.status!=8">审批记录</p>-->
    <!--<section :key="index" class="operation" v-for="(item, index) in info_data.action">-->
    <!--  <h5 class="operation__section">-->
    <!--    <span class="operation__title">该审核人：</span>-->
    <!--    <span class="operation__operator">{{item.user_id}}</span>-->
    <!--    <span class="operation__position">{{item.payment==0?"采购/报销审批":"付款审批"}}</span>-->
    <!--  </h5>-->
    <!--  <p class="operation__section">-->
    <!--    <span class="operation__title">操作结果：</span>-->
    <!--    <span class="operation__result">{{item.status | operationType}}</span>-->
    <!--  </p>-->
    <!--  <p class="operation__section">-->
    <!--    <span class="operation__title">审批时间：</span>-->
    <!--    <span class="operation__time">{{item.create_time}}</span>-->
    <!--  </p>-->
    <!--  <div class="operation__section" v-if="item.content">-->
    <!--    <span class="operation__title">审批意见：</span>-->
    <!--    <span class="operation__content__text">{{item.content}}</span>-->
    <!--  </div>-->
    <!--  <div class="divider mt15 mb15"></div>-->
    <!--</section>-->
    <!-- 审批流程结束 -->

    <!-- 审批操作 -->
    <!--<section v-if="approvalStatus.approval===1&&approvalStatus.whereApproval===0&&(info_data.status==1||info_data.status==7)&&info_data.status!=8">-->
    <!--  <div @click="updateAgreeFormStatus" class="form-submit-block">同意</div>-->
    <!--  <div @click="showRefereePk" class="form-submit-block" v-if="approvalStatus.role===2&&info_data.status!=7">转审</div>-->
    <!--  <div @click="updateRefuseFormStatus" class="form-submit-block form-submit-block__reject">驳回</div>-->
    <!--</section>-->

    <!--<div @click="showRefereeInfo" class="form-submit-block" v-if="approvalStatus.role===5&&info_data.status==5">填写批注-->
    <!--</div>-->


    <!--<div @click="skipAgainFill"-->
    <!--     class="form-submit-block form-submit-block__reject"-->
    <!--     v-if="(info_data.status==3||info_data.status==8)&&user_id==info_data.id">重新填写-->
    <!--</div>-->
    <!--<div @click="stopForm"-->
    <!--     class="form-submit-block form-submit-block__reject"-->
    <!--     v-if="info_data.status==3&&user_id==info_data.id">终止报告-->
    <!--</div>-->
    <div @click="applyMoney" class="form-submit-block" v-if="user_id==info_data.id&&info_data.status==6">申请付款</div>
    <div @click="stopPayment"
         class="form-submit-block form-submit-block__reject"
         v-if="info_data.status==6&&user_id==info_data.id">付款完成
    </div>

    <!-- 发起人撤销操作 -->
    <!--<div @click="undoPurchase"-->
    <!--     class="form-submit-block form-submit-block__reject"-->
    <!--     v-if="user_id==info_data.id&&info_data.status==1">撤销采购/报销单-->
    <!--</div>-->
    <!-- 发起人撤销操作结束 -->

    <!-- 部门主管审批撤销操作 -->
    <!--<div v-if="approvalStatus.role===2 && info_data.status == 10">-->
    <!--  <div @click="undoApproval(true)" class="form-submit-block">同意撤销</div>-->
    <!--  <div @click="undoApproval(false)" class="form-submit-block form-submit-block__reject">拒绝撤销</div>-->
    <!--</div>-->
    <!-- 部门主管审批撤销操作结束 -->

    <div @click="skipAgainFill"
         class="form-submit-block form-submit-block__reject"
         v-if="(info_data.status==1)&&user_id==info_data.id">重新填写
    </div>

    <!-- 审批操作结束 -->
  </div>
</template>

<script>
  import vInput from "@/components/form/v-input";
  import DBusinessCard from "@/components/details/d-business-card";
  import DInfoItem from "@/components/details/d-info-item";
  import vFileContainer from "@/components/form/v-file-container";
  import DApprovalProcess from "@/components/details/d-approval-process/d-approval-process";
  import {
    ListDetail,
    DepartmentAgree,
    DepartmentTransfer,
    RejectForm,
    CopierInfo,
    TransferDepartment,
    UploadFile,
    stopPayment,
    DeleteFile,
    Payment,
    PaymentAgree,
    PaymentReject,
    stopForm, UndoPurchase, UndoPurchaseAgree, UndoPurchaseReject
  } from "@/api/initiate/purchase";
  import VFilePreview from "@/components/details/v-file-preview";
  import {MarkRead} from "@/api/details/detail";
  import PurchaseList from "@/components/details/purchase-list/purchase-list";
  import request from "@/api";
  import {isPc} from "@/util/util";

  export default {
    name: "purchase_detail",
    components: {
      PurchaseList,
      VFilePreview, DApprovalProcess, DInfoItem, DBusinessCard, vFileContainer, vInput
    },
    data() {
      return {
        shopTotlePrice: 0,
        //付款单附件数组
        paymentEnclosure: [],

        approvalStatus: {
          role: undefined,
          approval: undefined,
          whereApproval: undefined
        },
        user_id: undefined,
        purchase_id: undefined,
        user_info: {
          user_name: "Username", //用户名
          user_avatar: "", //用户头像
          report_name: "采购/报销单", //报告名字 如：事件报告
          report_type: "purchase", //报告类型 [incident,sde]
          report_status: "1", //报告状态 [1,2,3,4,5]
          user_id: "", // 员工号
          department: "", // 员工部门
          position: "" // 员工职位
        },
        paidAmount: 0,
        info_data: {
          //报告状态
          status: 0,
          //申请人id
          id: undefined,
          //主题
          title: "",
          //用途
          purpose: "",
          //申请部门
          application_department: "",
          //费用扣除部门
          deduction_department: "",
          //预算类型
          budget_type: "",
          //预算口径
          budget_caliber: "",
          //剩余预算
          budget_surplus: "",
          //单据类型
          type: "",
          //采购方式
          procurement_method: "",
          //事件报告补充
          post_id: "",
          //建议说明
          advice: "",
          //原因
          reason: [],
          //承包商
          detail: [{}],
          //报销
          price: {
            id: undefined,
            price_purpose: undefined,
            total_price: undefined
          },
          //审批人
          approval: [],
          //附件
          enclosure: [],
          //抄送人
          copier: [],
          //群组
          group: [],
          //申请日期
          created_at: "",
          //采购编号
          purchase_number: "",
          //操作记录
          action: [],
          //报销单记录
          payment: [],
          // 报销单备注
          remark: "",
          // 是否跨财年采购
          is_new_year: "",
          // 本财年金额
          year_price: "",
          // 是否签订合同
          is_contract: "",
          // 合同签订编号
          contract_num: "",
          // 财年
          price_year: ""

        },
        payment: {
          purchase_id: undefined,
          user_id: undefined,
          payment_amount: 0,
          enclosure: []
        },
        files: [{
          file_url: "http://work.juancengyun.com/upload/20190802/8ee6971c6df5e6c679a40ba7c9b96a43.jpeg",
          small_image: "http://work.juancengyun.com/small_image/8ee6971c6df5e6c679a40ba7c9b96a43.jpeg",
          title: "标题"
        }]
      }
    },
    created() {
      this.user_id = localStorage.getItem("user_id");
      this.purchase_id = this.$route.params.id;
    },
    filters: {
      operationType(value) {
        switch (value) {
          case 1:
            return "同意";
          case 2:
            return "驳回";
          case 3:
            return "转审";
          case 4:
            return "重新申请";
          case 5:
            return "终止";
          case 6:
            return "发起付款单";
          case 7:
            return "付款单终止";
          case 8:
            return "转审批注";
          case 9:
            return "发起撤销申请";
          case 10:
            return "部门主管同意撤销申请";
          case 11:
            return "部门主管拒绝撤销申请";
        }
      }
    },
    methods: {
      isPc() {
        return isPc()
      },
      //错误提示
      showToast(txt) {
        this.$notify({
          message: txt
        });
      },
      //采购/付款 同意判断
      updateAgreeFormStatus() {
        var data = {
          "user_id": this.user_id,  //用户id
          "purchase_id": this.purchase_id, //表单id
          "role_id": this.approvalStatus.role,
          "total_money": this.shopTotlePrice
        };
        if (this.approvalStatus.approval) {
          //有权限
          if (this.info_data.status == 7) {
            this.PaymentAgree(data);
          } else {
            DepartmentAgree(data).then(res => {
              if (res.data.status === 1) {
                this.$toast.success(res.data.message);
                location.reload();
              } else {
                this.$toast.fail(res.data.message);
              }
            })
          }
        } else {
          this.$toast.fail("暂无权限");
        }
      },
      //采购/付款 拒绝判断
      updateRefuseFormStatus() {
        var data = {
          "user_id": this.user_id,  //用户id
          "purchase_id": this.purchase_id, //表单id
          "role_id": this.approvalStatus.role,
          "budget_type": this.info_data.budget_type,
          "content": "",
          "total_money": this.shopTotlePrice
        };
        if (this.approvalStatus.approval) {
          //有权限
          this.$createDialog({
            type: 'prompt',
            title: '填写驳回内容',
            prompt: {
              value: '',
              placeholder: '请输入'
            },
            onConfirm: (e, promptValue) => {
              // console.log(e,promptValue)
              data.content = promptValue;
              if (this.info_data.status == 7) {
                this.PaymentReject(data);
              } else {
                this.RejectForm(data);
              }
            }
          }).show();
        } else {
          this.$toast.fail("暂无权限");
        }
      },
      //调起转审人列表
      showRefereePk() {
        CopierInfo().then(res => {
          console.log(res);
          var data = res.data.data;
          //构建数组
          var resdata;
          resdata = data.map(item => {
            return {
              text: item.department,
              value: item.id,
              children: item.user.map(emp => {
                  return {
                    text: emp.username,
                    value: {
                      avatar: emp.user_logo,
                      user_id: emp.id,
                      username: emp.username
                    }
                  }
                }
              )
            }
          });
          this.$createCascadePicker({
            title: "请选择转审核人",
            data: resdata,
            onSelect: (value, index, text) => {
              console.log(value[1]);
              if (value[1]) {
                this.DepartmentTransfer(value[1].user_id)
              } else {
                this.$toast.fail("请选择转审核人")
              }
            }
          }).show();
        })
      },
      //==========采购单/一般报销单（开始）========
      //部门主管转审
      DepartmentTransfer(value) {
        var data = {
          "user_id": this.user_id,  //用户id
          "purchase_id": this.purchase_id,//表单id
          "transfer_user": value, //转审人的id
        };
        DepartmentTransfer(data).then(res => {
          if (res.data.status === 1) {
            this.$toast.success(res.data.message);
            location.reload();
          } else {
            this.$toast.fail(res.data.message);
          }
        })
      },
      //员工收到主管转审核==》批准
      showRefereeInfo() {
        var data = {
          "user_id": this.user_id, //用户id
          "purchase_id": this.purchase_id,//表单id
          "content": "" //转审人批注
        };
        this.$createDialog({
          type: 'prompt',
          title: '填写批准',
          prompt: {
            value: '',
            placeholder: '请输入'
          },
          onConfirm: (e, promptValue) => {
            if (promptValue) {
              data.content = promptValue;
              TransferDepartment(data).then(res => {
                if (res.data.status === 1) {
                  this.$toast.success(res.data.message);
                  location.reload();
                } else {
                  this.$toast.fail(res.data.message);
                }
              });
            } else {
              this.$toast.fail("请填写批准")
            }
          }
        }).show();
      },
      //采购单/一般报销单驳回
      RejectForm(data) {
        RejectForm(data).then(res => {
          if (res.data.status === 1) {
            this.$toast.success("驳回成功");
            location.reload();
          } else {
            this.$toast.fail(res.data.message);
          }
        })
      },
      //==========采购单/一般报销单（结束）========
      //==========付款单（开始）========
      //付款单申请
      applyMoney() {
        this.payment.user_id = this.user_id;
        this.payment.purchase_id = this.purchase_id;
        if (!this.payment.payment_amount) {
          this.$toast.fail("本次支付金额不能为空");
          return false;
        }
        if (this.payment.payment_amount > this.shopTotlePrice - this.paidAmount) {
          this.$toast.fail("本次支付金额不能大于剩余待支付金额");
          return false;
        }
        this.payment.enclosure = this.paymentEnclosure.map(item => {
          return {
            image:item.image,
            small_image:item.small_image,
            title:item.file_title
          }
        });

        var enclosure = this.payment.enclosure;
        let isCompleted = true;
        if (enclosure.length > 0) {
          enclosure.forEach(item => {
            if (!item.image) {
              this.$toast.fail("附件为空");
              isCompleted = false;
              return false;
            } else if (!item.title) {
              this.$toast.fail("附件标题为空");
              isCompleted = false;
              return false;
            }
          })
        } else {
          this.$toast.fail("附件为空");
          isCompleted = false;
          return false;
        }
        if (!isCompleted) {
          return false;
        }

        Payment(this.payment).then(res => {
          console.log(res);
          if (res.data.status === 1) {
            this.$toast.success("申请成功");
            location.reload();
          } else {
            this.$toast.fail(res.data.message);
          }
        })
      },
      //上传附件
      selectFile(e) {
        console.log(e);
        var formData = new FormData();
        formData.append("file", e);
        const loading = this.$toast.loading({
          mask: true,
          message: '上传中',
          forbidClick: true,
          duration: 0
        });
        UploadFile(formData).then(res => {
          console.log(res);
          loading.clear();
          this.payment.enclosure.push({
            title: "",
            image: res.data.data.image,
            small_image: res.data.data.small_image,
          })
        })
      },
      //修改附件标题
      changTitle(e, fileindex) {
        console.log(e, fileindex);
        this.payment.enclosure[fileindex].title = e.file_title;
      },
      //删除附件
      deleteFile(e) {
        console.log(e);
        var file = this.payment.enclosure[e];
        DeleteFile(file).then(res => {
          if (res.data.status == 1) {
            this.$refs.uploadFile.delFileIndex(e);
            this.payment.enclosure.splice(e, 1);
          }
        })
      },
      //审核通过
      PaymentAgree(data) {
        PaymentAgree(data).then(res => {
          console.log(res);
          if (res.data.status === 1) {
            this.$toast.success(res.data.message);
            location.reload();
          } else {
            this.$toast.fail(res.data.message);
          }
        })
      },
      //审核驳回
      PaymentReject(data) {
        PaymentReject(data).then(res => {
          console.log(res);
          if (res.data.status === 1) {
            this.$toast.success(res.data.message);
            location.reload();
          } else {
            this.$toast.fail(res.data.message);
          }
        })
      },
      //==========付款单（结束）========
      //跳转填写页面，重新填写
      skipAgainFill() {
        var info_data = this.info_data;
        info_data.purchase_id = this.purchase_id;
        localStorage.setItem("purchase_info_data", JSON.stringify(info_data));
        this.$router.replace({
          path: "/purchase",
          query: {
            skipAgainFill: true
          }
        });
      },
      //终止表单
      stopForm() {
        stopForm({
          purchase_id: this.purchase_id,
          user_id: localStorage.getItem("user_id")
        }).then(res => {
          if (res.data.status === 1) {
            this.$toast.success("终止成功");
            setTimeout(() => {
              location.reload();
            }, 2000)
          } else {
            this.$toast.fail(res.data.message)
          }
        }).catch(() => {
          this.$toast.fail('系统异常,请联系管理员');
        })
      },
      //付款终止
      stopPayment() {
        stopPayment({
          purchase_id: this.purchase_id,
          budget_type: this.info_data.budget_type,
          deduction_department: this.info_data.deduction_department,
          total_money: this.shopTotlePrice,
          user_id: localStorage.getItem('user_id')
        }).then(res => {
          if (res.data.status === 1) {
            this.$toast.success("报告完成");
            setTimeout(() => {
              location.reload();
            }, 2000)

          } else {
            this.$toast.fail(res.data.message)
          }
        }).catch(() => {
          this.$toast.fail('系统异常,请联系管理员');
        })
      },
      // 发起人撤销采购单
      undoPurchase() {
        this.$createDialog({
          type: "confirm",
          icon: "cubeic-warn",
          title: "是否撤销采购/报销单",
          onConfirm: () => {
            UndoPurchase(this.purchase_id).then(res => {
              if (res.data.status === 1) {
                this.$toast.success("已提交撤销申请，请等待部门主管审批");
                setTimeout(() => {
                  location.reload();
                }, 2000)
              } else {
                this.$toast.fail(res.data.message)
              }
            }).catch(() => {
              this.$toast.fail('系统异常,请联系管理员');
            })
          }
        }).show();
      },
      // 上级审批撤销
      undoApproval(isAgree) {
        if (isAgree) {
          // 同意
          this.$createDialog({
            type: "confirm",
            icon: "cubeic-warn",
            title: "是否同意撤销采购/报销单",
            onConfirm: () => {
              UndoPurchaseAgree(this.purchase_id).then(res => {
                if (res.data.status === 1) {
                  this.$toast.success("已同意撤销申请");
                  setTimeout(() => {
                    location.reload();
                  }, 2000)
                } else {
                  this.$toast.fail(res.data.message)
                }
              }).catch(() => {
                this.$toast.fail('系统异常,请联系管理员');
              });
            }
          }).show();

        } else {
          this.$createDialog({
            type: "prompt",
            icon: "cubeic-warn",
            title: "请填写拒绝理由",
            onConfirm: (e, content) => {
              // 拒绝
              UndoPurchaseReject(this.purchase_id, content).then(res => {
                if (res.data.status === 1) {
                  this.$toast.success("已拒绝撤销申请");
                  setTimeout(() => {
                    location.reload();
                  }, 2000)
                } else {
                  this.$toast.fail(res.data.message)
                }
              }).catch(() => {
                this.$toast.fail('系统异常,请联系管理员');
              });
            }
          }).show();
        }
      },
      kiloToNum(value) {
        return +value.replace(",", "")
      }
    },
    mounted() {
      // 获取详情信息
      ListDetail({purchase_id: this.purchase_id, user_id: this.user_id}).then(res => {
        if (res.data.status === 1) {
          var data = res.data.data;
          this.user_info.user_name = data.username;
          this.user_info.user_id = data.userid;
          this.user_info.user_avatar = data.user_logo;
          this.user_info.report_status = data.status;
          this.user_info.department = data.department;
          this.user_info.position = data.position;
          for (let key in this.info_data) {
            this.info_data[key] = data[key];
          }
          this.approvalStatus = data.approvalStatus;
          this.info_data.detail.forEach(item => {
            if (item.recommend == 1) {
              this.shopTotlePrice = this.kiloToNum(item.total_price);
            }
          });

          if (this.user_info.my_type == 2) {
            MarkRead(this.$route.params.id)
          }

        }

      });

      // 获取剩余
      request.post('/api/Form/ExtraPrice', {
        purchase_id: this.$route.params.id
      }).then(res => {
        this.paidAmount = res.data.data;
      })
    }
  }
</script>

<style scoped src="./details.css"></style>
