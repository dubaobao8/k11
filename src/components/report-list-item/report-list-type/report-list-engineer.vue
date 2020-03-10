<template>
  <report-list-tamplate-common :data="data_info" @click="gotoDetail"/>
</template>

<script>
  import ReportListTamplateCommon from "@/components/report-list-item/components/report-list-tamplate-common";

  export default {
    name: "report-list-engineer",
    components: {
      ReportListTamplateCommon,
    },
    props: {
      data: Object
    },
    methods: {
      gotoDetail() {
        this.$router.push("/eng_detail/" + this.data.id);
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
          title: data.username ? `${data.username}的工程单` : "工程单",
          type: "engineer",
          status: data.status,
          read: data.read === 1,
          info_list: [{
            key: "故障描述",
            value: data.content || data.title
          }, {
            key: "工作类型",
            value: data.work_type || data.type
          }, {
            key: "工程单号",
            value: data.work_num
          }],
          date: data.create_time
        }
      }
    }
  };
</script>
