<template>
  <div class="full-height">
    <v-list-reports url="/api/Stationery/WorkReport"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "stationery_progress",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>
