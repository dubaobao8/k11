<template>
  <div>
    <main class="bg-white">
      <!-- 搜索框 -->
      <section class="search-wrp">
        <v-search @select="onSelect" class="search"/>
      </section>

      <!-- tab标签栏 -->
      <van-tabs color="#5585f0" v-model="active_tab" @change="onTabChange">
        <van-tab :name="tab.name" :title="tab.title" v-for="tab in tabs">
          <!-- 列表 -->
          <section class="scroll-wrp">
            <v-list-reports :extra-params="extraParams" :url="isSearchMode?tab.searchUrl:tab.url"/>
          </section>
        </van-tab>
      </van-tabs>

    </main>
    <tab-bar class="tab-bar" curTab="mine"/>
  </div>
</template>

<script>
  import VSearch from "@/components/search/v-search";
  import TabBar from "@/components/tab-bar"
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "mine",
    components: {VListReports, VSearch, TabBar},
    data() {
      return {
        active_tab: "",
        tabs: [{
          title: "待处理",
          name: "pending",
          url: "/api/News/ToDoReport",
          searchUrl: "/api/News/SearchToDoReport",
        }, {
          title: "进行中",
          name: "underway",
          url: "/api/News/OnWayReport",
          searchUrl: "/api/News/SearchWorkReport",
        }, {
          title: "已完成",
          name: "done",
          url: "/api/News/FinishReport",
          searchUrl: "/api/News/SearchFinishReport",
        }],
        isSearchMode: false,
        extraParams: {}
      }
    },
    methods: {
      // 搜索框选择完毕
      onSelect(data) {
        if (!data.status && !data.text && !data.type) {
          this.isSearchMode = false;
          this.extraParams = {};
        } else {
          this.isSearchMode = true;
          this.extraParams = {
            port_type: data.type * 1,
            status: data.status ? data.status : 0,
            content: data.text
          }
        }
      },
      onTabChange(name){
        var query = Object.assign({},this.$route.query);
        query.tab = name;
        this.$router.push({
          path:this.$route.path,
          query:query
        });
      }
    },
    mounted() {
      var tab = this.$route.query.tab;
      if (tab){
        this.active_tab = tab;
      }
    }
  }
</script>

<style scoped>
  .scroll-wrp {
    height: calc(100vh - 6.5rem - 44px);
    height: calc(100vh - 6.5rem - 44px - constant(safe-area-inset-bottom));
    height: calc(100vh - 6.5rem - 44px - env(safe-area-inset-bottom));
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
