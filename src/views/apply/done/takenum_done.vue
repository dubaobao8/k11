<template>
  <section class="full-height">
    <v-list-reports url="/api/TakeNumber/finishlist"/>
  </section>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";
  export default {
    name: "takenum_done",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>

