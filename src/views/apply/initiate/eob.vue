<template>
  <div class="pt20">
    <!--<v-picker :options="options.personList"-->
    <!--          @select:allData="onSelectSendmen"-->
    <!--          class="mb20"-->
    <!--          placeholder="请选择姓名"-->
    <!--          ref="send_user"-->
    <!--          required-->
    <!--          title="报告人"-->
    <!--          type="cascade"/>-->
    <!--<v-input class="mb20" placeholder="自动填充" readonly title="报告人所属部门" v-model="form.send_user_dep"/>-->
    <!--<v-picker :options="options.personList"-->
    <!--          @select:allData="onSelectAcceptmen"-->
    <!--          class="mb20"-->
    <!--          placeholder="请输入姓名"-->
    <!--          ref="accept_user"-->
    <!--          required-->
    <!--          title="接收人"-->
    <!--          type="cascade"/>-->
    <!--<v-input class="mb20" placeholder="自动填充" readonly title="接收人所属部门" v-model="form.accept_user_dep"/>-->
    <!--<v-picker @select:allData="onSelectDate"-->
    <!--          class="mb20"-->
    <!--          irrevocable-->
    <!--          placeholder="选择后不可修改"-->
    <!--          required-->
    <!--          title="日期"-->
    <!--          type="datetime"/>-->
    <!--<v-picker class="mb20" irrevocable placeholder="选择后不可修改" required title="时间" auto-time type="time" v-model="form.time"/>-->

    <v-input class="mb20" required title="事件类型" v-model="form.type"/>
    <v-input class="mb20" irrevocable placeholder="填写后不可修改" required title="发生地" v-model="form.place"/>
    <!--<v-input class="mb20"-->
    <!--         placeholder="请填写详细描述"-->
    <!--         required-->
    <!--         textarea-height="210px"-->
    <!--         title="详细描述"-->
    <!--         type="textarea"-->
    <!--         v-model="form.content"/>-->

    <section class="editor">
      <div class="editor-tool" ref="editorTool"></div>
      <div class="editor-content" ref="editorContent"></div>
    </section>


    <v-file-container :files="form.files"
                      :required-file-remark="true"
                      :required-file-title="false"
                      class="mb20"
                      multiple
                      required
                      title="原始档案"/>
    <a @click="onSubmit" class="form-submit-block" v-if="!modify">提交</a>
    <a @click="onResubmit" class="form-submit-block" v-else>重新提交</a>
  </div>
</template>

