<template>
  <report-list-tamplate-common :data="data_info" @click="gotoDetail"/>
</template>

<script>
  import ReportListTamplateCommon from "@/components/report-list-item/components/report-list-tamplate-common";

  export default {
    name: "report-list-purchase",
    components: {
      ReportListTamplateCommon,
    },
    props: {
      data: Object
    },
    methods: {
      gotoDetail() {
        this.$router.push("/purchase_detail/" + this.data.id);
      }
    },
    computed: {
      data_info() {
        let data = this.data;
        return {
          title: data.username ? `${data.username}的采购/报销单` : "采购/报销单",
          type: "purchase",
          status: data.status,
          read: data.read === 1,
          info_list: [{
            key: "采购/报销主题",
            value: data.title
          }, {
            key: "采购用途",
            value: data.purpose || data.type
          }, {
            key: "采购编号",
            value: data.purchase_number || data.work_num
          }],
          date: data.create_time
        }
      }
    }
  };
</script>
