<template>
  <div>
    <section class="full-height">
      <v-list-reports url="/api/Clean/UnPlanTask"/>
    </section>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";
  export default {
    name: "cleaning_progress",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>

<style scoped>

</style>
