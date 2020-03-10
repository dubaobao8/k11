<!-- 抄送群组块组件 1.传入存放已选择的抄送人群组数组-->
<template>
  <div class="form-item form-block">
    <p class="input-title">
      {{title}}
      <i class="red-dot" v-if="required"></i>
    </p>

    <section class="ccp-groups">
      <div class="cpp-group-item" v-for="(item,index) in ccp_group">
        {{item[text]}}
        <v-del-btn @click="onDelGroup(index)" class="del-btn" />
      </div>
    </section>

    <action-line @click="onAddGroup">添加抄送人群组</action-line>
  </div>
</template>

<script>
  import ActionLine from "@/components/form/action-line";
  import VDelBtn from "@/components/form/v-del-btn";
  export default {
    name: "v-ccp-group-container",
    components: {VDelBtn, ActionLine},
    props: {
      text:{
        type:String,
        default:"text"
      },
      values:{
        type:String,
        default:"value"
      },
      title: {
        type: String,
        default: "抄送人群组"
      },
      required: {
        type: Boolean,
        default: false
      },
      // 已选择的抄送人群组
      ccp_group: Array,
      // 抄送人群组选项
      ccp_group_seletion: {
        type: Array,
        default() {
          return [{
            text: "群组1",
            value: "group1"
          }, {
            text: "群组2",
            value: "group2"
          }]
        }
      }
    },
    methods: {
      onAddGroup() {
        let _this = this;
        if (!this.ccpGroupPicker) {
          this.ccpGroupPicker = this.$createPicker({
            title: "请选择抄送人群组",
            alias:{
              text:this.text,
              value:this.values
            },
            data: [this.ccp_group_seletion],
            onSelect: (value, index, text) => {
              // 验证重复
              if(this.ccp_group.some((item,index,arr)=>{
                return item[this.values] === value[0]
              })){
                this.$createToast({txt:"不能重复选择",type:"error"}).show();
                return false
              }
              var data={};
              data[this.text]=text[0];
              data[this.values]=value[0];
              this.ccp_group.push(data);
            }
          })
        }
        this.ccpGroupPicker.show();
      },
      onDelGroup(index){
        this.ccp_group.splice(index,1);
      }
    }
  }
</script>

<style scoped src="./form.css"></style>

<style>
  .ccp-groups{
    display: flex;
    flex-wrap: wrap;
  }
  .cpp-group-item{
    margin: 20px 1rem 0 0;
    font-size: 0.875rem;
    border: 1px solid #cdcdcd;
    border-radius: 4px;
    padding: 0.5rem 1.3rem;
    color: #888888;
    position: relative;
  }
  .del-btn{
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
  }
</style>
