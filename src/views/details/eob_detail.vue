<template>
  <div>
    <d-business-card :info="user_info" class="margin20" stateless/>
    <section class="margin20">
      <d-info-item :value="info_data.type" class="info-item-detail" title="事件类型"/>
      <d-info-item :value="info_data.place" class="info-item-detail" title="发生地"/>

      <section class="info-item-detail">
        <d-info-item title="详细描述" class="mb8"/>
        <p class="content-text" v-html="info_data.content"></p>
      </section>

      <d-info-item class="info-item-detail" title="原始档案"/>
      <v-file-preview :files="info_data.files" imageKey="image"/>
    </section>

    <div class="divider-1"></div>
    <section class="margin20">
      <p class="form-detail-title-huge mb15">历史记录</p>
      <ul>
        <li :key="item.id" class="history-item" v-for="(item,index) in info_data.edit">
          <d-info-item :value="item.create_time | transTime" title="时间"/>
          <p class="mt10 content-text" v-html="item.content"></p>
          <div class="divider-dash-1 mt20 mb15"></div>
        </li>
      </ul>
    </section>
    <a @click="onModify" class="form-submit-block">修改EOB</a>
  </div>
</template>

<script>
  import DBusinessCard from "@/components/details/d-business-card";
  import request from "@/api";
  import DInfoItem from "@/components/details/d-info-item";
  import VFilePreview from "@/components/details/v-file-preview";

  export default {
    name: "eob_detail",
    components: {VFilePreview, DInfoItem, DBusinessCard},
    data() {
      return {
        user_info: {
          user_name: "",
          user_avatar: "",
          report_name: "EOB",
          report_type: "eob",
          report_status: "1",
          user_id: "",
          department: "",
          position: ""
        },
        info_data: {
          edit:[]
        }
      }
    },
    methods: {
      getData() {
        request.post('/api/EOB/EOBDetail', {port_id: this.$route.params.id}).then(res => {
          let data = res.data.data;
          console.log(data);
          this.info_data = data;
          this.user_info.user_name = data.user.username;
          this.user_info.user_avatar = data.user.user_logo;
          this.user_info.user_id = data.user.userid;
          this.user_info.department = data.user.department;
          this.user_info.position = data.user.position;
          this.user_info.report_status = data.status;
        })
      },
      onModify() {
        this.$router.push({
          path: '/eob',
          query: {
            modify: true,
            id: this.$route.params.id
          }
        })
      }
    },
    mounted() {
      this.getData();
    },
  }
</script>

<style scoped src="./details.css"></style>

<style lang="scss" scoped>

</style>
