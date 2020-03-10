<template>
  <report-list-tamplate-common :data="data_info" @click="gotoDetail">
    <template v-slot:center>
      <button @click.stop="showOpinion(data.content)" class="r-opinion" v-if="data.content">审批意见</button>
    </template>
    <template v-slot:bottom>
      <cube-rate :disabled="true" class="r-stars" v-if="data.star != null" v-model="data.star"></cube-rate>
    </template>
  </report-list-tamplate-common>
</template>

<script>
  import ReportListTamplateCommon from "@/components/report-list-item/components/report-list-tamplate-common";

  export default {
    name: "report-list-patrol",
    components: {
      ReportListTamplateCommon,
    },
    props: {
      data: Object
    },
    methods: {
      gotoDetail() {
        this.$router.push("/pot_detail/" + this.data.id);
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
          title: data.username ? `${data.username}的巡查报告` : "巡查报告",
          type: "incident",
          status: data.status,
          read: data.read === 1,
          info_list: [{
            key: "巡查报告",
            value: data.abstract || data.title
          }, {
            key: "项目名称",
            value: data.type || data.title
          }, {
            key: "巡查报告编号",
            value: data.work_num
          }],
          date: data.create_time
        }
      }
    }
  };
</script>
