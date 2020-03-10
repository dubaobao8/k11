<template>
  <div class="full-height">
    <v-list-reports list-type="draft" url="/api/project/DraftList"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "eng_draft",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>
