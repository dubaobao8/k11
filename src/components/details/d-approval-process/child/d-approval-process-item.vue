<template>
  <div class="approver-item">
    <i class="status-icon" :class="[status.icon]" :style="{color:status.color}"></i>
    <img class="approver_avatar" :src="approver_info[approver_avatar]"/>
    <span class="approver_name">
      {{approver_info[approver_name]}} · {{status.text}}
      <span v-if="approver_info.transfer_men"> <b>→</b> {{approver_info.transfer_men}}</span>
    </span>
    <span class="approver_date">{{approver_info[approver_date] | transDate}}</span>
  </div>
</template>

<script>
  const approvel_rule={
    incident: {
      "1": {
        color: "#5585F0",
        icon: "fa fa-circle-o",
        text: "待审批"
      },
      "2": {
        color: "#00d674",
        icon: "fa fa-check-circle",
        text: "已通过"
      },
      "3": {
        color: "#FF004C",
        icon: "fa fa-times-circle",
        text: "已驳回"
      },
      "4": {
        color: "#C79BDD",
        icon: "fa fa-times-circle",
        text: "跟进中"
      },
      "5": {
        color: "#009688",
        icon: "fa fa-refresh",
        text: "转审中"
      }
    },
    engineer: {
      "1": {
        color: "#5585F0",
        icon: "fa fa-check-circle",
        text: "已接受"
      },
      "2": {
        color: "#FF004C",
        icon: "fa fa-times-circle",
        text: "已拒绝"
      },
      "3": {
        color: "#C79BDD",
        icon: "fa fa-dot-circle-o",
        text: "指派"
      },
      "4": {
        color: "#00d674",
        icon: "fa fa-check-circle",
        text: "审批通过"
      },
      "5": {
        color: "#ff4f39",
        icon: "fa fa-refresh",
        text: "重新指派"
      },
    },
    purchase:{
      "0": {
        color: "#5585F0",
        icon: "fa fa-circle-o",
        text: "待审批"
      },
      "1": {
        color: "#00d674",
        icon: "fa fa-check-circle",
        text: "已同意"
      },
      "2": {
        color: "#FF004C",
        icon: "fa fa-times-circle",
        text: "已驳回"
      },
      "3": {
        color: "#009688",
        icon: "fa fa-refresh",
        text: "转审中"
      },

    }
  }

  export default {
    name: "d-approval-process-item",
    props: {
      report_type: {
        type: String,
        default: "engineer"
      },
      approver_name:String,
      approver_avatar:String,
      approver_status:String,
      approver_date:String,
      approver_info: Object
    },
    computed: {
      status() {
        var approvel_rule1=approvel_rule[this.report_type];
        return {
          color: approvel_rule1[this.approver_info[this.approver_status]+""].color,
          icon: approvel_rule1[this.approver_info[this.approver_status]+""].icon,
          text: approvel_rule1[this.approver_info[this.approver_status]+""].text
        }
      }
    }
  }
</script>

<style scoped>
  .approver-item{
    display: flex;
    margin-top: 1rem;
    align-items: center;
    font-size: 0.7rem;
    color: #555;
  }
  .status-icon{
    font-size: 1.1rem;
    margin-right: 0.5rem;
  }
  .approver_avatar{
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    margin-right: 0.5rem;
    position: relative;
  }
  .approver_avatar::after{
    content: '';
    display: block;
    width: 2.4rem;
    height: 2.4rem;
    background-image: url("~@/assets/default_avatar.png");
    position: absolute;
    top: 0;
    left: 0;
    background-size: cover;
  }
  .approver_name{
    flex: 1;
  }
  .approver_date{
    color: #999;
  }
</style>
