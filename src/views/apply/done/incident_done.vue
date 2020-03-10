<template>
    <section class="full-height">
      <v-list-reports url="/api/report/FinishList"/>
    </section>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";
  export default {
    name: "incident_done",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>

