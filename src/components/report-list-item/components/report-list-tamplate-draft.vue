<template>
  <div>
    <report-list-tamplate-common :data="data" @click="$emit('click')">
      <template v-slot:status>
        <i class="fa fa-align-left draft"></i>
      </template>
      <template v-slot:center>
        <div class="del-draft" @click.stop="$emit('del:draft')">
          删除草稿
        </div>
      </template>
    </report-list-tamplate-common>
  </div>
</template>

<script>
  import ReportListTamplateCommon from "@/components/report-list-item/components/report-list-tamplate-common";

  export default {
    name: "report-list-tamplate-draft",
    components: {ReportListTamplateCommon},
    props: {
      data: Object
    },
    data() {
      return {}
    }
  }
</script>

<style scoped src="../report-list-item.css"></style>
<style>
  .del-draft {
    font-size: 0.8rem;
    line-height: 1.15rem;
    border-radius: 2px;
    color: #fff;
    background-image: linear-gradient(135deg, #ff808c, #ff385d);
    outline: none;
    padding: 4px 0;
    width: 100%;
    text-align: center;
  }
</style>
