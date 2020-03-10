<template>
  <div class="full-height">
    <v-list-reports url="/api/patrol/worklist"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "patrol_progress",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>
