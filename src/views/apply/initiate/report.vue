<template>
  <div class="home-page bg-grey report">
    <!-- <navigate class="nav-bar" :navName="navName"></navigate> -->
    <main class="fs08">
      <!-- 报告摘要 -->
      <div class="form-item-wrp pd15">
        <div class="form-title mb15">
          报告摘要
          <span class="required">*</span>
        </div>
        <cube-textarea
          :autoExpand="false"
          :maxlength="100"
          placeholder="请填写摘要"
          v-model="form.abstract"
        ></cube-textarea>
      </div>
      <!-- 事件类型 -->
      <div @click="showMul" class="form-inline mt20">
        <div class="form-title fx100">
          事件类型
          <span class="required">*</span>
        </div>
        <div class="crbbb dpfx fxac picker__checked">
          <span v-if="!form.type.length">请选择事件类型&nbsp;</span>
          <span v-else>{{form.type | mulType}}</span>
          <i class="ml5 fa fa-chevron-right"></i>
        </div>
      </div>

      <!-- 其他事件类型-->
      <label class="form-inline" v-if="form.type.indexOf('其他')!==-1">
        <div class="form-title fx100">其他事件类型</div>
        <div class="crbbb dpfx fxac text-right">
          <input class="inline-input" placeholder='请输入其他事件类型' type="text" v-model="form.more_type">
        </div>
      </label>

      <!-- 项目名称 -->
      <div @click="choosePick('title')" class="form-inline">
        <div class="form-title fx100">
          项目名称
          <span class="required">*</span>
        </div>
        <div class="crbbb dpfx fxac">
          {{!form.title?'请选择项目名称':form.title}}
          <i class="ml5 fa fa-chevron-right"></i>
        </div>
      </div>
      <!-- 大簿编号 -->
      <label class="form-inline">
        <div class="form-title fx100">大簿编号</div>
        <div class="crbbb dpfx fxac text-right">
          <input class="inline-input" placeholder="请输入对应大簿编号" type="text" v-model="form.book_num">
        </div>
      </label>
      <!-- 报告日期 -->
      <div @click="showDatePicker('create_time')" class="form-inline">
        <div class="form-title fx100">
          报告日期
          <span class="required">*</span>
        </div>
        <div class="crbbb dpfx fxac">
          <span v-if="!form.create_time">请选择报告日期&nbsp;</span>
          <span v-else>{{form.create_time | StamptoString}}</span>

          <i class="ml5 fa fa-chevron-right"></i>
        </div>
      </div>
      <!-- 事件发生日期 -->
      <div @click="showDatePicker('happen_time')" class="form-inline">
        <div class="form-title fx100">
          事件发生日期
          <span class="required">*</span>
        </div>
        <div class="crbbb dpfx fxac">
          <span v-if="!form.happen_time">请选择事件发生日期&nbsp;</span>
          <span v-else>{{form.happen_time | StamptoString}}</span>

          <i class="ml5 fa fa-chevron-right"></i>
        </div>
      </div>
      <!-- 地点 -->
      <div @click="choosePick('place')" class="form-inline">
        <div class="form-title fx100">
          地点
          <span class="required">*</span>
        </div>
        <div class="crbbb dpfx fxac">
          {{!form.place?'请选择事件发生地点':form.place}}
          <i class="ml5 fa fa-chevron-right"></i>
        </div>
      </div>
      <!-- 详细地点-->
      <label class="form-inline">
        <div class="form-title fx100">
          详细地点
          <span class="required">*</span>
        </div>
        <div class="crbbb dpfx fxac text-right">
          <input class="inline-input" placeholder="请输入详细地点" type="text" v-model="form.detail_place">
        </div>
      </label>
      <!-- 保险相关 -->
      <div @click="choosePick('is_safe')" class="form-inline">
        <div class="form-title fx100">
          保险相关
          <span class="required">*</span>
        </div>
        <div class="crbbb dpfx fxac">
          <span v-if="!form.is_safe">请选择&nbsp;</span>
          <span v-else>{{form.is_safe | isSafe}}</span>

          <i class="ml5 fa fa-chevron-right"></i>
        </div>
      </div>
      <!-- 警察/消防到达时间 -->
      <div @click="showDatePicker('po_time')" class="form-inline">
        <div class="form-title fx100">警察/消防到达时间</div>
        <div class="crbbb dpfx fxac">
          <span v-if="!form.po_time">请选择&nbsp;</span>
          <span v-else>{{form.po_time | StamptoTime}}</span>

          <i class="ml5 fa fa-chevron-right"></i>
        </div>
      </div>
      <!-- 救伤车到达时间 -->
      <div @click="showDatePicker('doc_time')" class="form-inline">
        <div class="form-title fx100">救伤车到达时间</div>
        <div class="crbbb dpfx fxac">
          <span v-if="!form.doc_time">请选择&nbsp;</span>
          <span v-else>{{form.doc_time | StamptoTime}}</span>

          <i class="ml5 fa fa-chevron-right"></i>
        </div>
      </div>
      <div class="form-inline">
        <div class="form-title fx100">是否为危机事件 <span class="required">*</span></div>
        <div >
           <cube-radio-group @input="radioChange" v-model="selectedRadio"  :options="optionsRadio" :horizontal="true" />
        </div>
      </div>
     

      <!-- 明细 -->

      <!-- 填写明细开始 -->
      <div class="details-wrp">
        <!-- 明细模版 -->
        <template v-for="(item,index) in details">
          <div :key="index">
            <p class="pl15 pb10 pt10 crbbb bg-grey">明细{{index+1}}</p>
            <div @click="showDetailDatePicker('detial_time_'+index,index)" class="details-time">
              <div class="form-title fx100">
                日期+时间
                <span class="required">*</span>
              </div>
              <div class="crbbb dpfx fxac">
                <span v-if="!item.date_time">请选择&nbsp;</span>
                <span v-else>{{item.date_time | StamptoTime}}</span>
                <i class="ml5 fa fa-chevron-right"></i>
              </div>
            </div>
            <div class="details-d">
              <div class="form-title mb10">
                详情
                <span class="required">*</span>
              </div>
              <cube-textarea
                :autoExpand="false"
                :maxlength="500"
                placeholder="请输入"
                v-model="item.content"
              ></cube-textarea>
              <v-file-container :files="item.file"
                                @del:file="delMxFile(item.file[$event].id)"
                                auto_del
                                auto_upload
                                limit_title
                                style="border: none;padding: 0;margin-top: 20px;"/>
            </div>


            <!--&lt;!&ndash; 已添加的明细内附件列表 &ndash;&gt;-->
            <!--<file-add :file-obj="fileItem"-->
            <!--          :key="i"-->
            <!--          @del="delMxFile(fileItem,i,item.file)"-->
            <!--          class="file-add-wrp"-->
            <!--          v-for="(fileItem,i) in item.file"-->
            <!--          v-model="fileItem.file_title"-->
            <!--/>-->
            <!--&lt;!&ndash; 添加明细内附件 &ndash;&gt;-->
            <!--<label class="add-file-wrp">-->
            <!--  <i class="fa fa-plus-circle"></i>-->
            <!--  <input @change="addMxFile(item,$event)" type="file">-->
            <!--  添加附件-->
            <!--</label>-->

            <div class="r-el-detail clear">
              <div @click="delDetail(item,index)" class="fl-right" v-if="index!=0">
                <i class="fa fa-minus-circle"></i>
                删除该明细
              </div>
            </div>
          </div>
        </template>
        <!-- 添加明细 -->
        <div @click="addDetail" class="add-details">
          <i class="fa fa-plus-circle"></i>
          添加明细
        </div>
      </div>

      <!-- 综合附件 -->
      <!--<div class="form-item-wrp pd15">-->
      <!--  <div class="form-title mb15">-->
      <!--    附件-->
      <!--  </div>-->
      <!--  <file-add :file-obj="item"-->
      <!--            :key="index"-->
      <!--            @del="delFileItem(item,index)"-->
      <!--            class="mb15"-->
      <!--            v-for="(item,index) in addfile"-->
      <!--            v-model="item.file_title"-->
      <!--  />-->

      <!--  &lt;!&ndash; 添加附件按钮 &ndash;&gt;-->
      <!--  <label class="attach">-->
      <!--    <input @change="chooseFile" type="file">-->
      <!--    <div class="at-wrp">-->

      <!--      <div class="at-r"></div>-->
      <!--      <div class="at-c"></div>-->
      <!--    </div>-->
      <!--  </label>-->
      <!--</div>-->

      <v-file-container :files="file_url" @del:file="delMxFile(file_url[$event].id)" auto_del auto_upload limit_title/>

      <!-- 审批人 -->
      <div class="form-item-wrp pd15">
        <div class="form-title mb15">
          审批人
          <span class="required">*</span>
          <span class="pl10 crbbb fs07">（已由管理员预设不可修改）</span>
        </div>
        <div class="dpfx">
          <template v-for="(item, index) in approverList">
            <div :key="index" class="appro-wrp">
              <!-- <i class="fa fa-user-circle appro-img"></i> -->
              <img :src="item.user_logo" class="appro-img">
              <div class="appro-name">{{item.username}}</div>
            </div>
          </template>
        </div>
      </div>

      <!-- 抄送人 -->
      <div class="form-item-wrp pd15">
        <div class="form-title mb15">抄送人</div>
        <div class="copy-men-wrp">
          <template v-for="(item,index) in selectedCopy">
            <div :key="index" @click="delCopyMen(index)" class="appro-wrp">
              <!-- <i class="fa fa-user-circle appro-img"></i> -->
              <img :src="item.user_logo" class="appro-img">
              <div class="appro-name">{{item.username}}</div>

              <div class="at-x">
                <i class="del-icon"></i>
              </div>
            </div>
          </template>
          <div @click="showCopyPicker" class="copy-add">
            <div class="at-wrp">
              <div class="at-r"></div>
              <div class="at-c"></div>
            </div>
          </div>
        </div>
      </div>
      <!-- 抄送群组 -->
      <div class="form-item-wrp pd15">
        <div class="form-title mb15">抄送群组</div>
        <div class="copy-men-wrp">
          <template v-for="(item,index) in form.look_group">
            <div :key="index" class="look-group__wrap">
              <div class="look-group__item">
                <span>{{item.name}}</span>
                <del @click="form.look_group.splice(index,1)"
                     class="look-group__del">
                  <i class="del-icon"></i>
                </del>
              </div>
            </div>
          </template>
        </div>
        <div @click="showLookGroupPicker" class="copy-add" v-if="!form.look_group.length">
          <div class="at-wrp">
            <div class="at-r"></div>
            <div class="at-c"></div>
          </div>
        </div>
      </div>

      <!-- 提交 -->
      <cube-button
        :inline="true"
        :primary="true"
        @click="submitForm"
        class="form-sub"
        type="submit"
      >{{mode?'重新提交':'提交'}}
      </cube-button>

      <!--保存至草稿箱-->
      <cube-button
        :inline="true"
        @click="saveToDraft"
        class="form-sub"
        style="background-color: rgb(22, 185, 208)"
        v-if="mode!=1"
      >保存至草稿箱
      </cube-button>
    </main>

    <!--&lt;!&ndash; 草稿箱&ndash;&gt;-->
    <!--&lt;!&ndash; 保存的列表 &ndash;&gt;-->
    <!--<draft-box-->
    <!--  @close="isShowDraft=false"-->
    <!--  @del="delDraftItem"-->
    <!--  @edit="draftEdit"-->
    <!--  @uploadDetailFile="uploadDetailFile"-->
    <!--  mode="show"-->
    <!--  ref="draft_show"-->
    <!--  type="report"-->
    <!--  v-show="isShowDraft">-->
    <!--</draft-box>-->
    <!--&lt;!&ndash; 替换草稿列表 &ndash;&gt;-->
    <!--<draft-box-->
    <!--  :dataForm="form"-->
    <!--  @close="isShowDraftReplace=false"-->
    <!--  mode="replace"-->
    <!--  ref="draft_replace"-->
    <!--  type="report"-->
    <!--  v-show="isShowDraftReplace">-->
    <!--</draft-box>-->
    <!--&lt;!&ndash; 显示草稿箱按钮 &ndash;&gt;-->
    <!--<i @click="isShowDraft=true;$refs.draft_show.getDraftReport()" class="fa fa-file-text-o draft-box"></i>-->


    <!-- 选择事件类型 多选框 -->
    <div class="mul-bg" v-if="isMul">
      <div class="mul-wrp">
        <p class="mul-title">请选择事件类型</p>
        <div class="mul-g">
          <cube-scroll>
            <cube-checkbox-group :options="typeOpt" v-model="form.type"/>
          </cube-scroll>
        </div>
        <div class="mul-btns">
          <a @click="mulComfirm" class="mul-btn highlight" href="javascript:;">确定</a>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import draftBox from "../../../components/draft-box"
  import axios from "axios/index";
  import util from "../../../util/util.js";
  import FileAdd from "@/components/file-add/file-add";
  import {delFile} from "@/api/details/file";
  import {uploadDetailFile} from "@/api/initiate/initiate";
  import detailVue from '../../details/detail.vue';
  import VFileContainer from "@/components/form/v-file-container";
  import request from "@/api";
  import vPicker from "@/components/form/v-picker";

  export default {
    components: {
      VFileContainer,
      FileAdd,
      draftBox,
      vPicker
    },
    data() {
      return {
        navName: "事件报告",
        //发起报告还是重新填写： 重新填写则: 1 , 新发起则是0
        mode: this.$route.query.mode === "change" ? 1 : 0,
        //事件类型数据
        typeOpt: [],
        //选择器选项
        select: {
          //抄送群组
          look_group: [],
          //项目名称选项
          title: [],
          //地点
          place: [],
          //保险相关
          is_safe: [
            {
              text: "是",
              value: 2
            },
            {
              text: "否",
              value: 1
            }
          ]
        },
        //本地附件
        addfile: [],
        //附件文件
        //明细
        details: [
          {
            date_time: "",
            content: "",
            id: "",
            file: []
          }
        ],
        //提交表单数据
        form: {
          //事件类型
          type: [],
          //摘要
          abstract: "",
          //事件标题
          title: "",
          //大簿编号
          book_num: "",
          //事件地点
          place: "",
          //详细地点
          detail_place: "",
          //报告日期
          create_time: "",
          //事件发生日期
          happen_time: "",
          //保险相关
          is_safe: "",
          //警察
          po_time: "",
          //救护车
          doc_time: "",
          //是否为危机事件
          is_danger:0,
          //其他事件类型
          more_type: "",
          //草稿箱id
          port_id: "",
          //抄送群组
          look_group: []
        },
        file_url: [],
        subform: {},
        //审批人
        approverList: [
          {
            username: "Lily",
            user_logo: ""
          },
          {
            username: "Lin Zifeng",
            user_logo: ""
          }
        ],
        //抄送人数据数组
        copyMen: [],
        //选中抄送人列表
        selectedCopy: [],
        //显示事件类型多选列表
        isMul: false,
        //显示草稿箱
        isShowDraft: false,
        // 显示替换草稿箱
        isShowDraftReplace: false,
        selectedRadio: 0,
        optionsRadio: [
          {
            label: '是',
            value: 1
          },
          {
            label: '否',
            value: 0
          }
        ],
        radioSelectOption: [
          { text: '第一级（黄色）', value: 1},
          { text: '第二级（橙色）', value: 2 },
          { text: '第三级（粉红色）', value: 3 },
          { text: '第四级（红色）', value: 4 }
          ]
      };
    },
    methods: {
      radioChange(value) {
        if(value == 1) {
          this.showPicker()
        } else {
          this.$set(this.form,"is_danger",0)
        }
      },
       showPicker() {
        if (!this.picker) {
          this.picker = this.$createPicker({
            title: '危机级别',
            data: [this.radioSelectOption],
            onSelect: this.selectHandle,
            onCancel: this.cancelHandle
          })
        }
        this.picker.show()
      },
      selectHandle(value) {
        this.$set(this.form,"is_danger",value[0])
      },
      // saveDraft() {
      //   console.log("保存草稿箱");
      //   console.log(this.form);
      //   this.$refs.draft_show.saveDraftReport(this.form);
      // },
      // 选择器
      choosePick(n) {
        var vm = this;
        var name = n + "Picker";
        if (!this[name]) {
          this[name] = this.$createPicker({
            title: "请选择",
            data: [this.select[n]],
            onSelect(value, index, text) {
              var newFrom = Object.assign({}, vm.form);
              newFrom[n] = value[0];
              vm.form = newFrom;
            }
          });
        }
        this[name].show();
      },
      // 日期时间选择器（普通：yyyy-mm-dd HH:mm:ss）
      showDatePicker(n) {
        var vm = this;
        var name = n + "DatePicker";
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
              var newFrom = Object.assign({}, vm.form);
              newFrom[n] = vm.transStamp(date.getTime());
              vm.form = newFrom;
            }
          });
        }
        this[name].show();
      },
      // 日期+时间选择器（明细）
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
              vm.details[i].date_time = vm.transStamp(date.getTime());
            }
          });
        }
        this[name].show();
      },
      // 事件多选
      showMul() {
        this.isMul = true;
      },
      // 选择群组
      showLookGroupPicker() {
        var vm = this;
        if (!this.LookGroupPicker) {
          this.LookGroupPicker = this.$createPicker({
            title: "请选择",
            data: [this.select.look_group],
            onSelect(value, index, text) {
              if (value[0]) {
                var newFrom = Object.assign({}, vm.form);
                newFrom.look_group.push(value[0]);
                vm.form = newFrom;
              }

            }
          })
        }
        this.LookGroupPicker.show();
      },

      //事件类型多选
      mulComfirm() {
        this.isMul = false;
      },
      // 选择抄送人
      showCopyPicker() {
        var vm = this;
        if (!this.copySelectPicker) {
          this.copySelectPicker = this.$createCascadePicker({
            title: "请选择抄送人",
            data: this.copyMen,
            onSelect(value, index, text) {
              if (value[1]) {
                vm.selectedCopy.push(value[1]);
              }
            }
          });
        }
        this.copySelectPicker.show();
      },
      // 删除抄送人
      delCopyMen(i) {
        this.selectedCopy.splice(i, 1);
      },
      // 添加明细
      addDetail() {
        this.details.push({
          date_time: "",
          content: "",
          id: "",
          file: []
        });
      },
      // 删除明细
      delDetail(item, i) {
        this.$createDialog({
          type: "confirm",
          icon: "cubeic-alert",
          title: "确定删除该明细吗？",
          onConfirm: () => {
            if (item.id) {
              axios({
                baseURL: this.$store.state.domain,
                url: "/api/Draft/DeleteWork",
                method: "POST",
                data: {
                  work_id: item.id
                }
              })
                .then(res => {
                  this.$createToast({
                    txt: "删除成功",
                    time: 1000,
                    type: "correct"
                  }).show();
                  this.details.splice(i, 1);
                })
                .catch(err => {
                  console.log(err)
                  this.$createToast({
                    txt: "删除失败",
                    time: 1000,
                    type: "error"
                  }).show();
                })
            } else {
              this.$createToast({
                txt: "删除成功",
                time: 1000,
                type: "correct"
              }).show();
              this.details.splice(i, 1);
            }
          }
        }).show();


      },
      // 选择文件
      chooseFile(e) {
        var file = e.target.files[0];
        this.addfile.push({
          file: file,
          image: window.URL.createObjectURL(file),
          file_title: ""
        });
        e.target.value = "";
      },
      // 删除文件
      delFileItem(item, index) {
        if (item.id) {
          delFile(item.id).then(res => {
            this.$createToast({type: 'correct', txt: "删除成功"}).show();
            this.addfile.splice(index, 1);
          }).catch(() => {
            this.$createToast({type: 'error', txt: "删除失败"}).show();
          })
        } else {
          this.addfile.splice(index, 1);
        }
      },
      //验证提交数据
      dataVerify() {
        //获取表单数据
        var form = this.form;
        //判断事件的发生日期晚于报告日期
        if (form.create_time < form.happen_time) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "错误！事件的发生日期晚于报告日期！"
          }).show();
          return false;
        }
        //判断必须项
        if (!form.abstract ||
          !form.type ||
          !form.title ||
          !form.create_time ||
          !form.happen_time ||
          !form.place ||
          !form.detail_place ||
          !form.is_safe) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请填写所有必填项！"
          }).show();
          return false;
        }
        //判断类型是否是其他
        if (form.type instanceof Array) {
          form.type.forEach((e, i) => {
            if (e === "其他") {
              form.type.splice(i, 1);
              isOther = true;
            }
          });
        }
        if (isOther && !form.type.length && !form.more_type) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请填写其他事件类型！"
          }).show();
          return false;
        }
        //判断明细内容是否填写
        var details = this.details;
        var isDetail = true;
        var isDetailFile = true;
        var isFileAllUpload = true;
        details.forEach(detail => {
          if (!(detail.content && detail.date_time)) {
            this.$createToast({
              time: 1000,
              type: "txt",
              txt: "请检查明细的日期时间和详情"
            }).show();
            isDetail = false;
            return false;
          } else if (detail.file && detail.file.length > 0) {
            //判断附件标题
            var detailFileArray = detail.file;
            detailFileArray.forEach(detailFile => {
              if (!detailFile.file_title && !detailFile.title) {

                isDetailFile = false;
                return false;
              }
            })
          }

          if (detail.file.some(item => item.need_reupload)) {
            this.$createToast({
              txt: "请将【上传失败】的文件手动删除后再提交！",
              time: 1500,
              type: "error"
            }).show();
            isFileAllUpload = false;
            return false;
          }

        });
        if (!isDetail) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请检查明细的日期时间和详情"
          }).show();
          return false;
        } else if (!isDetailFile) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请检查明细的附件标题"
          }).show();
          return false;
        } else if (!isFileAllUpload) {
          this.$createToast({
            txt: "请将【上传失败】的文件手动删除后再提交！",
            time: 1500,
            type: "error"
          }).show();
          return false;
        }

        //判断类型是否有其他
        let isOther = false;
        if (form.type instanceof Array) {
          form.type.forEach((e, i) => {
            if (e === '其他') {
              form.type.splice(i, 1);
              isOther = true;
            }
          });
        }
        if (isOther && !form.type.length && !form.more_type) {
          this.$createToast({
            time: 1000,
            type: "txt",
            txt: "请填写其他事件类型！"
          }).show();
          return false;
        }

        // 至少有一个附件
        // var details_has_file = this.details.some(detail => detail.file.length);
        // if (!this.addfile.length && !details_has_file) {
        //     this.$createToast({time: 1000, type: "txt", txt: "请至少上传一个附件！"}).show();
        //     return false;
        // }


        //判断附件
        var isFileTitle = true;
        //验证附件标题
        this.file_url.forEach(file => {
          if (!file.file_title) {
            isFileTitle = false
          }
        });
        // else {
        //     this.$createToast({
        //         txt: "请添加附件",
        //         time: 1500,
        //         type: "error"
        //     }).show();
        //     return false;
        // }
        if (!isFileTitle) {
          this.$createToast({
            txt: "请将附件标题填写完整",
            time: 1500,
            type: "error"
          }).show();
          return false;
        }

        if (this.file_url.some(item => item.need_reupload)) {
          this.$createToast({
            txt: "请将【上传失败】的文件手动删除后再提交！",
            time: 1500,
            type: "error"
          }).show();
          return false;
        }
        return true;
      },
      // 处理数据(JSON)
      processData() {
        let form = {...this.form};
        form.user_id = localStorage.getItem("user_id");
        form.type = form.type.join(",");
        form.look_group = form.look_group.map(e => e.id).join(",");
        form.look_user = this.selectedCopy.map(e => e.id).join(",");
        form.file_url = this.file_url.map(item => {
          return {
            "file_url": item.image,
            "title": item.file_title,
            "small_image": item.small_image,
            "id": item.id
          }
        });
        form.details = this.details.map(item => {
          return {
            content: item.content,
            date_time: item.date_time,
            id: item.id,
            port_id: item.port_id,
            file: item.file.map(file => {
              return {
                "file_url": file.image,
                "title": file.file_title,
                "small_image": file.small_image,
                "id": file.id
              }
            })
          }
        });

        form.file_url = form.file_url.filter(item => !item.id);

        return form
      },
      // 提交表单(JSON)
      submitForm() {
        var loading = this.$createToast({
          txt: "正在验证数据....",
          type: "loading",
          mask: true,
          time: 0
        }).show();

        try {
          var isVerify = this.dataVerify();
        } catch (e) {
          console.warn(e);
          loading.hide();
        }


        if (!isVerify) {
          return false
        }

        var url = "";
        if (this.mode) {
          //重新提交
          url = "/api/approval/AgainReport";
          this.form.port_id = this.$route.query.id;
        } else {
          //提交
          url = "/api/Report/SendReport";
        }

        let data = this.processData();
        request.post(url, data).then(res => {
          loading.hide();
          this.$root.$createToast({
            type: "correct",
            txt: "发布成功",
            time: 1000
          }).show();
          this.$router.replace({
            path: '/mine',
            query: {
              tab: "underway"
            }
          })
        }).catch(err => {
          loading.hide();
          this.$toast.fail('请求错误');
          console.warn(err)
        })
      },
      // 时间戳转10位
      transStamp(n) {
        if (n.toString().length > 10) {
          return Math.floor(n / 1000);
        }
      },
      //报告数据回显
      // draftEdit(form) {
      //   console.log("draftEdit:", form);
      //   this.echoData(form);
      //   //获取草稿箱id
      //   this.form.event_id = form.id;
      //   //隐藏草稿箱
      //   this.isShowDraft = false;
      // },
      // 草稿箱数据回显
      echoData(data) {
        // 数据回显
        this.form = {};
        this.form.abstract = data.abstract;
        //事件类型：返回的是String，转成数组
        if (data.type == "") {
          this.form.type = [];
        } else {
          var type = data.type;
          this.form.type = type.split(",");
        }
        //其他类型
        this.form.more_type = data.more_type;
        if (data.more_type) {
          this.form.type.push("其他");
        }
        this.form.title = data.title;
        this.form.book_num = data.book_num;
        this.form.create_time = data.create_time;
        this.form.happen_time = data.happen_time;
        this.form.place = data.place;
        this.form.detail_place = data.detail_place;
        this.form.is_safe = data.is_safe * 1;
        this.form.po_time = data.po_time;
        this.form.doc_time = data.doc_time;
        this.selectedCopy = data.look_user;
        this.form.port_id = data.id;
        this.form.is_danger = data.is_danger;
        this.selectedRadio = data.is_danger==0?0:1
        let files = [];
        let remote_files = data.file_url;
        remote_files.forEach((e, i) => {
          files.push({
            file_title: e.title || e.file_name,
            image: e.file_url,
            small_image: e.small_image || e.file_url,
            id: e.id,
            file_desc: "已上传",
            file_img: e.small_image || e.file_url,
            file_name: e.file_name || e.title
          })
        });

        this.file_url = files;
        this.details = data.details;
        if (!data.details.length) {
          this.details.push(
            {
              date_time: "",
              content: "",
              id: "",
              file: []
            }
          )
        }

        this.details.forEach((item, i) => {
          if (!item.file) {
            item.file = [];
          }
          item.file = item.file.map(file => {
            return {
              file_title: file.title || file.file_name,
              image: file.file_url,
              small_image: file.small_image || file.file_url,
              id: file.id,
              file_desc: "已上传",
              file_img: file.small_image || file.file_url,
              file_name: file.file_name || file.title
            }
          })
        });

        this.form.look_group = data.look_group;
      },
      // 删除草稿项
      // delDraftItem(id) {
      //   if (id == this.form.event_id) {
      //     location.reload();
      //   }
      // },
      // 添加明细附件
      addMxFile(item, e) {
        var file = e.target.files[0];
        item.file.push({
          file: file,
          image: window.URL.createObjectURL(file),
          file_title: ""
        });
        e.target.value = "";
      },
      delMxFile(id) {
        if (!id) {
          return false
        }
        delFile(id).then(res => {
          this.$createToast({type: 'correct', txt: "删除成功"}).show();
        }).catch(() => {
          this.$createToast({type: 'error', txt: "删除失败"}).show();
        })
      },
      // 保存到草稿箱
      saveToDraft() {
        let loading = this.$toast.loading({mask: true, message: '正在保存...', duration: 0});
        // 验证附件标题
        if (this.file_url.length) {
          let fileTitleFull = this.file_url.some(item => !item.file_title);
          if (fileTitleFull) {
            this.$toast.fail('请填写附件标题');
            return false
          }
        }

        let detailFileTitleFull = this.details.some(detail => {
          return detail.file.length && detail.file.some(file => {
            return !file.file_title
          })
        });

        if (detailFileTitleFull) {
          this.$toast.fail('请填写明细内附件标题');
          return false
        }

        let data = this.processData();

        request.post('/api/Draft/PortSave', data).then(res => {
          loading.clear();
          this.$toast.success('已保存到草稿箱');
          this.form.port_id = res.data.data;

          request.post('/api/Draft/PortDetail', {port_id: this.form.port_id}).then(res => {
            var data = res.data.data[0];
            this.echoData(data);
          });


        }).catch(err => {
          loading.clear();
          this.$toast.fail('请求错误');
        })
      }

    },
    mounted() {
      var vm = this;
      // 事件发起选项
      axios({
        baseURL: this.$store.state.domain,
        url: "/api/Report/CallBack ",
        method: "POST",
        data: {
          user_id: localStorage.getItem("user_id")
        }
      }).then(res => {
        let data = res.data.data;
        // 事件类型
        data.type.forEach((e, i) => {
          vm.typeOpt.push(e.content);
        });
        vm.typeOpt.push("其他");
        // 项目名称
        data.title.forEach((e, i) => {
          if (!vm.select.title[i]) {
            vm.select.title[i] = {};
          }
          vm.select.title[i].text = e.content;
          vm.select.title[i].value = e.content;
        });
        //项目地点
        data.place.forEach((e, i) => {
          if (!vm.select.place[i]) {
            vm.select.place[i] = {};
          }
          vm.select.place[i].text = e.content;
          vm.select.place[i].value = e.content;
        });
        // 审批人
        vm.approverList = data.check_user;
      });
      // 事件发起-抄送人
      axios({
        baseURL: this.$store.state.domain,
        url: "/api/report/lookuser",
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
            user.value = e;
            user.text = e.username;
            dep.children.push(user);
          });
          list.push(dep);
        });
        this.copyMen = list;
      });

      // 判断是否为修改审批
      if (this.$route.query.mode == "change") {
        var id = this.$route.query.id;
        this.form.port_id = id;

        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Report/Details",
          method: "POST",
          headers: {
            token: localStorage.getItem("token")
          },
          data: {
            user_id: localStorage.getItem("user_id"),
            port_id: id
          }
        }).then(res => {
          var data = res.data.data[0];
          this.echoData(data);
        });
      }

      if (this.$route.query.mode == "draft") {
        var draft_id = this.$route.query.draft_id;
        request.post('/api/Draft/PortDetail', {port_id: draft_id}).then(res => {
          var data = res.data.data[0];
          this.echoData(data);
          this.form.port_id = draft_id;
        });
      }

      // 获取抄送群组信息
      axios({
        baseURL: this.$store.state.domain,
        url: "/api/approval/TransGroup",
        method: "POST",
        data: {}
      })
        .then(res => {
          let data = res.data.data;
          let arr = [];
          data.forEach((e, i) => {
            let obj = {};
            obj.text = e.name;
            obj.value = e;
            arr.push(obj);
          })
          this.select.look_group = arr;

        })
    },
    filters: {
      StamptoString(v) {
        return util.stampToString(v);
      },
      StamptoTime(v) {
        return util.stampToString(v, "/", true);
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
      mulType(v) {
        if (v instanceof Array) {
          return v.join(",");
        }
      }
    }
  };
