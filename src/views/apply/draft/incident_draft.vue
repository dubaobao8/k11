<template>
  <div class="full-height">
    <v-list-reports list-type="draft" url="/api/Draft/UserList"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "incident_draft",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>

