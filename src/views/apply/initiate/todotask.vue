<template>
  <div>
    <v-input class="mt20 mb20" maxlength="30" required title="任务名称" v-model="form_model.title"/>
    <v-picker :displayText="form_model.recipient.username"
              :options="options.userList"
              @select="onSelectedRecipient"
              class="mt20 mb20"
              ref="accepter"
              required
              title="收件人"
              type="cascade"
              v-model="form_model.recipient"/>
    <!--<v-input class="mt20 mb20" placeholder="自动填充" readonly title="收件人所属部门" v-model="form_model.rec_dep"/>-->
    <!--<v-input class="mt20 mb20" placeholder="自动填充" readonly title="联系方式" v-model="form_model.rec_tel"/>-->
    <v-picker :displayText="form_model.sender.username"
              :options="options.sendList"
              @select="onSelectedSender"
              class="mt20 mb20"
              ref="sender"
              title="发件人"
              type="cascade"
              v-model="form_model.sender"/>
    <!--<v-input class="mt20 mb20" placeholder="自动填充" readonly title="发件人所属部门" v-model="form_model.add_dep"/>-->
    <!--<v-input class="mt20 mb20" placeholder="自动填充" readonly title="发件人联系方式" v-model="form_model.add_tel"/>-->
    <v-picker :p-display-text="preset.start_time"
              :showTime="false"
              class="mt20 mb20"
              required
              title="工作指派日期"
              type="datetime"
              v-model="form_model.start_time"/>
    <v-picker :showTime="false"
              class="mt20 mb20"
              required
              title="整体完成日期"
              type="datetime"
              v-model="form_model.finish_time"/>
    <p class="form-detail-title-huge ml15 mb10 mr15">明细</p>
    <ul class="form-group">
      <transition-group name="follow">
        <li :key="item.uid" class="detail-item" v-for="(item,index) in form_model.details">
          <p class="pd15 dpfx fxjbw">
            <span class="form-detail-title-bold">明细{{index + 1}}</span>
            <!-- 删除明细按钮 -->
            <span @click="delDetail(index)" class="fs08" style="color: #ff4e69;" v-if="index !== 0">
            <i class="fa fa-minus-square mr5"></i>删除明细{{index + 1}}
            </span>
          </p>
          <v-input required title="任务描述" type="textarea" v-model="item.content"/>
          <v-picker :date-end="form_model.finish_time&&new Date(form_model.finish_time * 1000)"
                    :show-time="false"
                    required
                    title="该任务完成时间"
                    type="datetime"
                    v-model="item.done_time"/>
          <v-file-container :files="item.file" auto_del auto_upload style="border: none" title="任务附件（选填）"/>
          <div class="divider-dash-1"></div>
        </li>
      </transition-group>
      <action-line @click="addDetail" class="plr15">添加明细</action-line>
    </ul>

    <v-file-container :files="form_model.file_url" auto_del auto_upload class="mt20 mb20"/>

    <a @click="onSubmit" class="form-submit-block">提交</a>

  </div>
</template>

