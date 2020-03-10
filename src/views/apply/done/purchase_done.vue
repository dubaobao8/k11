<template>
  <section class="scroll-wrp">
    <v-list-reports url="/api/listForm/completeList"/>
  </section>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "purchase_done",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .scroll-wrp {
    height: 100vh;
  }
</style>
