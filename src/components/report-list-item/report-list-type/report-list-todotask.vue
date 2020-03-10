<template>
  <report-list-tamplate-common :data="data_info" @click="gotoDetail"/>
</template>

<script>
  import ReportListTamplateCommon from "@/components/report-list-item/components/report-list-tamplate-common";
  import {stampToString} from "@/util/util";

  export default {
    name: "report-list-todotask",
    components: {
      ReportListTamplateCommon,
    },
    props: {
      data: Object
    },
    methods: {
      gotoDetail() {
        this.$router.push("/todotask_detail/" + this.data.id);
      },
      showOpinion(content) {
        this.$createDialog({
          type: "alert",
          title: content
        }).show();
      }
    },
    computed: {
      data_info() {
        let data = this.data;
        return {
          title:( data.work_num || data.username) ? `${(data.work_num || data.username)}的To Do Task` : "To Do Task",
          type: "todotask",
          status: data.status,
          read: data.read === 1,
          info_list: [{
            key: "任务名称",
            value: data.title
          }, {
            key: "整体完成时间",
            value: stampToString(data.type,"/",false) || stampToString(data.finish_time,"/",false)
          }, {
            key: "收件人",
            value: data.work_num || data.username
          }],
          date: data.create_time
        }
      }
    }
  };
</script>
