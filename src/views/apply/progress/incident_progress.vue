<template>
  <div class="full-height">
    <v-list-reports url="/api/report/WorkList"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "incident_progress",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>
