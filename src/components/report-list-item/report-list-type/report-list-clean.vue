<template>
  <report-list-tamplate-common :data="data_info" @click="gotoDetail"/>
</template>

<script>
  import ReportListTamplateCommon from "@/components/report-list-item/components/report-list-tamplate-common";
  import moment from "moment";

  export default {
    name: "report-list-clean",
    components: {
      ReportListTamplateCommon,
    },
    props: {
      data: Object
    },
    methods: {
      gotoDetail() {
        this.$router.push("/cleaning_detail/" + this.data.id);
      }
    },
    computed: {
      data_info() {
        let data = this.data;
        return {
          title: data.username ? `${data.username}的清洁大做` : "清洁大做",
          type: "clean",
          status: data.status,
          read: data.read === 1,
          info_list: [{
            key: "任务名称",
            value: data.title
          }, {
            key: "清洁次数",
            value: data.type
          }, {
            key: "开始日期",
            value: moment(data.work_num *1000).format('YYYY/MM/DD')
          }],
          date: data.create_time
        }
      }
    }
  };
</script>
