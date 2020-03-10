<template>
  <div class="full-height">
    <v-list-reports url="/api/Stationery/FinshReport"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "stationery_done",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>
