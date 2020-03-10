<!-- 抄送人块组件 1.传入存放已选择的抄送人信息的数组，2.传入抄送人选项 模板如下（二级联动）-->
<template>
  <div class="form-item form-block">
    <p class="input-title">
      {{title}}
      <i class="red-dot" v-if="required"></i>
    </p>

    <div class="contact-list">
      <template v-for="(item,index) in ccp">
        <v-contact-item :avatar="item.avatar"
                        :erasable="true"
                        :key="index"
                        :username="item.username"
                        @del="onDelCcp(index)"
                        class="contact-item"/>
      </template>
      <v-add-btn @click="onSelectCcp" class="contact-item"/>
    </div>

  </div>
</template>

<script>
  import vContactPicker from "@/components/form/v-contact-picker";
  import VContactItem from "@/components/form/v-contact-item"
  import VAddBtn from "@/components/form/v-add-btn";

  export default {
    name: "v-ccp-container",
    components: {VAddBtn, VContactItem},
    props: {
      text: {
        type: String,
        default: "text"
      },
      values: {
        type: String,
        default: "value"
      },
      title: {
        type: String,
        default: "抄送人"
      },
      required: {
        type: Boolean,
        default: false
      },
      //判断抄送人唯一性的属性
      indexKey: {
        type: String,
        default: "username"
      },
      // 用于存放已选择的抄送人信息的数组
      ccp: Array,
      //  抄送人选项，二级联动
      ccp_selection: {
        type: Array,
        // 数据模板
        default() {
          // return [
          //   {
          //     text: "部门1",
          //     value: "部门1的值",
          //     children: [{
          //       text: "部门1员工1",
          //       //员工信息的值使用对象存放
          //       value: {
          //         avatar:
          //           "https://hbimg.huabanimg.com/fc424be850e43f9c0551bbb29cd40e32052522d976abb-D1KWdz",
          //         username: "Ararel"
          //       }
          //     }, {
          //       text: "部门1员工2",
          //       value: {
          //         avatar:
          //           "https://hbimg.huabanimg.com/e5115637d895c9ca266aab360c828f6e187aee6c9eaed-oFT2Mh",
          //         username: "Boer"
          //       }
          //     }]
          //   },
          //   {
          //     text: "部门2",
          //     value: "部门2的值",
          //     children: [{
          //       text: "部门2员工1",
          //       value: {
          //         avatar:
          //           "https://hbimg.huabanimg.com/fc424be850e43f9c0551bbb29cd40e32052522d976abb-D1KWdz",
          //         username: "Crarel"
          //       }
          //     }, {
          //       text: "部门2员工2",
          //       value: {
          //         avatar:
          //           "https://hbimg.huabanimg.com/e5115637d895c9ca266aab360c828f6e187aee6c9eaed-oFT2Mh",
          //         username: "Doer"
          //       }
          //     }]
          //   }
          // ]
        }
      }
    },
    methods: {
      onSelectCcp() {
        var _this = this;
        if (!this.ccpPicker) {
          this.ccpPicker = this.$createCascadePicker({
            title: "请选择抄送人",
            data: this.ccp_selection,
            alias: {
              text: this.text,
              value: this.value,
            },
            onSelect: (value, index, text) => {
              if (!value[1]) {
                return false
              }
              let user_info = value[1];
              // 验证重复
              if (this.ccp.some((item, index, arr) => {
                return item[_this.indexKey] === user_info[_this.indexKey]
              })) {
                _this.$createToast({"txt": "不能重复选择", type: "error"}).show();
                return false
              }
              this.ccp.push(user_info)
            }
          })
        }
        this.ccpPicker.show();
      },
      onDelCcp(index) {
        this.ccp.splice(index, 1);
      }
    }
  }
</script>

<style src="./form.css"></style>
<style scoped>
  .contact-list {
    display: flex;
    flex-wrap: wrap;
  }

  .contact-item {
    margin: 20px 15px 0 0;
  }
</style>
