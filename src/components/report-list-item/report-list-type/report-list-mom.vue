<template>
  <report-list-tamplate-common :data="data_info" @click="gotoDetail"/>
</template>

<script>
  import ReportListTamplateCommon from "@/components/report-list-item/components/report-list-tamplate-common";
  import {stampToString} from "@/util/util";

  export default {
    name: "report-list-mom",
    components: {
      ReportListTamplateCommon,
    },
    props: {
      data: Object
    },
    methods: {
      gotoDetail() {
        this.$router.push("/mom_detail/" + this.data.id);
      }
    },
    computed: {
      data_info() {
        let data = this.data;
        return {
          title: data.username ? `${data.username}的巡查记录` : "巡查记录",
          type: "mom",
          status: data.status,
          stateless:true,
          read: data.read === 1,
          info_list: [{
            key: "巡查时间",
            value: data.date
          }, {
            key: "巡查地点",
            value: data.place
          }, {
            key: "详细地点",
            value: data.detail_place
          }],
          date: data.create_time
        }
      }
    }
  };
</script>