<script>
  import VInput from "@/components/form/v-input";
  import VFileContainer from "@/components/form/v-file-container";
  import request from "@/api";
  import VPicker from "@/components/form/v-picker";
  import {getUserList} from "@/util/business";
  import {diffWords} from "diff";

  const Editor = require('wangeditor');

  export default {
    name: "eob",
    components: {VPicker, VFileContainer, VInput},
    data() {
      return {
        form: {
          // send_user: "",
          // send_user_dep: "",
          // accept_user: "",
          // accept_user_dep: "",
          // date: "",
          // time: "",
          type: "",
          place: "",
          content: "",
          files: [],
          id: null,
          work_num: null
        },
        options: {
          personList: []
        },
        editor: null,
        modify: false,
      }
    },
    methods: {
      // 选择发件人
      onSelectSendmen(data) {
        let user = data.value[1];
        this.$refs.send_user.setText(user.username);
        this.form.send_user_dep = user.department;
        this.form.send_user = user.user_id;
      },
      // 选择接收人
      onSelectAcceptmen(data) {
        let user = data.value[1];
        this.$refs.accept_user.setText(user.username);
        this.form.accept_user_dep = user.department;
        this.form.accept_user = user.user_id;
      },
      onSelectDate(data) {
        let value = data.value;
        this.form.date = value.join('/');
      },
      validate() {
        let form = this.form;
        let errors = [];
        // if (!form.send_user) {
        //   errors.push('请选择【报告人】');
        // }
        // if (!form.accept_user) {
        //   errors.push('请选择【接收人】');
        // }
        // if (!form.date) {
        //   errors.push('请选择【日期】');
        // }
        // if (!form.time) {
        //   errors.push('请选择【时间】');
        // }
        if (!form.type) {
          errors.push('请输入【事件类型】');
        }
        if (!form.place) {
          errors.push('请输入【发生地】');
        }
        if (!form.content) {
          errors.push('请输入【详细描述】');
        }
        if (!form.files || !form.files.length) {
          errors.push('请添加【原始档案】');
        }

        if (form.files.some(item => item.need_reupload)) {
          errors.push('请将【上传失败】的文件手动删除后再提交！')
        }

        if (form.files.some(item => !item.file_remark)) {
          errors.push('请填写【附件备注】');
        }

        if (errors.length) {
          this.$notify(errors[0]);
          return false;
        } else {
          return true;
        }
      },
      beforeSubmit() {
        let validate = this.validate();
        if (!validate) {
          return false;
        }

        let form = {...this.form};

        form = {
          "send_user": form.send_user,
          "accept_user": form.accept_user,
          "date": form.date,
          "time": form.time,
          "type": form.type,
          "place": form.place,
          "content": form.content,
          "files": form.files.map(item => {
            return {
              "image": item.image,
              "title": item.file_title,
              "small_image": item.small_image,
              "remark": item.file_remark
            }
          })
        };
        return form;
      },
      onSubmit() {
        let form = this.beforeSubmit();
        if (!form) {
          return false;
        }

        let loading = this.$toast.loading('正在提交...');

        request.post('/api/EOB/SendReport', form).then(res => {
          loading.clear();
          this.$root.$toast.success('发布成功！');
          this.$router.replace({
            path: "/apply"
          })
        }).catch(e => {
          loading.clear();
          this.$toast.fail('发布失败！');
        })
      },
      // 重新提交
      onResubmit() {
        let form = this.beforeSubmit();
        if (!form) {
          return false;
        }
        form.eob_id = this.form.id;
        form.work_num = this.form.work_num;

        let loading = this.$toast.loading('正在提交修改...');

        request.post('/api/EOB/UpdateEOB', form).then(res => {
          loading.clear();
          this.$root.$toast.success('修改成功！');
          this.$router.replace({
            path: "/eob_detail/" + this.form.id
          })
        }).catch(e => {
          loading.clear();
          this.$toast.fail('修改失败！');
        })
      },
      setEditor() {
        const _this = this;
        const editorTool = this.$refs.editorTool;
        const editorContent = this.$refs.editorContent;
        this.editor = new Editor(editorTool, editorContent);
        this.editor.customConfig.onchange = function (html) {
          _this.form.content = html;
        };
        this.editor.customConfig.menus = ['bold','italic','underline','strikeThrough','foreColor','backColor','link','list','justify']
        this.editor.create();
      },
      renderOldData() {
        const query = {...this.$route.query};

        query.modify = (query.modify === 'true' || query.modify === true);

        if (!query.modify) {
          return false;
        }
        this.modify = true;
        this.form.id = query.id;
        request.post('/api/EOB/EOBDetail', {port_id: this.form.id}).then(res => {
          const data = res.data.data;
          this.form.type = data.type;
          this.form.place = data.place;
          this.form.files = data.files.map(item => {
            return {
              image: item.image,
              file_remark: item.remark,
              small_image: item.small_image,
              file_title: item.title,
              file_img: item.image,
              file_name: item.title
            }
          });
          this.editor.txt.html(data.content);
          this.editor.change();
          this.form.work_num = data.work_num;
        })
      }
    },
    async mounted() {
      this.options.personList = await getUserList();
      this.setEditor();
      this.renderOldData();


      // let str1 = "尊敬的客户和各位现场观众，广州周大福金融中心2019下半年消防演习即将开始，大厦设备安全，请大家不要惊慌。下面有请本次演习的战略总指挥Joe讲话。";
      // let str2 = "尊敬的客户和各位现场观众，广州周大福金融中心2019上半年消防演习即将结束，大厦很安全，请大家不要恐慌。下面有请本次演习的战略指挥Joe讲话。";
      //
      // console.log(diffWords(str1,str2))
    }
  }
</script>

<style scoped>
  .editor {
    background-color: #fff;
    margin-bottom: 20px;
    font-size: 0.875rem;
  }

  .editor-tool {
    padding: 5px 0;
    white-space: normal;
    font-size: 14px;
    flex-wrap: wrap;
    border-bottom: 1px solid #eee;
  }

  .editor-content {
    height: 300px;
    background-color: #fff;

  }

  .editor >>> .w-e-text {
    overflow-y: auto;
  }

  .editor >>> .w-e-droplist {
    margin-top: 24px;
  }
  .editor >>> .w-e-text-container {
    z-index: 100 !important;
  }


</style>
