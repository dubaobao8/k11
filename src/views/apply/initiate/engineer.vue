<template>
  <div class="engineer">
    <v-picker :cascade-async="true"
              :options="options.place"
              :p-display-text="preprocessData.place"
              :readonly="isLockedLocation || !!placeCode"
              @change="onChangePlace"
              @click="onClickLock(!!placeCode)"
              @select:allData="onSelectPlaceAllData($event)"
              class="mb20"
              id="fault-place"
              ref="placePicker"
              required
              title="故障位置"
              type="cascade"
    />

    <v-input
      :readonly="isLockedLocation  || !!placeCode"
      @click="onClickLock(!!placeCode)"
      @input="onInputDetailPlace"
      class="mb20"
      ref="detailPlacePicker"
      required
      textarea-height="3.6rem"
      title="详细故障位置"
      type="textarea"
      v-model="form_model.detail_place"/>

    <v-input class="mb20" title="位置编号" v-model="placeCode"/>

    <v-picker :options="options.position"
              class="mb20"
              required
              text="content"
              title="位置类型"
              v-model="form_model.position"
              values="content"/>

    <v-datalist :maxlength="500"
                :options="options.engineer_report"
                @select:option="onSelectEngineerReport"
                @send:value="searchReport"
                class="mb20"
                empty-text="没有相关的工程单"
                options_title="已存在工程单（为避免重复，请查看相似项）"
                options_title_color="#FF4254"
                required
                text="title"
                title="故障描述"
                type="textarea"
                v-model="form_model.content"/>
    <v-picker :options="options.type"
              :p-display-text="preprocessData.type"
              class="mb20"
              required
              text="type_name"
              title="工作类型"
              type="radio"
              v-model="form_model.type"
              values="type_name"/>
    <v-picker :p-display-text="preprocessData.finish_time"
              :showTime="false"
              class="mb20"
              title="要求完成日期"
              type="datetime"
              v-model="form_model.finish_time"/>
    <v-input :maxlength="300" class="mb20" title="维修备注" type="textarea" v-model="form_model.remark"/>
    <!-- 附件 -->
    <v-file-container :auto_del="true"
                      :auto_upload="true"
                      :files="form_model.file_url"
                      :required-file-title="false"
                      class="mb20"
                      multiple
                      ref="file-container"
                      required
                      title="附件（现场照片）"/>

    <!-- 抄送人 -->
    <v-ccp-container :ccp="form_model.look_user" :ccp_selection="options.ccp" class="mt20"/>

    <!-- 抄送群组 -->
    <v-ccp-group-container :ccp_group="form_model.look_group"
                           :ccp_group_seletion="options.ccp_group"
                           class="mt20"
                           text="name"
                           values="group_id"/>

    <div @click="onSubmit" class="form-submit-block">提交工程单</div>
    <!--<div @click="onSaveDraft" class="form-submit-block">保存至草稿箱</div>-->

  </div>
