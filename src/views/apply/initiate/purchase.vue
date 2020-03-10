<template>
  <div class="mt20 mb20">
    <v-picker :options="options.item_types" :p-display-text="budgetType"
              @select="billsTypeSelect"
              class="mb20" required
              title="单据类型"
              type="radio"
              v-model="form_model.type"
    />
    <v-input class="mb20" required title="采购/报销主题" type="text" v-model="form_model.title"/>
    <v-input class="mb20" required title="采购用途" type="text" v-model="form_model.purpose"/>
    <v-picker :options="options.apply_dep" :p-display-text="form_model.application_department"
              class="mb20"
              required
              text="department"
              title="申请部门"
              type="radio" v-model="form_model.application_department"
              values="department"
    />
    <v-picker :options="options.apply_dep"
              :p-display-text="form_model.deduction_department"
              @select="departemntSelect"
              class="mb20"
              required
              text="department"
              title="费用扣除部门" type="radio"
              v-model="form_model.deduction_department"
              values="department"
    />
    <v-picker :options="options.budget" :p-display-text="form_model.budget_type"
              @select="budgetSelect"
              class="mb20"
              ref="bugdet"
              required
              text="SDE_code"
              title="预算类型"
              type="radio" v-model="form_model.budget_type"
              values="index"
    />
    <v-input class="mb20" placeholder="" readonly required title="预算口径" type="text"
             v-model="form_model.budget_caliber"/>
    <v-input class="mb20" placeholder="" readonly required title="剩余预算" type="text"
             v-model="form_model.budget_surplus"/>

    <v-picker :options="[{text:'是',value:2},{text:'否',value:1}]"
              :p-display-text="pText.is_contract"
              class="mb20"
              required
              @select="onChangeContract"
              title="是否签订合同"
              v-model="form_model.is_contract"/>

    <v-input class="mb20" required title="合同编号" v-if="form_model.is_contract == 2" v-model="form_model.contract_num"/>

    <v-input class="mb20" readonly title="财年" v-model="form_model.price_year"/>

    <!-- 采购单开始 -->
    <section v-if="form_model.type==1">
      <p class="form-detail-title-huge ml15 mb10">采购</p>
      <div class="form-group">
        <div>
          <v-picker :options="options.procurement_method"
                    :p-display-text="form_model.procurement_method"
                    @select="procurementSelect"
                    required
                    title="采购方式" v-model="form_model.procurement_method"/>

          <v-picker :options="options.incident_report"
                    text="abstract"
                    title="事件报告补充"
                    v-model="form_model.post_id" values="id"/>

          <v-picker :options="[{text:'是',value:2},{text:'否',value:1}]"
                    :p-display-text="pText.is_new_year"
                    required
                    v-if="form_model.is_contract == 2"
                    title="是否跨财年采购"
                    ref="isSpanYearPurchase"
                    v-model="form_model.is_new_year"/>

          <v-input required title="本财年使用金额" v-if="form_model.is_new_year === 2" v-model="form_model.year_price"/>

          <!-- 承包商 （循环开始）-->
          <swiper ref="contractor">
            <swiper-slide :key="item.keyValue" v-for="(item,index) in form_model.detail">
              <p class="form-detail-head">

                <span style="min-width: 3.75rem">
                  <a @click="contractor_swiper.slidePrev()" class="pointer" style="color: #6b98fc" v-if="index != 0">
                    <i class="fa fa-arrow-left mr5"></i>上一家
                  </a>
                </span>

                <span class="font-bold fs08">承包商及商品报价{{index+1}}</span>

                <span style="min-width: 3.75rem">
                  <a @click="contractor_swiper.slideNext()"
                     class="pointer"
                     style="color: #6b98fc"
                     v-if="index != form_model.detail.length-1">
                    下一家<i class="fa fa-arrow-right ml5"></i>
                  </a>
                </span>

                <!--<span @click="deleteShop(index)" style="color:#F22242" v-if="index>0">-->
                <!--  <i class="fa fa-minus-square mr5"></i>-->
                <!--  删除承包商{{index>0?index+1:''}}-->
                <!--</span>-->
              </p>
              <v-input required title="承包商名称" type="text" v-model="item.contractor"/>
              <!-- 商品 （循环开始）-->
              <section v-for="(commodity,cindex) in item.data">
                <p class="form-detail-title-bold pl15 pt15 pb10 pr15 dpfx fxjbw">
                  商品{{cindex+1}}
                  <span @click="deleteCommodity(index,cindex)" style="color:#F22242" v-if="cindex>0">
                <i class="fa fa-minus-square mr5"></i>
                删除商品{{cindex+1}}
                </span>
                </p>
                <v-input @input="inputShopName($event,cindex)"
                         required
                         title="品名"
                         type="text"
                         v-model="commodity.product_name"/>
                <v-input @input="inputShopCount($event,cindex)"
                         required
                         title="数量"
                         type="number"
                         v-model="commodity.number"/>
                <v-input @input="inputShopUnit($event,cindex)" required title="单位" v-model="commodity.unit"/>
                <v-input @input="moneyTotal(index)" required title="单价" type="number" v-model="commodity.price"/>
              </section>
              <!-- 商品 （循环结束）-->
              <action-line @click="addCommodity(index)" class="ml15" font-class="fa fa-plus-circle">添加商品</action-line>
              <v-input placeholder="自动计算" readonly title="总价" type="text" v-model="item.total_price"/>
              <div v-if="showRecommend">
                <v-picker :options="options.recommend"
                          :p-display-text="item.recommend?'是':''"
                          left-style="flex:4"
                          required
                          right-style="flex:3"
                          title="是否推荐为本次采购承包商"
                          v-model="item.recommend"/>
              </div>
            </swiper-slide>
            <!-- 承包商 （循环结束）-->
          </swiper>

          <!--<action-line @click="addShop" class="ml15" v-if="showRecommend">添加承包商</action-line>-->

          <div class="divider-20"></div>

          <!--   采购原因（开始） -->
          <!--<v-input required title="建议说明" type="textarea" v-model="form_model.advice"/>-->
          <section class="reason-wrp" v-for="(item,index) in form_model.reason">
            <v-input :key="index" :title="'建议原因'+(index>0?index+1:'')" required type="textarea" v-model="item.reason"/>
            <span @click="deleteReason(index)" class="del-reason" style="color:#F22242" v-if="index>0">
                <i class="fa fa-minus-square mr5"></i>
                删除建议原因
            </span>
          </section>
          <!--   采购原因（结束） -->
          <action-line @click="addReason" class="ml15" font-class="fa fa-plus-circle">添加建议原因</action-line>
        </div>
      </div>
    </section>


    <!-- 报销单 -->
    <section class="mb20" v-else-if="form_model.type==2">
      <p class="form-detail-title-huge margin15">一般费用报销</p>
      <div class="form-group">
        <!--<v-input required title="费用用途补充" type="textarea" v-model="form_model.price.price_purpose"/>-->
        <v-input placeholder="请输入" required title="总金额" v-model="form_model.price.total_price"/>
        <v-input title="备注" type="textarea" v-model="form_model.remark"/>
      </div>
    </section>
    <!--   附件   -->
    <v-file-container :files="form_model.enclosure" :required="true" :required-notice="fileNotice.text"
                      auto_del auto_upload
                      ref="uploadFile" v-if="form_model.type"/>
    <!-- 审批人 -->
    <!--<v-approver-container :approver="approver" avatar="user_logo" class="mt20"/>-->
    <!-- 抄送人 -->
    <v-ccp-container :ccp="form_model.copier" :ccp_selection="options.ccp" class="mt20"/>
    <!-- 抄送群组 -->
    <v-ccp-group-container :ccp_group="form_model.group"
                           :ccp_group_seletion="options.ccp_group"
                           class="mt20"
                           text="name"
                           values="group_id"/>

    <a @click="InitiateProcurement" class="form-submit-block">提交采购/一般费用表</a>
    <a @click="SaveDrafts" class="form-submit-block" v-if="form_model.status!=3">保存草稿箱</a>

  </div>
