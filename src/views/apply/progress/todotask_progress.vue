<template>
  <div class="full-height">
    <v-list-reports url="/api/Task/TaskWorkList"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "todotask_progress",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>
