<template>
  <section class="full-height">
    <v-list-reports url="/api/patrol/finishlist"/>
  </section>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";
  export default {
    name: "patrol_done",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>

