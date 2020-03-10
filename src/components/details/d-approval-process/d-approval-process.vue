<template>
  <div class="d-approval-process">
    <d-approval-process-item
      v-for="(item,index) in approver"
      :approver_info="item"
      :approver_name="approver_name"
      :approver_avatar="approver_avatar"
      :approver_status="approver_status"
      :approver_date="approver_date"
      :report_type="report_type"
      :key="new Date().getTime() * Math.random()"/>
    <div class="divider-1"></div>
    <p style="margin-bottom: 10px" class="accepts" v-if="accepts">抄送人：{{accepts}}</p>
    <p class="accepts" v-if="group">抄送人群组：{{group}}</p>
  </div>
</template>

<script>
  import DApprovalProcessItem from "@/components/details/d-approval-process/child/d-approval-process-item";

  export default {
    name: "d-approval-process",
    components: {DApprovalProcessItem},
    props: {
      approver: {
        type: null,
        default() {
          return [
            // {
            //   approver_name: "Tony",
            //   approver_avatar: "https://hbimg.huabanimg.com/0af044569d0a20dd1530f6ac9f2e32fa9b2fcd073c435-FdbbDP",
            //   approver_status: 2,
            //   approver_date: "2019/05/05",
            //   // transfer_men: "Foret",
            //
            // }, {
            //   approver_name: "Grid",
            //   approver_avatar: "https://hbimg.huabanimg.com/1e3ef6350e162e2ff7a7b60ba6dff41d6d5526908a84a-2IW6Fj",
            //   approver_status: 3,
            //   approver_date: "2019/05/05",
            //   // transfer_men: "Ella"
            // }
          ];
        }
      },
      // 单据类型 [incident, engineer]
      report_type:String,
      // 抄送人
      accepts:String,
      // 抄送人群组
      group:String,
      approver_name:{
        type:String,
        default:"approver_name"
      },
      approver_avatar:{
        type:String,
        default:"approver_avatar"
      },
      approver_status:{
        type:String,
        default:"approver_status"
      },
      approver_date:{
        type:String,
        default:"approver_date"
      },
    }
  };
</script>

<style scoped>
  .accepts{
    font-size: 0.875rem;
    color: #888888;
    line-height: 1.3;
  }
</style>

