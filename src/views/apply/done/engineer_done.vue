<template>
  <div>
    <section class="scroll-wrp">
      <v-list-reports url="/api/project/FinshProject"/>
    </section>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";
  export default {
    name: "engineer_done",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .scroll-wrp{
    height: 100vh;
  }
</style>
