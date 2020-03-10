<template>
  <report-list-tamplate-common :data="data_info" @click="gotoDetail"/>
</template>

<script>
  import ReportListTamplateCommon from "@/components/report-list-item/components/report-list-tamplate-common";
  import {stampToString} from "@/util/util";

  export default {
    name: "report-list-stationery",
    components: {
      ReportListTamplateCommon,
    },
    props: {
      data: Object
    },
    methods: {
      gotoDetail() {
        this.$router.push("/stationery_detail/" + this.data.id);
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
          title: data.username ? `${data.username}的文具采购单` : "文具采购单",
          type: "stationery",
          status: data.status,
          read: data.read === 1,
          info_list: [{
            key: "文具名称",
            value: data.title
          }, {
            key: "商品数量",
            value: data.type
          }, {
            key: "文具采购编号",
            value: data.work_num
          }],
          date: data.create_time
        }
      }
    }
  };
</script>
