<template>
  <div>
    <main class="bg-white">
      <!-- 搜索框 -->
      <section class="search-wrp">
        <v-search-statistic @select="onSelect" :searchParam="searchParam" class="search" />
      </section>

      <!-- 列表 -->
      <section class="scroll-wrp">
        <v-list-reports :extra-params="extraParams" :url="url" />
      </section>
    </main>
  </div>
</template>

<script>
import VSearchStatistic from "@/components/search/v-search-statistic";
import TabBar from "@/components/tab-bar";
import VListReports from "@/components/srcollList/v-list-reports";

export default {
  name: "mine",
  components: { VListReports, VSearchStatistic, TabBar },
  data() {
    return {
      url: "/api/Statistics/ThingList",
      extraParams: {},
      routerQuery: {},
      searchParam: {
        searchStatus: 0,
        searchText: ""
      }
    };
  },
  mounted() {
    let routerQuery = this.$route.query;
    if (routerQuery) {
      switch (Number(routerQuery.port_type)) {
        case 1:
          this.$set(this.searchParam, "searchStatus", 1);
          this.$set(this.searchParam, "searchText", "事件报告");
          break;
        case 2:
          this.$set(this.searchParam, "searchStatus", 2);
          this.$set(this.searchParam, "searchText", "巡查报告");
          break;
        case 3:
          this.$set(this.searchParam, "searchStatus", 3);
          this.$set(this.searchParam, "searchText", "工程单");
          break;
        case 4:
          this.$set(this.searchParam, "searchStatus", 4);
          this.$set(this.searchParam, "searchText", "取号");
          break;
        case 5:
          this.$set(this.searchParam, "searchStatus", 5);
          this.$set(this.searchParam, "searchText", "采购/报销单");
          break;
        case 6:
          this.$set(this.searchParam, "searchStatus", 6);
          this.$set(this.searchParam, "searchText", "To Do Task");
          break;
        case 7:
          this.$set(this.searchParam, "searchStatus", 7);
          this.$set(this.searchParam, "searchText", "文具采购");
          break;
      }
      this.routerQuery = routerQuery;
      this.extraParams = routerQuery;
    }
  },
  methods: {
    // 搜索框选择完毕
    onSelect(data) {
      if (!data.status && !data.text && !data.type) {
        this.url = "/api/Statistics/ThingList";
        this.extraParams = {
          type: this.routerQuery.type,
          status: this.routerQuery.status,
          over_time: this.routerQuery.over_time,
          department: this.routerQuery.department,
          port_type: this.routerQuery.port_type
        };
      } else {
        this.url = "/api/Statistics/ThingList";
        this.extraParams = {
          port_type: data.type * 1,
          search_status: data.status ? data.status : 0,
          content: data.text,
          type: this.routerQuery.type,
          status: this.routerQuery.status,
          over_time: this.routerQuery.over_time,
          department: this.routerQuery.department,
          port_type: this.routerQuery.port_type
        };
      }
    }
  }
};
</script>

<style scoped>
.scroll-wrp {
  height: calc(100vh - 6.5rem);
  transition: 0.3s all;
  height: calc(100vh - 6.5rem - constant(safe-area-inset-bottom));
  height: calc(100vh - 6.5rem - env(safe-area-inset-bottom));
}

.search-wrp {
  height: 3.5rem;
}

.search {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
  max-width: 620px;
  margin: 0 auto;
}

.scroll-wrp .list-wrp {
  padding-bottom: 3rem;
}
</style>