</template>

<script>

  import vInput from "@/components/form/v-input";
  import vPicker from "@/components/form/v-picker";
  import vFileContainer from "@/components/form/v-file-container";
  import actionLine from "@/components/form/action-line";
  import vApproverContainer from "@/components/form/v-approver-container";
  import VCcpContainer from "@/components/form/v-ccp-container";
  import VCcpGroupContainer from "@/components/form/v-ccp-group-container";
  import {
    ApplicationDepartment,
    Approval,
    CopierInfo,
    DeleteFile,
    Drafts,
    getDepartemnt, GetPriceYear,
    GroupInfo,
    ListDetail,
    ModifyForm,
    PortInfo,
    Purchase,
    UploadFile
  } from "@/api/initiate/purchase";

  export default {
    name: "purchase",
    components: {
      VCcpGroupContainer,
      VCcpContainer,
      vInput,
      vPicker,
      vFileContainer,
      actionLine,
      vApproverContainer
    },
    data() {
      return {
        // 数据模型对象
        model: {},
        //判断是要需要显示推荐承包商按钮
        showRecommend: false,
        //判断是否重新填写
        AgainFill: false,
        //附件数组==》存放不需要的数据
        enclosure: [],
        // menuKey: 0,
        //切换采购单和报销单
        isPurchase: true,
        //采购方式
        procurement_method: "",
        // 选择器的选项
        options: {
          price_year: [],
          //单据类型
          item_types: [{
            text: "采购",
            value: 1
          }, {
            text: "一般费用报销",
            value: 2
          }],
          //预算类型
          budget: [],
          //部门
          apply_dep: [],
          //采购方式
          procurement_method: [{
            text: "报价豁免",
            value: "报价豁免"
          }, {
            text: "合同补仓",
            value: "合同补仓"
          }, {
            text: "两家报价",
            value: "两家报价"
          }, {
            text: "三家报价",
            value: "三家报价"
          }, {
            text: "实报实销（无多家报价）",
            value: "实报实销（无多家报价）"
          }],
          //事件报告
          incident_report: [],
          //抄送人
          ccp: [],
          ccp_group: [],
          //推荐承包商
          recommend: [{
            text: "是",
            value: 1
          }, {
            text: "否",
            value: 0
          }]
        },
        // 用户填写的表单的原始数据
        form_model: {
          //表单id
          purchase_id: null,
          //主题
          title: null,
          //用途
          purpose: null,
          //申请人id
          user_id: "",
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
          procurement_method: "",
          post_id: "",
          //单据类型
          type: "",
          //附件数组
          enclosure: [],
          // 已选择的抄送人
          copier: [],
          // 抄送群组
          group: [],
          //原因数组
          reason: [],
          //承包商
          detail: [],

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
        pText: {
          is_contract: "",
          is_new_year: ""
        },
        // 审批人
        approver: [
          {
            avatar:
              "https://hbimg.huabanimg.com/2bdc192d664f15ecafbc38ac0d56a0dc65452658199b46-61XUZy",
            username: "Thdes Ararel"
          },
          {
            avatar:
              "https://hbimg.huabanimg.com/32d78fbc24f6872cbd938c302a8b59c467db039d1764ec-seC2Ow",
            username: "Forer Doer"
          }
        ],
      }
    },
    computed: {
      budgetType: function () {
        if (this.form_model.type == 1) {
          return "采购";
        } else if (this.form_model.type == 2) {
          return "一般费用报销";
        }
      },
      fileNotice() {
        var required;
        var text = "";
        if (this.form_model.type === 1 && this.procurement_method === '合同补仓') {
          required = true;
          text = '您已选择合同补仓，必须添加合同附件'
        }
        return {
          required,
          text
        }
      },
      contractor_swiper() {
        return this.$refs.contractor.swiper
      }
    },
    methods: {
      /** 保存草稿箱
       * @return {boolean}
       */
      SaveDrafts() {
        if (this.form_model.type) {

          //判断附件数据
          var enclosure = this.form_model.enclosure;
          enclosure.forEach(item => {
            item.title = item.file_title
          });
          var isNoTitle = null;

          enclosure.some((item, index) => {
            if (!item.title) {
              isNoTitle = index;
              return true
            }
          });

          if (isNoTitle !== null) {
            this.showToast("请填写附件" + (isNoTitle + 1) + "的标题");
            return false
          }

          if (enclosure.some(item => item.need_reupload)) {
            this.showToast('请将【上传失败】的文件手动删除后再提交！');
            return false;
          }

          const loading = this.$toast.loading({
            mask: true,
            message: '保存中',
            forbidClick: true,
            duration: 0
          });
          Drafts(this.form_model).then(res => {
            // loading.clear();
            if (res.data.status == 1) {
              this.$toast.success("保存草稿箱成功")
            } else {
              this.$toast.fail(res.data.message);
            }
          }).finally(() => {
            setTimeout(() => {
              console.log("定时")
              loading.clear();
            }, 2000)
          }).catch(() => {
            this.$toast.fail("网络不稳定,连接中断")
          })
        } else {
          this.$toast.fail("请选择单据类型后,再保存草稿箱");
        }

      },
      // 添加商品
      addPurchase() {
        this.form_model.purchase_list.push({})
      },
      //获取预算类型
      getBudgetTypes() {
        this.form_model.budget_type = "";
        this.form_model.budget_caliber = "";
        this.form_model.budget_surplus = "";
        this.options.budget = [];
        this.$refs.bugdet.clear();
        //获取部门预算类型
        ApplicationDepartment({
          department: this.form_model.deduction_department
        }).then(res => {
          if (res.data.status == 1) {
            var data = res.data.data;
            // this.options.budget = data;
            this.$set(this.options, 'budget', data);
          }
        })
      },
      //预算类型选择
      budgetSelect(e) {
        var budget = this.options.budget[e];
        this.form_model.budget_type = budget["SDE_code"];
        this.form_model.budget_caliber = budget["budget_code"];
        this.form_model.budget_surplus = budget["budget_pool"];
      },
      //选择扣费部门
      departemntSelect(e) {
        console.log(e);
        this.getBudgetTypes();
      },
      //单据类型
      billsTypeSelect(e) {
        if (e === 1) {
          //采购单
          this.form_model.detail = [{
            contractor: "",
            data: [{
              product_name: "",
              number: null,
              price: null
            }],
            recommend: 0,
            total_price: null
          }];
          this.form_model.reason = [{
            reason: ""
          }];
          this.form_model.procurement_method = "";
          this.form_model.post_id = "";
          this.form_model.advice = "";
        } else {
          // this.form_model.id = undefined;
          this.form_model.price = {
            price_purpose: undefined,
            total_price: undefined
          }
        }

      },
      //采购方式选择
      procurementSelect(e) {
        // this.form_model.detail = [];
        this.$set(this.form_model, 'detail', []);
        this.procurement_method = e;


        //获取事件报告
        PortInfo({user_id: this.form_model.user_id}).then(res => {
          if (res.data.status == 1) {
            this.options.incident_report = res.data.data;
          }
        });

        this.showRecommend = e === "两家报价" || e === "三家报价";

        let count;
        if (e === "两家报价") {
          count = 2
        } else if (e === "三家报价") {
          count = 3
        } else {
          count = 1
        }

        for (let i = 0; i < count; i++) {
          this.addShop();
        }

      },
      //添加商品
      addCommodity(index) {
        var detail = this.form_model.detail;
        detail.forEach((item, index) => {
          item.data.push({
            product_name: "",
            number: undefined,
            price: undefined
          });
        });

        this.$set(this.form_model, 'detail', detail);
        // ++this.menuKey;
      },
      //删除商品
      deleteCommodity(index, cIndex) {
        this.$createDialog({
          type: 'confirm',
          title: '提示',
          content: '是否删除',
          icon: 'cubeic-alert',
          onConfirm: () => {
            var detail = this.form_model.detail;

            detail.forEach((item, d_index) => {
              item.data.splice(cIndex, 1);
              this.moneyTotal(d_index);
            });

            // --this.menuKey;
          }
        }).show()

      },
      //添加承包商
      addShop() {
        var isMulti = this.procurement_method === '两家报价' || this.procurement_method === '三家报价';
        this.form_model.detail.push({
          contractor: "",
          data: [{
            product_name: "",
            number: "",
            price: ""
          }],
          recommend: isMulti ? 0 : 1,
          total_price: "",
          keyValue: Date.now() * Math.random()
        })
        // ++this.menuKey;
      },
      //删除承包商
      deleteShop(index) {
        this.$createDialog({
          type: 'confirm',
          title: '提示',
          content: '是否删除',
          icon: 'cubeic-alert',
          onConfirm: () => {
            this.form_model.detail.splice(index, 1);
            // --this.menuKey;
          }
        }).show()
      },
      //添加原因
      addReason() {
        this.form_model.reason.push({
          reason: ""
        })
      },
      deleteReason(index) {
        this.$createDialog({
          type: 'confirm',
          title: '提示',
          content: '是否删除',
          icon: 'cubeic-alert',
          onConfirm: () => {
            this.form_model.reason.splice(index, 1);
          }
        }).show()
      },
      //计算总金额
      moneyTotal(index) {
        var detail = this.form_model.detail[index];
        var money_total = null;
        let data = detail.data;
        data.map(commodity => {
          if (commodity.number) {
            money_total += parseFloat(commodity.number ? commodity.number : 0) * parseFloat(commodity.price ? commodity.price : 0).toFixed(2);
          }
        });
        detail.total_price = money_total ? money_total + "" : 0;

        this.form_model.detail.splice(index, 1, detail)
      },
      //上传附件
      // selectFile(e) {
      //   console.log(e);
      //   var formData = new FormData();
      //   formData.append("file", e);
      //   const loading = this.$toast.loading({
      //     mask: true,
      //     message: '上传中',
      //     forbidClick: true,
      //     duration: 0
      //   });
      //   UploadFile(formData).then(res => {
      //     console.log(res);
      //     loading.clear();
      //     this.form_model.enclosure.push({
      //       title: "",
      //       image: res.data.data.image,
      //       small_image: res.data.data.small_image,
      //     })
      //   }).finally(() => {
      //     loading.clear();
      //   }).catch(() => {
      //     this.$toast.fail("网络不稳定,连接中断")
      //   })
      // },
      //删除附件
      // deleteFile(e) {
      //   console.log(e);
      //   var file = this.form_model.enclosure[e];
      //   DeleteFile(file).then(res => {
      //     if (res.data.status == 1) {
      //       this.$refs.uploadFile.delFileIndex(e);
      //       this.form_model.enclosure.splice(e, 1);
      //     }
      //   })
      // },
      //修改附件标题
      changTitle(e, fileindex) {
        console.log(e, fileindex);
        this.form_model.enclosure[fileindex].title = e.file_title;
      },
      //错误提示
      showToast(txt) {
        this.$notify({
          message: txt
        });
      },
      //表单验证
      formVerification() {
        //先验证公共部分
        var form_model = this.form_model;
        //公共部门
        if (!form_model.user_id) {
          this.showToast("用户id为空");
          return false;
        } else if (!form_model.title) {
          this.showToast("采购/报销主题为空");
          return false;
        } else if (!form_model.purpose) {
          this.showToast("采购用途为空");
          return false;
        } else if (!form_model.application_department) {
          this.showToast("申请部门为空");
          return false;
        } else if (!form_model.deduction_department) {
          this.showToast("费用扣除部门为空");
          return false;
        } else if (!form_model.budget_type) {
          this.showToast("预算类型为空");
          return false;
        } else if (!form_model.budget_caliber) {
          this.showToast("预算口径为空");
          return false;
        } else if (!form_model.budget_surplus) {
          this.showToast("剩余预算为空");
          return false;
        } else if (!form_model.type) {
          this.showToast("单据类型为空");
          return false;
        }

        if (!form_model.is_contract) {
          this.showToast("请选择是否签订合同");
          return false;
        }

        if (form_model.is_contract == 2 && !form_model.contract_num) {
          this.showToast("请填写合同编号");
          return false;
        }


        if (form_model.type == 1 && !form_model.is_new_year && form_model.is_contract === 2) {
          this.showToast("请选择是否跨财年采购");
          return false;
        }

        if (form_model.type == 1 && form_model.is_new_year == 2 && !form_model.year_price) {
          this.showToast("请填写本财年金额");
          return false;
        }


        //判断附件数据
        var enclosure = form_model.enclosure;
        form_model.enclosure.forEach(item => {
          item.title = item.file_title
        });
        var isNoTitle = null;

        if (enclosure.length > 0) {
          enclosure.some((item, index) => {
            if (!item.title) {
              isNoTitle = index;
              return true
            }
          });

          if (isNoTitle !== null) {
            this.showToast("请填写附件" + (isNoTitle + 1) + "的标题");
            return false
          }

          // enclosure.forEach(item => {
          //   if (!item.image) {
          //     this.showToast("附件为空");
          //     isNoTitle = true;
          //     return false;
          //   } else if (!item.title) {
          //     this.showToast("附件标题为空");
          //     return false;
          //   }
          // })
        } else {
          this.showToast("附件为空");
          return false;
        }

        if (enclosure.some(item => item.need_reupload)) {
          this.showToast('请将【上传失败】的文件手动删除后再提交！');
          return false;
        }

        //采购/报销判断
        if (form_model.type == 1) {
          //采购
          if (!form_model.procurement_method) {
            this.showToast("采购方式为空");
            return false;
          } else if (form_model.detail) {
            //计算承包商总价跟剩余预算对比和承包商判断
            var detail = form_model.detail;
            //判断承包商选择数量
            var recommend = 0;
            var map = {
              value: false,
              errmsg: ""
            }
            detail.forEach(item => {
              if (!item.contractor) {
                map.value = true;
                map.errmsg = "承包商名称为空";
                return false;
              }
              if (item.recommend == 1 && parseFloat(item.total_price) > parseFloat(form_model.budget_surplus)) {
                map.value = true;
                map.errmsg = "承包商" + item.contractor + "总价超过预算";
                return false;
              } else {
                if (!this.showRecommend) {
                  //没有推荐商家，只有一家
                  if (parseFloat(item.total_price) > parseFloat(form_model.budget_surplus)) {
                    map.value = true;
                    map.errmsg = "承包商" + item.contractor + "总价超过预算";
                    return false;
                  }
                }
              }
              if (item.data) {
                let data = item.data;
                data.forEach(comm => {
                  if (!comm.product_name) {
                    map.value = true;
                    map.errmsg = "商品名称为空";
                    return false;
                  } else if (!comm.number) {
                    map.value = true;
                    map.errmsg = "商品数量为空";
                    return false;
                  } else if (!comm.price) {
                    map.value = true;
                    map.errmsg = "商品价格为空";
                    return false;
                  } else if (!comm.unit) {
                    map.value = true;
                    map.errmsg = "商品单位为空";
                    return false;
                  }
                })
              }
              //判断承包商是否选择
              if (item.recommend == 1) {
                recommend++;
              }
            });
            console.log(map.value);
            if (map.value) {
              console.log(map.errmsg);
              this.showToast(map.errmsg);
              return false
            }
            if (this.showRecommend) {
              if (recommend > 1) {
                this.showToast("推荐承包商只能一家");
                return false;
              } else if (recommend === 0) {
                this.showToast("请选择一家为推荐承包商");
                return false;
              }
            }

          } else if (form_model.reason) {
            form_model.reason.forEach(item => {
              if (!item.reason) {
                this.showToast("原因为空");
                return false;
              }
            })
          }
          // else
          // if (!form_model.advice) {
          //   this.showToast("建议说明为空");
          //   return false;
          // } else
          // if (this.procurement_method === "实报实销（无多家报价）" && !form_model.post_id) {
          //   this.showToast("事件报告为空");
          //   return false;
          // }
        } else {
          //报销单
          var price = form_model.price;
          // if (!price.price_purpose) {
          //   this.showToast("费用用途为空");
          //   return false;
          // } else
          if (!price.total_price) {
            this.showToast("总金额为空");
            return false;
          } else if (parseFloat(price.total_price) > parseFloat(form_model.budget_surplus)) {
            this.showToast("总金额大于部门预算");
            return false;
          }
        }
        return true;
      },
      //提交表单
      InitiateProcurement() {
        //表单验证
        if (this.formVerification()) {
          //验证成功
          console.log("验证成功");
          const loading = this.$toast.loading({
            mask: true,
            message: "表单上传中",
            forbidClick: true,
            duration: 0
          });
          if (this.AgainFill) {
            //重新提交
            ModifyForm(this.form_model).then(res => {
              console.log(res);
              if (res.data.status == 1) {
                this.$toast.success('申请成功');
                this.$router.replace({
                  path: '/mine',
                  query: {
                    refresh: 'true'
                  }
                });
              } else {
                this.$toast.fail(res.data.message);
              }
            }).finally(() => {
              setTimeout(() => {
                loading.clear();
              }, 2000)
            }).catch(() => {
              this.$toast.fail("网络不稳定，连接中断");
            })
          } else {
            Purchase(this.form_model).then(res => {
              console.log(res);
              loading.clear();
              if (res.data.status == 1) {
                this.$toast.success('申请成功');
                this.$router.replace({
                  path: '/mine',
                  query: {
                    refresh: 'true'
                  }
                });
              } else {
                this.$toast.fail(res.data.message);
              }
            }).finally(() => {
              setTimeout(() => {
                loading.clear();
              }, 2000)
            }).catch(() => {
              this.$toast.fail("网络不稳定，连接中断");
            })
          }

        }
      }
      ,
      inputShopName(value, cindex) {
        this.form_model.detail.forEach((item, index) => {
          item.data[cindex].product_name = value;
        })
      }
      ,
      inputShopCount(value, cindex) {
        this.form_model.detail.forEach((item, index) => {
          item.data[cindex].number = value;
          this.moneyTotal(index);
        });
      }
      ,
      inputShopUnit(value, cindex) {
        this.form_model.detail.forEach((item, index) => {
          item.data[cindex].unit = value;
        })
      },
      onChangeContract() {
        this.form_model.is_new_year = null;
        this.form_model.year_price = null;
        this.$refs.isSpanYearPurchase && this.$refs.isSpanYearPurchase.clear();

      }
    },
    created() {
      this.form_model.user_id = localStorage.getItem("user_id");
      this.form_model.application_department = localStorage.getItem("department");
      this.form_model.deduction_department = localStorage.getItem("department");
    }
    ,
    mounted() {
      //获取事件报告
      PortInfo({user_id: this.form_model.user_id}).then(res => {
        if (res.data.status == 1) {
          this.options.incident_report = res.data.data;
        }
      });
      // 获取财年
      GetPriceYear().then(res => {
        this.form_model.price_year = res.data.data.Year;
      });
      //获取部门预算类型
      this.getBudgetTypes();
      //获取部门列表
      getDepartemnt().then(res => {
        if (res.data.status == 1) {
          this.options.apply_dep = res.data.data;
        }
      });
      //获取抄送人
      CopierInfo().then(res => {
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
        })
        this.options.ccp = resdata;
        //构建重新填写表单的抄送人
        if (this.$route.query.skipAgainFill) {
          var copier = [];
          this.form_model.copier.forEach(item => {
            resdata.forEach(ccpitem => {
              ccpitem.children.forEach(childrenItem => {
                if (item === childrenItem.text) {
                  console.log(childrenItem.value);
                  copier.push(childrenItem.value);
                }
              })
            })
          })
          this.form_model.copier = copier;
        }

      });
      //获取抄送人群组
      GroupInfo().then(res => {
        console.log(res);
        this.options.ccp_group = res.data.data;
        var resdata = res.data.data
        //构建重新填写表单的抄送人
        if (this.$route.query.skipAgainFill) {
          var ccp_group = [];
          this.form_model.group.forEach(item => {
            resdata.forEach(ccpitem => {
              if (item === ccpitem.name) {
                ccp_group.push(ccpitem);
              }
            })
          });
          this.form_model.group = ccp_group;
        }
      });
      //获取审批人列表
      Approval({user_id: this.form_model.user_id}).then(res => {
        this.approver = res.data.data.filter(item => {
          return !!item
        });
      });
      //判断是否是重新填写
      if (this.$route.query.skipAgainFill) {
        this.AgainFill = this.$route.query.skipAgainFill;
        let data = JSON.parse(localStorage.getItem("purchase_info_data"));

        data.user_id = localStorage.getItem("user_id");
        data.detail.forEach(item => {
          item.total_price = +item.total_price.toString().replace(',', '');
        });

        data.enclosure = data.enclosure.map(item => {
          return {
            image: item.file_url,
            small_image: item.small_image,
            id: item.id,
            file_img: item.file_url,
            file_name: item.title,
            file_title: item.title
          };
        });

        this.form_model = data;

        this.pText.is_contract = this.form_model.is_contract == 2 ? '是' : '否';
        this.pText.is_new_year = this.form_model.is_new_year == 2 ? '是' : '否';

        // localStorage.removeItem('purchase_info_data');
      }

      //  判断是否草稿箱，回写
      var query = this.$route.query;
      if (query.mode === 'draft') {
        ListDetail({
          "user_id": localStorage.getItem("user_id"),
          "purchase_id": query.draft_id
        }).then(res => {
          this.form_model = res.data.data;
          this.form_model.user_id = localStorage.getItem("user_id");
          this.form_model.enclosure = this.form_model.enclosure.map(item => {
            return {
              image: item.file_url,
              small_image: item.small_image,
              id: item.id,
              file_img: item.file_url,
              file_name: item.title,
              file_title: item.title
            };
          })
        })
      }


    }
  }
</script>

<style scoped>
  .reason-wrp {
    position: relative;
  }

  .del-reason {
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 9;
    font-size: 0.875rem;
  }
</style>
