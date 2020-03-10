<template>
  <div class="full-height">
    <v-list-reports list-type="draft" url="/api/listForm/drafts"/>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "purchase_draft",
    components: {VListReports},
    data() {
      return {}
    }
  }
</script>

