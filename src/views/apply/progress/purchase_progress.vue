<template>
  <div class="full-height">
    <v-list-reports url="/api/listForm/listForm"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "purchase_progress",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>
