<template>
  <div>
    <d-business-card :info="user_info" class="margin20"/>
    <p class="form-detail-title-huge margin20">采购详情</p>

    <ul class="margin20">
      <li v-for="(item,index) in info_data.goods" :key="item.key">
        <p class="form-detail-title mb10 fw-b">文具{{index+1}}</p>
        <d-info-item :value="item.name" class="info-item-detail" title="文具类别"/>
        <d-info-item :value="item.number" class="info-item-detail" title="文具数量"/>
        <div class="divider-1"></div>
      </li>
    </ul>

    <section>
      <!-- 部门主管审批 -->
      <div v-if="report_status === 1 && isActionUser">
        <a class="form-submit-block" @click="option_approval(true)">同意</a>
        <a class="form-submit-block form-submit-block__reject" @click="option_approval(false)">拒绝</a>
      </div>

      <!--综合部确认已采购-->
      <div v-if="report_status === 2 && department === info_data.action_user">
        <a class="form-submit-block" @click="option_purchased">确认已采购</a>
      </div>

      <!-- 申请人确认收货 -->
      <div v-if="report_status === 3 && isActionUser">
        <a class="form-submit-block" @click="option_confirm_receipt">确认收货</a>
      </div>
    </section>
  </div>
</template>

<script>
  import DBusinessCard from "@/components/details/d-business-card";
  import DInfoItem from "@/components/details/d-info-item";
  import request from "@/api";

  export default {
    name: "stationery-detail",
    components: {DInfoItem, DBusinessCard},
    data() {
      return {
        user_info: {
          user_name: "User",
          user_avatar: "",
          report_name: "文具采购",
          report_type: "stationery",
          report_status: "1",
          user_id: "",
          department: "",
          position: ""
        },
        report_status: 0,
        department: localStorage.getItem('department'),
        isActionUser: false,
        info_data: {}
      }
    },
    methods: {
      getData() {
        request.post('/api/Stationery/StaDeatil', {port_id: this.$route.params.id}).then(res => {
          let data = res.data.data;
          this.info_data = data;
          this.user_info.user_name = data.user.username;
          this.user_info.user_avatar = data.user.user_logo;
          this.user_info.user_id = data.user.userid;
          this.user_info.department = data.user.department;
          this.user_info.position = data.user.position;
          this.user_info.report_status = data.status;

          this.report_status = data.status;

          this.isActionUser = data.action_user * 1 === localStorage.getItem('user_id') * 1;
        })
      },
      // 部门主管审批
      async option_approval(isAgree) {
        let url = isAgree ? "/api/Stationery/LeadAgree" : "/api/Stationery/LeadRefuse";
        if (isAgree) {
          try {
            await this.ex.confirm('确定同意操作吗？');
          } catch (e) {
            return false;
          }
        }

        let data = {
          port_id: this.$route.params.id
        };

        if (!isAgree) {
          data.content = await this.ex.prompt('请输入拒绝理由');
          if (!data.content) {
            this.$notify('请输入拒绝理由！');
            return false;
          }
        }

        request.post(url, data).then(res => {
          this.ex.alert('操作成功！').then(() => {
            location.reload();
          })
        }).catch(err => {
          this.ex.alert('未知错误！', null, false);
        })
      },
      // 综合部确认已采购
      async option_purchased() {
        try {
          await this.ex.confirm('提示', '确定已采购？');
          let data = {port_id: this.$route.params.id};
          request.post('/api/Stationery/Comprehensive', data).then(res => {
            this.ex.alert('操作成功！').then(() => {
              location.reload();
            })
          }).catch(err => {
            this.ex.alert('未知错误！', null, false);
          })
        } catch (e) {

        }
      },

      //申请人确认收货
      async option_confirm_receipt() {
        try {
          await this.ex.confirm('提示', '确定确认收货？');
          let data = {port_id: this.$route.params.id};
          request.post('/api/Stationery/UserEnd', data).then(res => {
            this.ex.alert('操作成功！').then(() => {
              location.reload();
            })
          }).catch(err => {
            this.ex.alert('未知错误！', null, false);
          })
        } catch (e) {

        }
      }

    },
    mounted() {
      this.getData();
    }

  }
</script>

<style scoped src="./details.css"></style>
<style lang="scss" scoped>

</style>