<script>
  import VInput from "@/components/form/v-input";
  import VPicker from "@/components/form/v-picker";
  import VFileContainer from "@/components/form/v-file-container";
  import ActionLine from "@/components/form/action-line";
  import {getUserList} from "@/util/business";
  import {GetUserPhoneAndDep, SendToDoTask} from "@/api/initiate/todotask";
  import {stampToString} from "@/util/util";
  import request from "@/api";

  const detailModel = function () {
    this.content = "";
    this.done_time = "";
    this.file = [];
    this.uid = Math.random() * Date.now();
  };

  export default {
    name: "todotask",
    components: {ActionLine, VFileContainer, VPicker, VInput},
    data() {
      return {
        form_model: {
          sender: {},
          title: "",
          recipient: {},
          start_time: "",
          finish_time: "",
          file_url: [],
          details: [new detailModel()],

          // 以下属性仅供显示
          rec_dep: "",
          rec_tel: "",
          add_dep: "",
          add_tel: ""
        },
        options: {
          userList: [],
          sendList: []
        },
        preset: {
          start_time: ""
        }
      }
    },
    methods: {
      // 获取收件人
      async getAcceptList() {
        let user_id = this.form_model.sender.user_id || localStorage.getItem('user_id');
        var res = await request.post('/api/Task/LookUser', {user_id});
        var data = res.data.data;
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
                    username: emp.username,
                    department: emp.department
                  }
                }
              }
            )
          }
        });
        return resdata
      },
      // 页面初始化：获取页面信息
      getPageData() {
        this.form_model.sender = {
          user_id: localStorage.getItem('user_id'),
          username: localStorage.getItem('user_name')
        };


        // 发起人列表
        getUserList().then(res => {
          this.options.sendList = res;
        });

        // 获取接收人列表
        this.getAcceptList().then(res => {
          this.options.userList = res;
        });

        GetUserPhoneAndDep(this.form_model.sender.user_id).then(res => {
          this.form_model.add_tel = res.data.data.phone;
          this.form_model.add_dep = res.data.data.department;
        });

        this.form_model.start_time = Math.floor(Date.now() / 1000);
        this.preset.start_time = stampToString(Date.now(), '/', false);


      },
      addDetail() {
        this.form_model.details.push(new detailModel());
      },
      delDetail(index) {
        this.ex.confirm('提示', '确认删除该明细吗?').then(res => {
          this.form_model.details.splice(index, 1);
        });
      },
      onSelectedRecipient(value) {
        this.form_model.recipient = value[1];
        this.form_model.rec_dep = value[1].department;
        GetUserPhoneAndDep(value[1].user_id).then(res => {
          this.form_model.rec_tel = res.data.data.phone;
        })
      },
      onSelectedSender(value) {
        this.form_model.sender = value[1];
        this.form_model.add_dep = value[1].department;
        GetUserPhoneAndDep(value[1].user_id).then(res => {
          this.form_model.add_tel = res.data.data.phone;
        });


        this.form_model.recipient = {};
        this.form_model.rec_dep = "";
        this.form_model.rec_tel = "";
        this.$refs.accepter.setText("");
        // 获取接收人列表
        this.getAcceptList().then(res => {
          this.options.userList = res;
        });


      },
      // 验证表单
      validateForm() {
        let errors = [];
        let form = this.form_model;

        if (!form.title) {
          errors.push('请填写【任务名称】');
        }

        if (!form.recipient.user_id) {
          errors.push('请选择【收件人】');
        }

        if (!form.start_time) {
          errors.push('请选择【工作指派日期】');
        }

        if (!form.start_time) {
          errors.push('请选择【整体完成日期】');
        }

        if (!form.details.length) {
          errors.push('请添加【明细】');
        }

        form.details.some((item, index) => {
          let isCompleted = true;

          if (!item.content) {
            errors.push('请填写明细' + (index + 1) + '【任务描述】');
            isCompleted = false;
          }

          if (!item.done_time) {
            errors.push('请填写明细' + (index + 1) + '【该任务完成时间】');
            isCompleted = false;
          }

          let isFileCompleted = item.file.some(file => {
            if (!file.file_title) {
              errors.push('请填写明细' + (index + 1) + '【附件标题】');
              return true;
            } else {
              return false;
            }
          });

          if (isFileCompleted) {
            isCompleted = false;
          }

          if (item.file.some(item=>item.need_reupload)){
            errors.push('请将【上传失败】的文件手动删除后再提交！')
          }

          return !isCompleted
        });

        // if (!form.file_url.length) {
        //   errors.push('请上传【附件】');
        // }
        //
        // form.file_url.some(item => {
        //   if (!item.file_title) {
        //     errors.push('请将【附件标题】填写完整');
        //     return true
        //   } else {
        //     return false
        //   }
        // });

        if (form.file_url.some(item=>item.need_reupload)){
          errors.push('请将【上传失败】的文件手动删除后再提交！')
        }



        if (errors.length) {
          this.$notify(errors[0]);
          return false
        } else {
          return true
        }
      },
      processData() {
        let form = this.form_model;
        let data = {};
        data.user_id = form.sender.user_id;
        data.title = form.title;
        data.accept_user = form.recipient.user_id;
        data.start_time = form.start_time;
        data.finish_time = form.finish_time;

        data.details = form.details.map(item => {
          return {
            content: item.content,
            done_time: item.done_time,
            file: JSON.stringify(item.file.map(file => {
              return {
                "file_url": file.image,
                "title": file.file_title,
                "small_image": file.small_image
              }
            }))
          }
        });

        data.file_url = form.file_url.map(item => {
          return {
            "file_url": item.image,
            "title": item.file_title,
            "small_image": item.small_image
          }
        });

        return data;

      },
      // 发布ToDoTask
      onSubmit() {
        if (!this.validateForm()) {
          return false;
        }
        let data = this.processData();

        let loading = this.$toast.loading({mask: true, message: '正在发布\nTo Do Task...'});

        SendToDoTask(data).then(res => {
          loading.clear();
          this.$root.$toast.success('发布成功');
          this.$router.replace({
            path: "/mine",
            query: {
              tab: 'underway'
            }
          })
        }).catch(err => {
          loading.clear();
          this.$root.$toast.fail('发布失败！');
        });
      }
    },
    mounted() {
      this.getPageData();
    }
  }
</script>

<style scoped>
  .detail-item {
    width: 100%;
    display: block;
    background-color: #fff;
  }
</style>
