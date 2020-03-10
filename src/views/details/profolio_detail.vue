<template>
  <div class="staff-item">
    <div class="staff-item__avatar">
      <img :src="info.user_logo"
           class="staff-item__avatar__img"/>
    </div>
    <ul class="staff-item__info-list">
      <li class="staff-item__info-list__item">
        <p class="staff-item__info-list__item__attr">Name (CN)</p>
        <span class="staff-item__info-list__item__value">{{info.ch_name}}</span>
      </li>

      <li class="staff-item__info-list__item">
        <p class="staff-item__info-list__item__attr">Name (ENG)</p>
        <span class="staff-item__info-list__item__value">{{info.username}}</span>
      </li>

      <li class="staff-item__info-list__item">
        <p class="staff-item__info-list__item__attr">Position</p>
        <span class="staff-item__info-list__item__value">{{info.position}}</span>
      </li>

      <li class="staff-item__info-list__item">
        <p class="staff-item__info-list__item__attr">SN</p>
        <span class="staff-item__info-list__item__value">{{info.userid}}</span>
      </li>

      <li class="staff-item__info-list__item">
        <p class="staff-item__info-list__item__attr">ROD</p>
        <span class="staff-item__info-list__item__value">{{info.join_time}}</span>
      </li>

      <li class="staff-item__info-list__item">
        <p class="staff-item__info-list__item__attr">Company Moblie</p>
        <span class="staff-item__info-list__item__value">{{info.company_phone}}</span>
      </li>

      <li class="staff-item__info-list__item">
        <p class="staff-item__info-list__item__attr">Moblie No.</p>
        <span class="staff-item__info-list__item__value">{{info.phone}}</span>
      </li>
    </ul>

    <section class="mt20 ml10 mr10">
      <div class="col-title">备注</div>

      <div :key="index" v-for="(item,index) in info.user_remark">
        <div class="cr-grey">{{item.type | commentType}}</div>
        <p class="fs08 mt5" style="line-height: 1.4;word-break: break-all">{{item.content}}</p>
        <p class="cr-light-grey text-right fs07"
           style="margin-top: 8px;">—— {{item.user.username}} 添加于 {{item.create_time | transDate}}
        </p>
        <div class="divider-1 mt15"></div>
      </div>


      <div class="mt30" v-if="isShowEditComment">
        <v-select-input :key="item.uid"
                        :range="commentOptions"
                        @change="onComentEdit(index,$event)"
                        style="padding-right: 5px;"
                        v-for="(item,index) in commentList">
          <template #prepend>
            <i @click="delComment(index)" class="fa fa-minus-square pd5 pointer" style="color: #F22242"></i>
          </template>
        </v-select-input>

        <action-line @click="addComment">添加备注</action-line>
        <a @click="onSubmitComment" class="form-submit-block" style="margin: 20px 0">提交</a>
      </div>
    </section>

    <p class="col-title">进行中的单据</p>
    <div class="divider-1" style="margin-bottom: 0"></div>
    <v-list-reports :extra-params="extraParams" url="/api/profolio/UserReport"/>
  </div>
</template>

<script>
  import ReportListItem from "@/components/report-list-item/report-list-item";
  import request from "@/api";
  import VListReports from "@/components/srcollList/v-list-reports";
  import VSelectInput from "@/components/form/v-select-input";
  import ActionLine from "@/components/form/action-line";

  class Comment {
    constructor() {
      this.content = "";
      this.type = "";
      this.uid = Date.now() * Math.random();
    }
  }

  export default {
    name: "profolio_detail",
    components: {ActionLine, VSelectInput, VListReports, ReportListItem},
    data() {
      return {
        info: {},
        extraParams: {},
        commentList: [],
        commentOptions: [{
          text: "Comment",
          value: 1
        }, {
          text: "Compliment",
          value: 2
        }],
        isShowEditComment: false
      }
    },
    methods: {
      addComment() {
        this.commentList.push(new Comment())
      },
      delComment(index) {
        this.commentList.splice(index, 1)
      },
      onComentEdit(index, value) {
        this.commentList[index].content = value.text;
        this.commentList[index].type = value.select;
      },
      onSubmitComment() {
        let commentList = this.commentList;
        let incomplete = commentList.some(item => !item.content) || !commentList.length;
        if (incomplete) {
          this.$toast.fail('请填写备注！');
          return false
        }
        let data = {
          "user_id": this.$route.params.id,
          "list": commentList
        };

        request.post('/api/Profolio/WritePort', data).then(res => {
          this.$toast.success('提交成功');
          setTimeout(() => {
            location.reload();
          }, 500)
        }).catch(err => {
          this.$toast.fail('操作失败！');
        })
      }
    },
    mounted() {
      let id = this.$route.params.id;
      this.extraParams = {
        user_id: id
      };
      request.post("/api/profolio/UserDetail", {user_id: id}).then(res => {
        this.info = res.data.data;
      });

      var status = localStorage.getItem('status');
      if (status == 2 || status == 3) {
        this.isShowEditComment = true;
      }
    },
    filters: {
      commentType(value) {
        let typeMap = {
          1: "Comment",
          2: "Compliment"
        };

        return typeMap[value];
      }
    }
  }
</script>

<style scoped>
  .staff-item {
    padding: 1rem 0.5rem 0.9rem;
    /*box-shadow: 0 1px 1.25rem #e6e6e6;*/
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 1.2rem;
    color: #4c5055;
    font-size: 0.875rem;
    /*width: 100%;*/
    /*background-color: #fff;*/
  }

  .staff-item__avatar {
    width: 50%;
    padding-bottom: 50%;
    /*background-color: #f2f2f2;*/
    position: relative;
    margin: 1rem auto 1.8rem;
    border-radius: 4px;
    overflow: hidden;

    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .staff-item__avatar__img {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .staff-item__info-list__item {
    display: flex;
    margin-bottom: 0.5rem;
    /*font-size: 0.75rem;*/
    line-height: 1.4;
    justify-content: space-between;
    padding: 0 20px;

  }

  .staff-item__info-list__item__attr {
    flex: 5;
    text-align: left;
    margin-right: 10px;
    white-space: nowrap;
    font-weight: bold;
  }

  .staff-item__info-list__item__value {
    flex: 5;
    vertical-align: top;
    white-space: nowrap;
    color: #999;
    margin-left: 10px;
    text-align: right;
  }

  .col-title {
    font-size: 1.2rem;
    font-weight: bold;
    color: #41424f;
    margin-top: 2rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  /*.list-wrp{*/
  /*  h;*/
  /*}*/
</style>
