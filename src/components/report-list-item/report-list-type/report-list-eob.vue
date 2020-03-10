<template>
  <report-list-tamplate-common :data="data_info" @click="gotoDetail"/>
</template>

<script>
  import ReportListTamplateCommon from "@/components/report-list-item/components/report-list-tamplate-common";
  import {stampToString} from "@/util/util";

  export default {
    name: "report-list-eob",
    components: {
      ReportListTamplateCommon,
    },
    props: {
      data: Object
    },
    methods: {
      gotoDetail() {
        this.$router.push("/eob_detail/" + this.data.id);
      }
    },
    computed: {
      data_info() {
        let data = this.data;
        return {
          title: data.username ? `${data.username}的EOB` : "我的EOB",
          type: "eob",
          status: data.status,
          stateless:true,
          read: data.read === 1,
          info_list: [{
            key: "事件类型",
            value: data.type
          }, {
            key: "发生地",
            value: data.place
          }, {
            key: "EOB编号",
            value: data.work_num
          }],
          date: data.create_time
        }
      }
    }
  };
</script>

