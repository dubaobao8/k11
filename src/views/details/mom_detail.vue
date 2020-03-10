<template>
  <div>
    <d-business-card :info="user_info" class="margin20" stateless/>
    <section class="margin20">
      <d-info-item :value="info_data.date" class="info-item-detail" title="巡查日期"/>
      <d-info-item :value="info_data.time" class="info-item-detail" title="巡查时间"/>
      <d-info-item :value="info_data.place" class="info-item-detail" title="巡查地点"/>
      <d-info-item :value="info_data.detail_place" class="info-item-detail" title="巡查详细地点"/>
      <div class="divider-1"></div>
    </section>
    <section class="margin20">
      <p class="form-detail-title-huge mb15">环境卫生</p>
      <d-info-item :class="item.value?'normal':'abnormal'"
                   :title="item.name"
                   :value="item.value | isNormal" class="info-item-detail"
                   v-for="(item,index) in info_data.environment"/>
    </section>
    <section class="margin20">
      <p class="form-detail-title-huge mb15">设备设施</p>
      <d-info-item :class="item.value?'normal':'abnormal'"
                   :title="item.name"
                   :value="item.value | isNormal" class="info-item-detail"
                   v-for="(item,index) in info_data.facility"/>
    </section>
    <section class="margin20">
      <p class="form-detail-title-huge mb15">其他</p>
      <d-info-item :class="item.value?'normal':'abnormal'"
                   :title="item.name"
                   :value="item.value | isNormal" class="info-item-detail"
                   v-for="(item,index) in info_data.others"/>
    </section>

    <section class="margin20" v-if="info_data.unusual === 1">
      <p class="form-detail-title-huge mb15">其他异常</p>
      <p class="other-text">{{info_data.content}}</p>
    </section>

    <div class="divider-1" style="margin: 20px;"></div>

    <section class="margin20">
      <d-info-item v-if="lookUser" :value="lookUser" class="info-item-detail" title="抄送人"/>
    </section>
  </div>
</template>

<script>
  import DBusinessCard from "@/components/details/d-business-card";
  import request from "@/api";
  import DInfoItem from "@/components/details/d-info-item";

  export default {
    name: "mom-detail",
    components: {DInfoItem, DBusinessCard},
    data() {
      return {
        user_info: {
          user_name: "",
          user_avatar: "",
          report_name: "母婴室巡查",
          report_type: "mom",
          report_status: "1",
          user_id: "",
          department: "",
          position: ""
        },
        info_data: {},
        lookUser:""
      }
    },
    methods: {
      getData() {
        request.post('/api/Mys/MysDetail', {port_id: this.$route.params.id}).then(res => {
          let data = res.data.data;
          console.log(data);
          this.info_data = data;
          this.user_info.user_name = data.user.username;
          this.user_info.user_avatar = data.user.user_logo;
          this.user_info.user_id = data.user.userid;
          this.user_info.department = data.user.department;
          this.user_info.position = data.user.position;
          this.user_info.report_status = data.status;
          this.lookUser = data.lookUser.map(item=>item.username).join('，');

        })
      }
    },
    mounted() {
      this.getData();
    },
    filters: {
      isNormal(value) {
        return value ? '正常' : '异常'
      }
    }
  }
</script>

<style scoped src="./details.css"></style>
<style scoped>
  .normal {
    color: rgb(7, 193, 96);
  }

  .abnormal {
    color: rgb(238, 10, 36);
  }

  .other-text {
    font-size: 0.875rem;
    color: #333;
  }
</style>
