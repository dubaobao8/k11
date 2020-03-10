<template>
  <div class="full-height">
    <v-list-reports url="/api/Task/TaskFinishList"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "todotask_done",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>
