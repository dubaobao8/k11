<template>
  <div @click="gotoDetail">
    <report-list-tamplate-common :data="data_info">
      <template v-slot:center>
        <i
          class="cubeic-star"
          @click.stop="clickStar"
          :class="data.new_star==2?'star-active':'star'"
        ></i>
      </template>
    </report-list-tamplate-common>
  </div>
</template>

<script>
import clipboard from "clipboard";
import ReportListTamplateCommonNew from "./components/report-list-tamplate-common-new";
import axios from "axios/index";

export default {
  name: "report-list-sde-new",
  components: {
    ReportListTamplateCommonNew
  },
  props: {
    data: Object
  },
  methods: {
    clickStar() {
      this.data.new_star == 2
        ? (this.data.new_star = 1)
        : (this.data.new_star = 2);
      if (this.data.new_star == 2) {
        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Statistics/UpStar",
          method: "POST",
          headers: {
            token: localStorage.getItem("token")
          },
          data: {
            port_id: this.data.id
          }
        }).then(res => {
          // console.log(res, "res1111")
        });
      } else {
        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Statistics/DownStar",
          method: "POST",
          headers: {
            token: localStorage.getItem("token")
          },
          data: {
            port_id: this.data.id
          }
        }).then(res => {
          // console.log(res, "res2222")
        });
      }
    },
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
        info_list: [
          {
            key: "文件类型",
            value: data.file_type || data.type
          },
          {
            key: "文件名称",
            value: data.title
          },
          {
            key: "SDE自动编号",
            value: data.work_num
          }
        ],
        date: data.create_time
      };
    }
  },
  mounted() {
    var copy = new clipboard(".r-copy");
    var _this = this;
    copy.on("success", function(e) {
      _this
        .$createToast({
          txt: "复制编号成功",
          type: "correct",
          time: 1000
        })
        .show();
    });
    copy.on("error", function(e) {
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
<style scoped>
.star-active {
  font-size: 35px;
  color: #1a81d0;
}
.star {
  font-size: 35px;
  color: #cedbde;
}
</style>

