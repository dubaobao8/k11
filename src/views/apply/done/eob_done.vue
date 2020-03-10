<template>
  <div class="full-height">
    <v-list-reports url="/api/Eob/EobList"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "eob_done",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>
