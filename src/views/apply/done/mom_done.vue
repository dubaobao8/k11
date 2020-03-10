<template>
  <div>
    <van-tabs @change="onTabChange" color="#5585f0" sticky swipeable v-model="active_tab">
      <van-tab :name="tab.name" :title="tab.title" v-for="tab in tabs">
        <!-- 列表 -->
        <section class="scroll-wrp">
          <v-list-reports :extra-params="extraParams" :url="tab.url"/>
        </section>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
  import VListReports from "@/components/srcollList/v-list-reports";

  export default {
    name: "mom_done",
    components: {VListReports},
    data() {
      return {
        active_tab: "",
        tabs: [{
          title: "全部巡查记录",
          name: "all",
          url: "/api/Mys/MyAllReport",
        }, {
          title: "上一级巡查记录",
          name: "last",
          url: "/api/Mys/LastUserReport",
        }],
        extraParams: {
          date: Math.floor(Date.now() / 1000)
        }
      }
    },
    methods: {
      onTabChange(name) {
        var query = Object.assign({},this.$route.query);
        query.tab = name;
        this.$router.replace({
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
    height: calc(100vh - 44px);
    height: calc(100vh - 44px - constant(safe-area-inset-bottom));
    height: calc(100vh - 44px - env(safe-area-inset-bottom));
  }
</style>
