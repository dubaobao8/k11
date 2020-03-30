<template>
  <div>
    <main class="bg-white">
      <!-- 搜索框 -->
      <section class="search-wrp">
        <v-search-new @select="onSelect" class="search"/>
      </section>

      <!-- 列表 -->
      <section class="scroll-wrp">
        <v-list-reports :extra-params="extraParams" :url="url"/>
      </section>

    </main>
  </div>
</template>

<script>
  import VSearchNew from "@/components/search/v-search-new";
  import TabBar from "@/components/tab-bar";
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "mine",
    components: {VListReports, VSearchNew, TabBar},
    data() {
      return {
        url: "/api/project/bosslist",
        extraParams: {},
      }
    },
    methods: {
      // 搜索框选择完毕
      onSelect(data) {
        if (!data.status && !data.text && !data.type) {
          this.url = "/api/project/bosslist";
          this.extraParams = {};
        } else {
          this.url = "/api/project/bosslist";
          this.extraParams = {
            port_type: data.type * 1,
            status: data.status ? data.status : 0,
            content: data.text
          }
        }
      },
    }

  }
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
