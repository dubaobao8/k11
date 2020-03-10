<template>
  <div @click="gotoDetail">
    <report-list-tamplate-common :data="data_info">
      <template v-slot:bottom>
        <button :data-clipboard-text="data.work_num" class="r-copy" ref="copy">复制编号</button>
      </template>
    </report-list-tamplate-common>
  </div>
</template>

<script>
  import clipboard from "clipboard";
  import ReportListTamplateCommon from "@/components/report-list-item/components/report-list-tamplate-common";

  export default {
    name: "report-list-sde",
    components: {
      ReportListTamplateCommon,

    },
    props: {
      data: Object
    },
    methods: {
      gotoDetail(event) {
        var btn = this.$refs.copy;
        if (event.target != btn) {
          this.$router.push("/sde_detail/" + this.data.id);
        }
      }
    },
    computed: {
      data_info() {
        let data = this.data;
        return {
          title: data.username ? `${data.username}的SDE自动取号` : "SDE自动取号",
          type: "sde",
          status: data.status,
          info_list: [{
            key: "文件类型",
            value: data.file_type || data.type
          }, {
            key: "文件名称",
            value: data.title
          }, {
            key: "SDE自动编号",
            value: data.work_num
          }],
          date: data.create_time
        }
      }
    },
    mounted() {
      var copy = new clipboard(".r-copy");
      var _this = this;
      copy.on("success", function (e) {
        _this
          .$createToast({
            txt: "复制编号成功",
            type: "correct",
            time: 1000
          })
          .show();
      });
      copy.on("error", function (e) {
        _this
          .$createToast({
            txt: "复制编号失败",
            type: "error",
            time: 1000
          })
          .show();
      });
    }
  };
</script>
