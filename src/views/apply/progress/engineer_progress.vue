<template>
  <div>
    <!-- 列表 -->
    <section class="full-height">
      <v-list-reports url="/api/project/GoOnProject"/>
    </section>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";
  export default {
    name: "engineer_progress",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>

