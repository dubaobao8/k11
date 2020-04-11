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

export default {
  name: "report-list-purchase-new",
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
      this.$router.push("/purchase_detail/" + this.data.id);
    }
  },
  computed: {
    data_info() {
      let data = this.data;
      return {
        title: data.username ? `${data.username}的采购/报销单` : "采购/报销单",
        type: "purchase",
        status: data.status,
        read: data.read === 1,
        info_list: [
          {
            key: "采购/报销主题",
            value: data.title
          },
          {
            key: "采购用途",
            value: data.purpose || data.type
          },
          {
            key: "采购编号",
            value: data.purchase_number || data.work_num
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