</template>
<script>
  import vInput from "@/components/form/v-input";
  import vPicker from "@/components/form/v-picker";
  import vFileContainer from "@/components/form/v-file-container";
  import actionLine from "@/components/form/action-line";
  import vApproverContainer from "@/components/form/v-approver-container";
  import VDatalist from "@/components/form/v-datalist";
  import {
    ChooseExtraPlace, GetChooseArea,
    GetEngineerPlace, GetEngineerPlaceByCode,
    GetEngineerWorkType, GetFloorSite,
    SearchEngineerReport,
    SendEngineerReport
  } from "@/api/initiate/engineer";
  import {GetEngineerDraftContent, SaveEngineerToDraft} from "@/api/draft/engineer_draft";
  import {stampToString} from "../../../util/util";
  import {mapMutations} from "vuex";
  import request from "@/api";
  import VCcpContainer from "@/components/form/v-ccp-container";
  import VCcpGroupContainer from "@/components/form/v-ccp-group-container";
  import {GroupInfo} from "@/api/initiate/purchase";
  import {getUserList} from "@/util/business";

  var inputDelayPlace;
  var inputDetailPlaceDalay;
  export default {
    name: "engineer",
    components: {
      VCcpGroupContainer,
      VCcpContainer,
      VDatalist,
      vInput,
      vPicker,
      vFileContainer,
      actionLine,
      vApproverContainer
    },

    data() {
      return {
        placeCode: "",
        code_num: "",
        // 选项
        options: {
          type: [],
          place: [],
          engineer_report: [],
          detail_place: [],
          position: [],
          ccp: [],
          ccp_group: [],
        },
        // 表单的原始数据
        form_model: {
          // 故障位置
          place: "",
          detail_place: "",
          // 故障描述
          content: "",
          // 工作类型
          type: "",
          // 要求竣工日期
          finish_time: "",
          // 维修备注
          remark: "",
          // 附件
          file_url: [],
          position: "",
          look_user: [],
          look_group: []
        },

        // 预选数据
        preprocessData: {
          place: "",
          type: "",
          finish_time: "",
          detail_place: ""
        },
        //  是否锁定故障位置
        isLockedLocation: false
      };
    },
    watch: {
      // "form_model.place": {
      //   handler(value, old) {
      //     console.log(old);
      //     // if (value && !old) {
      //       this.form_model.detail_place = "";
      //       this.preprocessData.detail_place = "";
      //       this.placeCode = "";
      //     // }
      //     if (value) {
      //       console.log('获取详细故障位置');
      //       ChooseExtraPlace(value.join(',')).then(res => {
      //         this.options.detail_place = res.data.data.map(item => {
      //           return {
      //             text: item.detail_place,
      //             value: {
      //               place: item.detail_place,
      //               number: item.number
      //             },
      //           }
      //         })
      //       })
      //     }
      //
      //   },
      //   immediate: true,
      //   deep: true
      // },
      placeCode(value) {
        clearTimeout(inputDelayPlace);
        inputDelayPlace = setTimeout(() => {
          if (value.toString().length === 4) {
            this.getPlacebyCode();
          }
        }, 300);

      }
    },

    methods: {
      ...mapMutations(['addKeepAlivePage', 'delKeepAlivePage']),
      onClickLock(hasCode) {
        if (hasCode) {
          this.$toast('请先清空【位置编号】再继续编辑')
        }
      },
      // 搜索已完成的工程单
      searchReport(content) {
        if (content) {
          let obj = {
            content:content,
            place:this.form_model.place?this.form_model.place.join(","):""
          }
          SearchEngineerReport(obj).then(res => {
            this.options.engineer_report = res.data.data;
          })
        } else {
          this.options.engineer_report = []
        }
      },
      // 当点击相关工程单时
      onSelectEngineerReport($event) {
        this.addKeepAlivePage(this.$options.name);
        setTimeout(() => {
          this.$router.push('eng_detail/' + $event.id);
        }, 100)
      },
      // 获取详细位置
      // onSelectPlace(e) {
      //
      // },
      onSelectPlaceAllData(data) {
        let oldValue = this.form_model.place;
        let newValue = data.value;
        if (oldValue.toString() != newValue.toString()) {
          // this.form_model.detail_place = "";
          // this.preprocessData.detail_place = "";
          this.placeCode = "";
          this.form_model.place = newValue;
        }
        // ChooseExtraPlace(data.value.join(',')).then(res => {
        //   var options = res.data.data.map(item => {
        //     return {
        //       text: item.detail_place,
        //       value: {
        //         place: item.detail_place,
        //         number: item.number,
        //         code_num: item.code_num
        //       },
        //     }
        //   });
        //   this.$set(this.options, 'detail_place', options);
        // })
      },
      // 选择故障位置时，滚轴滚动，获取次级选项
      onChangePlace(data) {
        var _this = this;
        var {index: colIndex, selectedIndex, cascadeIndexes} = data;
        var options = this.options.place;

        if (colIndex === 0) {
          if (options[selectedIndex].children) {
            _this.$refs.placePicker.cascadePicker.setData(options, cascadeIndexes);
            return false;
          }
          var place = options[selectedIndex].value;
          GetFloorSite(place).then(res => {
            var data = res.data.data;
            options[selectedIndex].children = data.floor.map(floor => {
              return {
                text: floor.name,
                value: floor.name,
                // children: data.area.map(area => {
                //   return {
                //     text: area.name,
                //     value: area.name,
                //   }
                // })
              }
            });

            if (_this.$refs.placePicker.cascadePicker) {
              _this.$refs.placePicker.cascadePicker.setData(options, cascadeIndexes);
            }
          })
        } else {
          _this.$refs.placePicker.cascadePicker.setData(options, cascadeIndexes)
        }
      },
      // 根据编号获取位置
      getPlacebyCode() {
        GetEngineerPlaceByCode(this.placeCode).then(res => {
          var data = res.data.data;
          this.$refs.placePicker.clear();
          // this.$refs.detailPlacePicker && this.$refs.detailPlacePicker.clear();
          if (data) {
            this.form_model.place = data.place.split(',');
            this.preprocessData.place = data.place;
            this.form_model.detail_place = this.preprocessData.detail_place = data.detail_place;
            this.code_num = data.code_num;
            // ChooseExtraPlace(this.form_model.place.join(',')).then(res => {
            //   var options = res.data.data.map(item => {
            //     return {
            //       text: item.detail_place,
            //       value: {
            //         place: item.detail_place,
            //         number: item.number,
            //         code_num: item.code_num
            //       },
            //     }
            //   });
            //   this.$set(this.options, 'detail_place', options);
            // })
          } else {
            this.form_model.place = "";
            this.preprocessData.place = "";
            this.form_model.detail_place = this.preprocessData.detail_place = "";
            this.$set(this.options, 'detail_place', []);
            this.code_num = "";
          }
        })
      },
      // 验证表单
      validateFormModel() {
        var error = [];
        var form = this.form_model;
        if (!form.place) {
          error.push('请选择【故障位置】！');
        }
        if (!form.content) {
          error.push('请填写【故障描述】!');
        }
        if (!form.type) {
          error.push('请选择【工作类型】!');
        }
        if (!form.position) {
          error.push('请选择【位置】!');
        }
        // if (!form.finish_time) {
        //   error.push('请选择【要求竣工日期】!');
        // }
        // if (!form.remark) {
        //   error.push('请填写【维修备注】！');
        // }
        if (!form.file_url.length) {
          error.push('请上传【附件】！')
        }

        if (form.file_url.some(item=>item.need_reupload)){
          error.push('请将【上传失败】的文件手动删除后再提交！')
        }
        // if (form.file_url.some((item, index, arr) => {
        //   return !item.file_title
        // })) {
        //   error.push('请把【附件标题】填写完整！')
        // }

        if (error.length) {
          this.$notify(error[0]);
          return false
        } else {
          return true;
        }
      },

      // 处理表单数据
      processForm() {
        var form = this.form_model;

        form.file_url = form.file_url.filter(item => {
          return item.image;
        });

        if (form.place.length<2){
          this.$notify('故障位置不完整！');
          return false;
        }

        return {
          place: form.place.join(','),
          content: form.content,
          type: form.type,
          finish_time: form.finish_time,
          remark: form.remark,
          position: form.position,
          detail_place: form.detail_place,
          code_num: this.code_num,
          file_url: form.file_url.map(item => {
            return {
              "file_url": item.image,
              "title": item.file_title,
              "small_image": item.small_image,
              "id": item.id
            }
          }),
          look_user: form.look_user.map(item => item.user_id).join(','),
          look_group: form.look_group.map(item => item.group_id).join(',')
        }
      },

      // 提交
      onSubmit() {
        var isLegal = this.validateFormModel();
        if (!isLegal) {
          return false
        }

        var data = this.processForm();
        var loading = this.$toast.loading({
          message: "正在提交工程单",
          mask: true
        });

        SendEngineerReport(data).then(res => {
          loading.clear();
          this.$root.$toast.success('已成功提交工程单！');
          this.$router.replace({
            path: '/apply'
          });
        }).catch(err => {
          console.error(err);
          loading.clear();
          this.$root.$toast.fail('提交失败！');
        })
      },

      // 保存至草稿箱
      onSaveDraft() {
        var data = this.processForm();
        var loading = this.$toast.loading({
          message: "正在保存至草稿箱"
        });
        data.id = this.$route.query.draft_id || "";

        SaveEngineerToDraft(data).then(res => {
          loading.clear();
          this.$root.$toast.success('已保存至草稿箱！');
        }).catch(err => {
          console.error(err);
          loading.clear();
          this.$root.$toast.fail('保存失败！');
        })
      },

      // 数据回显
      writeBack(data) {
        this.form_model.place = data.place.split(',');
        this.preprocessData.place = data.place;
        this.preprocessData.detail_place = this.form_model.detail_place = data.detail_place;
        this.placeCode = data.number;


        this.preprocessData.type = this.form_model.type = data.work_type;
        this.preprocessData.finish_time = stampToString(data.finish_time, '/');
        this.form_model.finish_time = data.finish_time;
        this.form_model.content = data.content;
        this.form_model.remark = data.remark;
        this.form_model.file_url = data.pro_file.map(item => {
          return {
            file_desc: "已上传",
            file_img: item.small_image,
            file_name: item.title,
            file_title: item.title,
            image: item.file_url,
            need_reupload: false,
            small_image: item.small_image,
            id: item.id
          }
        })
      },
      //  选择详细位置
      onSelectDetailPlace(data) {
        this.placeCode = data.value[0].number;
        this.code_num = data.value[0].code_num
      },
      // 详细故障位置获取位置编号
      onInputDetailPlace(e) {
        clearTimeout(inputDetailPlaceDalay);
        inputDetailPlaceDalay = setTimeout(() => {
          let data = {
            place: this.form_model.place.join(','),
            detail_place: this.form_model.detail_place
          };
          request.post('/api/project/SearchNum', data).then(res => {
            let data = res.data.data;
            if (data) {
              this.code_num = data.code_num;
              this.placeCode = data.number;
            } else {
              this.code_num = "";
              this.placeCode = "";
            }
          })
        }, 300);

      }
    },

    mounted() {
      var query = this.$route.query;
      /* 获取故障位置选项 */
      GetEngineerPlace().then(res => {
        var data = res.data.data;
        this.options.place = data.position.map(item => {
          return {
            text: item.name,
            value: item.name
          }
        });
        this.onChangePlace({
          index: 0,
          selectedIndex: 0,
          cascadeIndexes: [0, 0, 0]
        });
        // this.options.place.push(data.position);
        // this.options.place.push(data.floor);
        // this.options.place.push(data.area);
      });
      // 获取工作类型
      GetEngineerWorkType().then(res => {
        this.options.type = res.data.data;
      });

      // 判断是否草稿箱进入，需要填充数据
      if (query.mode === 'draft') {
        var draft_id = query.draft_id;
        GetEngineerDraftContent(draft_id).then(res => {
          this.writeBack(res.data.data);
        })
      }

      //  判断是否扫一扫进入，填充故障位置并锁定
      if (query.mode === 'QR' && query.place) {
        this.form_model.place = query.place.split(',');
        this.preprocessData.place = query.place;
        this.form_model.detail_place = this.preprocessData.detail_place = query.detail_place;
        this.placeCode = query.number;
        this.isLockedLocation = true;
      }

      // 自动生成要求竣工时间
      var after7day = Date.now() + 604800000;
      this.form_model.finish_time = Math.floor(after7day / 1000);
      this.preprocessData.finish_time = stampToString(after7day, '/', false);

      // 获取位置选项
      GetChooseArea().then(res => {
        this.options.position = res.data.data;
      });

      getUserList().then(res => {
        this.options.ccp = res;
      });

      //获取抄送人群组
      GroupInfo().then(res => {
        this.options.ccp_group = res.data.data;
      });
    },

    activated() {
      this.delKeepAlivePage(this.$options.name)
    }
  };
</script>
<style scoped>
  .engineer {
    margin: 20px 0;
    background-color: #f2f2f2;
  }

  #fault-place >>> .form-inline-left {
    flex: 0 0 auto;
    width: auto;

  }

  #fault-place >>> .form-inline-right {
    flex: 1 0 auto;
    width: auto;
  }
</style>
