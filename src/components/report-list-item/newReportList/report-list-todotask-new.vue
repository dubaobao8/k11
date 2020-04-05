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
  name: "report-list-todotask-new",
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
      this.$router.push("/todotask_detail/" + this.data.id);
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
        title:
          data.work_num || data.username
            ? `${data.work_num || data.username}的To Do Task`
            : "To Do Task",
        type: "todotask",
        status: data.status,
        read: data.read === 1,
        info_list: [
          {
            key: "任务名称",
            value: data.title
          },
          {
            key: "整体完成时间",
            value:
              stampToString(data.type, "/", false) ||
              stampToString(data.finish_time, "/", false)
          },
          {
            key: "收件人",
            value: data.work_num || data.username
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