</script>

<style scoped>
.cube-radio-group[data-horz="true"]::after, .cube-radio-group[data-col="true"]::after {
  border: none ;
}

  .copy-men-wrp {
    display: flex;
    flex-wrap: wrap;
  }

  .rp-f-del {
    position: absolute;
    right: 10px;
    top: 10px;
    bottom: 10px;

  }

  .f-del-ico {
    padding: 16px 18px;
    background: #ef5662;
    height: 100%;
    font-size: 0.8rem;
  }

  .p-desc {
    color: #333;
    flex: 1 0 0;
    white-space: normal;
    word-break: break-all;
    line-height: normal;
    margin-bottom: 15px;
  }

  .rp-f-wrp {
    background-color: rgba(250, 250, 250, 1);
    border: 1px solid rgba(242, 240, 240, 1);
    display: flex;
    align-items: stretch;
    padding: 10px;
    width: 100%;
    box-sizing: border-box;
    position: relative;
  }

  .rp-f-icon {
    width: 3.1rem;
    height: 3.1rem;
    background-color: rgba(84, 185, 110, 1);

    line-height: 3.1rem;
    text-align: center;
    font-size: 28px;
    color: #fff;
  }

  .report .f-text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 60%;
  }

  .copy-add {
    width: 50px;
    height: 50px;
    background-color: #fff;
    display: inline-block;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    position: relative;
  }

  .appro-wrp {
    width: 60px;
    margin-right: 15px;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    position: relative;
    margin-bottom: 15px;
  }

  .appro-img {
    width: 50px;
    height: 50px;
    background-color: #bbb;
    margin-bottom: 10px;
    font-size: 30px;
    text-align: center;
    line-height: 50px;
    color: #fff;
  }

  .appro-name {
    font-size: 0.7rem;
    color: #888;
    text-align: center;
    word-break: break-all;
    white-space: normal;
    line-height: normal;
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

  .at-x {
    font-size: 20px;
    position: absolute;
    padding: 8px;
    left: 34px;
    top: -16px;
    color: #ef5662;
  }

  .at-x-wrp {
    border-radius: 9999px;
    background-color: #fff;
  }

  /*  */
  .form-item-wrp {
    margin-top: 20px;
    background-color: #fff;
    width: 100%;
    box-sizing: border-box;
  }

  .form-title {
    font-weight: 500;
    font-size: 0.875rem;
  }

  .required {
    color: rgb(255, 0, 76);
    font-weight: bold;
  }

  .form-inline {
    line-height: 2.8rem;
    display: flex;
    padding: 0 15px;
    margin-bottom: 20px;
    background-color: #fff;
    align-items: center;
  }

  .inline-input {
    outline: none;
    line-height: 2.2rem;
    font-size: 0.875rem;
    color: #333;
    text-align: right;
    width: 12rem;
  }

  .inline-input::-webkit-input-placeholder {
    color: #bbb;
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
    border-top: 1px solid #f3f3f3;
    border-bottom: 1px solid #f3f3f3;
  }

  .add-details {
    color: rgba(85, 133, 240, 1);
    padding: 15px;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .r-el-detail {
    background-color: #f4f4f4;
    padding: 0 15px;
    line-height: 2.6rem;
    color: #ef5662;
    text-align: right;
  }

  .form-sub {
    width: 90%;
    height: 2.4rem;
    font-size: 1rem;
    margin: 20px auto;
    display: block;
  }

  .attach input[type="file"] {
    height: 0;
    width: 0;
    opacity: 0;
  }

  .attach {
    width: 50px;
    height: 50px;
    background-color: #fff;
    display: inline-block;
    border: 1px solid #e5e5e5;
    border-radius: 2px;
    position: relative;
  }


  .picker__checked {
    width: 66%;
    overflow: hidden;
    display: flex;
    justify-content: flex-end;
  }

  .picker__checked > span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .draft-box {
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    font-size: 1.2rem;
    text-align: center;
    border-radius: 50%;
    color: #fff;
    background-color: #3081fb;
    box-shadow: 0 2px 7px rgba(48, 129, 251, .8);
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9;
    cursor: pointer;
  }

  .filename {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .filename__edit__wrp {
    display: flex;
    flex: 1;
    margin-top: -1px;
  }

  .filename__edit {
    display: inline-flex;
    flex: 1;
    padding: 10px;
    color: #666;
    border-radius: 2px;
    box-sizing: border-box;
    border: 1px solid #f2f0f0;
    outline: none;
  }

  .filename__edit:focus {
    border-color: rgb(170, 194, 248);

  }

  .filename__edit__wrp > i {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 0.8rem;
    font-size: 1rem;
    color: #ffffff;
    cursor: pointer;
    background-color: #5585f0;
  }

  .look-group__wrap {
    margin: 0 1rem 1rem 0;
  }

  .look-group__item {
    border: 1px solid #ccc;
    padding: 0.5rem 1.3rem;
    color: #888888;

    position: relative;
  }

  .look-group__del {
    position: absolute;
    padding: 0.5rem;
    left: 100%;
    top: 0%;
    transform: translate(-50%, -50%);
  }

  .file-add-wrp {
    padding: 0 15px;
    margin-top: 15px;
  }

  .add-file-wrp {
    display: block;
    padding: 15px;
    color: rgb(22, 208, 171);
  }

</style>

<style>
  .mul-bg {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 10;
  }

  .mul-wrp {
    background-color: #fff;
    border-radius: 2px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 17rem;
    text-align: center;
    font-size: 0.875rem;
  }

  .mul-title {
    padding: 15px;
    color: #333;
    line-height: 1;
  }

  .mul-btns {
    display: flex;
    border-top: 1px solid #ebebeb;
  }

  .mul-g {
    height: 20rem;
  }

  .mul-btn {
    flex: 1;
    padding: 16px 10px;
    color: #999;
  }

  .mul-btn:not(:last-child) {
    border-right: 1px solid #ebebeb;
  }

  .mul-btn.highlight {
    color: rgba(85, 133, 240, 1);
  }


</style>
