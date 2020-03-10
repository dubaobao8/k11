<template>
  <div>
    <!-- 文件类型 -->
    <section class="form-inline item-bor" @click="showPick('file_type')">
      <div class="form-title">
        文件类型
        <span class="required">*</span>
      </div>
      <div class="inline-pick">
        {{!form.file_type?'请选择文件类型':form.file_type}}
        <i class="ml5 fa fa-chevron-right"></i>
      </div>
    </section>
    <!-- 文件名称 -->
    <section class="form-item-wrp item-bor">
      <div class="form-title mb15">
        文件名称
        <span class="required">*</span>
      </div>
      <cube-textarea
          v-model="form.title"
          :autoExpand="false"
          placeholder="请输入文件名称"
          :maxlength="500"
      ></cube-textarea>
    </section>
    <!-- 文件用途 -->
    <section class="form-item-wrp item-bor">
      <div class="form-title mb15">
        文件用途
      </div>
      <cube-textarea
          v-model="form.file_use"
          :autoExpand="false"
          placeholder="请输入文件用途"
          :maxlength="500"
      ></cube-textarea>
    </section>
    <!-- 写件人 -->
    <section class="form-inline item-bor" @click="showCopy">
      <div class="form-title">
        写件人
        <!--<span class="required">*</span>-->
      </div>
      <div class="inline-pick">
        {{!form.file_user?'请选择写件人，不填则为自己':form.file_user.username}}
        <i class="ml5 fa fa-chevron-right"></i>
      </div>
    </section>
    <!-- 提交 -->
    <cube-button
        class="n-form-sub"
        type="submit"
        :primary="true"
        :inline="true"
        @click="submit"
    >提交
    </cube-button>
  </div>
</template>

<script>
  // import util from "../../util/util.js";
  import axios from "axios/index";

  export default {
    name: "sde",
    data() {
      return {
        //表单数据
        form: {
          file_type: "",
          file_use: "",
          title: "",
          file_user:"",
          user_id: ""
        },
        // 选择器选项
        select: {
          file_type: [],
          file_user: []
        }
      }
    },
    methods: {
      // 一般选择器
      showPick(name) {
        var sn = name + "Picker";
        var vm = this;
        if (!this[sn]) {
          this[sn] = this.$createPicker({
            title: "请选择",
            data: [this.select[name]],
            onSelect(value, index, text) {
              var newFrom = Object.assign({}, vm.form);
              newFrom[name] = text[0];
              vm.form = newFrom;
            }
          });
        }
        this[sn].show();
      },
      // 选择抄送人
      showCopy() {
        var vm = this;
        if (!this.copySelectPicker) {
          this.copySelectPicker = this.$createCascadePicker({
            title: "请选择写件人",
            data: this.select.file_user,
            onSelect: (value, index, text) => {
              this.form.file_user = value[1];
            }
          });
        }
        this.copySelectPicker.show();
      },
    //  提交
      submit(){
        var subToash = this.$createToast({
          time: 0,
          txt: "正在发布",
          mask: true
        });
        subToash.show();

        var form = Object.assign({},this.form);

        if(!form.file_type||!form.title){
          this.$createToast({
            txt:"请填写所有必填项！",
            time:1000,
            type:"error",
          }).show();
          return false;
        }
        if(!form.file_user){
          form.file_user = localStorage.getItem("user_id");
        }else{
          form.file_user = form.file_user.id;
        }

        form.user_id = localStorage.getItem("user_id");
        axios({
          baseURL: this.$store.state.domain,
          url: "/api/TakeNumber/Apply",
          method: "POST",
          data: form
        })
          .then(res=>{
            subToash.hide();
            this.$root.$createToast({
              txt:"发布成功！",
              time:1000,
              type:"correct"
            }).show();
            this.$router.go(-1);

          })
          .catch(err=>{
            subToash.hide();
            this.$createToast({
              txt:"发布失败！",
              time:1000,
              type:"error"
            }).show();
          })

      }
    },
    mounted() {
      //获取文件类型
      axios({
        baseURL: this.$store.state.domain,
        url: "/api/TakeNumber/CallBack",
        method: "POST",
        data: {}
      })
        .then(res => {
          console.log(res)
          var data = res.data.data;
          var file_type = [];
          data.forEach(e => {
            let {content: value, content: text} = e;
            let obj = {value, text};
            file_type.push(obj);
          });
          this.select.file_type = file_type;
        });
      //  获取抄送人
      axios({
        baseURL: this.$store.state.domain,
        url: "/api/report/lookuser",
        method: "POST",
        data: {}
      })
        .then(res => {
          console.log(res);
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
          this.select.file_user = list;
        })


    }

  }
</script>

<style scoped>

</style>