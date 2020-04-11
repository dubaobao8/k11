<template>
  <report-list-tamplate-common-new :data="data_info" @click="gotoDetail">
    <template v-slot:center>
      <i class="cubeic-star" @click.stop="clickStar" :class="data.new_star==2?'star-active':'star'"></i>
    </template>
  </report-list-tamplate-common-new>
</template>

<script>
import ReportListTamplateCommonNew from "./components/report-list-tamplate-common-new";
import axios from "axios/index";
import { stampToString } from "@/util/util";

export default {
  name: "report-list-stationery-new",
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
    gotoDetail() {
      if (this.data.list_type == 1) {
        axios({
          baseURL: this.$store.state.domain,
          url: "/api/Statistics/BossRead",
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
      this.$router.push("/stationery_detail/" + this.data.id);
    },
    showOpinion(content) {
      this.$createDialog({
        type: "alert",
        title: content
      }).show();
    }
  },
  computed: {
    data_info() {
      let data = this.data;
      return {
        title: data.username ? `${data.username}的文具采购单` : "文具采购单",
        type: "stationery",
        status: data.status,
        read: data.read === 1,
        info_list: [
          {
            key: "文具名称",
            value: data.title
          },
          {
            key: "商品数量",
            value: data.type
          },
          {
            key: "文具采购编号",
            value: data.work_num
          }
        ],
        date: data.create_time
      };
    }
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

