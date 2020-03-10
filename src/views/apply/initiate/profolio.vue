<template>
  <div class="profolio">
    <p class="page-title">SDE Pofolio</p>
    <p class="fs08 text-center cr3 fw-b">（在岗人数{{list.all_count}}人/编制人数{{list.all_weave_count}}人）</p>
    <van-cell :border="false"
              :title="list.LeadBoss.position"
              :value="list.LeadBoss.username"
              @click="toDetail(list.LeadBoss.id)"
              clickable
              v-if="isShowBoss"
              icon="manager-o"
              title-class="cell-title"
              value-class="cell-value"/>

    <!-- 部门列表 -->
    <van-collapse v-model="list.department.showedDep">
      <template v-for="(dep,dep_index) in list.department.depList">

        <van-collapse-item :name="dep.code"
                           :title="`${dep.department} (${dep.on_count}/${dep.weave_count})`"
                           icon="cluster-o"
                           title-class="group-class">
          <div style="margin: -17px -16px -16px 0px;">
            <van-collapse v-model="dep.showedGroup">
              <!-- 部门负责人 -->
              <van-collapse-item :title="`Department Head  (${dep.head_count}/${dep.head_weave_count})`"
                                 icon="friends-o"
                                 name="leader"
                                 title-class="group-class">
                <div style="margin: -17px -16px -16px 0px;">
                  <van-cell :border="false"
                            :title="dep.leadUser.position"
                            :value="dep.leadUser.username"
                            @click="toDetail(dep.leadUser.id)"
                            clickable
                            icon="manager-o"
                            title-class="cell-title"
                            value-class="cell-value"/>
                </div>
              </van-collapse-item>

              <!-- 编制 -->
              <van-collapse-item :title="`Officer Above (${dep.user_count}/${dep.user_weave_count})`"
                                 icon="friends-o"
                                 name="staff"
                                 title-class="group-class">
                <div style="margin: -17px -16px -16px 0px;">
                  <van-cell :class="{'new':staff.is_new}"
                            :title="staff.position"
                            :value="staff.username"
                            :value-class="staff.is_new?'new':'' + ' cell-value'"
                            @click="toDetail(staff.id)"
                            clickable
                            icon="user-o"
                            title-class="cell-title"
                            v-for="(staff,staff_index) in dep.user_info"/>
                </div>
              </van-collapse-item>

              <!-- 其他 -->
              <van-collapse-item :title="`Others (${dep.others_count}/${dep.others_weave_count})`"
                                 icon="friends-o"
                                 name="others"
                                 title-class="group-class">
                <div style="margin: -17px -16px -16px 0px;">
                  <van-cell :class="{'new':staff.is_new}"
                            :title="staff.position"
                            :value="staff.username"
                            :value-class="staff.is_new?'new':'' + ' cell-value'"
                            @click="toDetail(staff.id)"
                            clickable
                            icon="user-o"
                            title-class="cell-title"
                            v-for="(staff,staff_index) in dep.other_user"/>
                </div>

              </van-collapse-item>

              <!-- 外包 -->
              <van-collapse-item :title="`外包公司 (${dep.out_count})`"
                                 icon="friends-o"
                                 name="out"
                                 title-class="group-class">
                <div style="margin: -17px -16px -16px 0px;">
                  <van-cell :class="{'new':staff.is_new}"
                            :title="staff.position"
                            :value="staff.username"
                            :value-class="staff.is_new?'new':'' + ' cell-value'"
                            @click="toDetail(staff.id)"
                            clickable
                            icon="user-o"
                            title-class="cell-title"
                            v-for="(staff,staff_index) in dep.out_source"/>
                </div>
              </van-collapse-item>

            </van-collapse>
          </div>
        </van-collapse-item>
      </template>
    </van-collapse>
  </div>
</template>

<script>
  import request from "@/api";
  import {mapMutations} from "vuex";

  export default {
    name: "profolio",
    data() {
      return {
        // img:require('@/assets/sde/wuye.png'),
        list: {
          LeadBoss: {},
          department: {
            showedDep: [],
            depList: [{
              showedGroup: [],
              leadUser: {},
              user_info: [{}],
              others: []
            }]
          }
        },
      }
    },
    methods: {
      toDetail(id) {
        this.addKeepAlivePage(this.$options.name);
        setTimeout(() => {
          this.$router.push('/profolio_detail/' + id);
        }, 100)

      },
      ...mapMutations(['addKeepAlivePage', 'delKeepAlivePage'])
    },
    mounted() {
      request.post('/api/Profolio/UserList').then(res => {
        let data = res.data.data;
        console.log(data);
        this.list = data;
      })
    },
    activated() {
      this.delKeepAlivePage(this.$options.name)
    },
    computed: {
      isShowBoss() {
        let status = localStorage.getItem('status');
        return status == 3;
      }
    }
  }
</script>

<style scoped>
  .page-title {
    text-align: center;
    font-size: 1.25rem;
    font-weight: bold;
    margin: 1.25rem 0 0.875rem;
    color: #41424f;
  }

  .cell-title {
    flex: 1 1 auto;
  }

  .cell-value {
    flex: 1 1 auto;
  }

  .profolio >>> .van-cell {
    cursor: pointer;
    /*background-color: transparent;*/
  }

  .profolio >>> .van-cell__left-icon {
    font-size: 22px;
  }

  .new {
    color: #2a7dff;
  }

  .profolio >>> .group-class span {
    /*padding-left: 16px;*/
    /*background-color: #f9f9f9;*/
    font-weight: bold;
  }

  .profolio >>> .van-collapse-item__content {
    /*background-color: transparent;*/
  }
</style>
