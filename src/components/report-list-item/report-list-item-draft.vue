<template>
  <div @click="$emit('click')" class="report-list-item-draft">
    <report-list-draft-incident :data="info" v-if="type == 1"/>
    <report-list-draft-patrol :data="info" v-if="type == 2"/>
    <report-list-draft-engineer :data="info" v-if="type == 3"/>
    <report-list-draft-sde :data="info" v-if="type == 4"/>
    <report-list-draft-purchase :data="info" v-if="type == 5" />
  </div>
</template>

<script>
  import ReportListDraftIncident from "@/components/report-list-item/report-list-draft/report-list-draft-incident";
  import ReportListDraftPatrol from "@/components/report-list-item/report-list-draft/report-list-draft-patrol";
  import ReportListDraftSde from "@/components/report-list-item/report-list-draft/report-list-draft-sde";
  import ReportListDraftEngineer from "@/components/report-list-item/report-list-draft/report-list-draft-engineer";
  import ReportListDraftPurchase from "@/components/report-list-item/report-list-draft/report-list-draft-purchase";

  export default {
    name: "report-list-item-draft",
    components: {
      ReportListDraftPurchase,
      ReportListDraftEngineer, ReportListDraftSde, ReportListDraftPatrol, ReportListDraftIncident},
    props: {
      data: {
        type: null,
        required: true
      }
    },
    data() {
      return {
        info: this.data
    }
    },
    computed: {
      type() {
        return this.data ? this.data.port_type : 0;
      }
    },
  }
</script>

<style scoped>
  .report-list-item-draft {
    border-bottom: 1px solid rgb(240, 240, 240);
    background-color: #fff;
  }
</style>
