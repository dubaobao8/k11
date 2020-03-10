<template>
  <section class="full-height">
    <v-list-reports url="/api/TakeNumber/WorkList"/>
  </section>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";
  export default {
    name: "takenum_progress",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>

