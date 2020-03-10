<template>
  <div class="business-card">
    <img :src="info.user_avatar" class="business-card-img">
    <h3 class="business-card-info">
      <span class="business-card-text business-card-title">{{info.user_name}}</span>
      <span class="business-card-text business-card-report-name">{{info.report_name}}
        <report-list-status :status="info.report_status" :type="info.report_type" class="ml5" v-if="!stateless"/>
      </span>
      <span class="business-card-text ">员工号：{{info.user_id}}</span>
      <span class="business-card-text ">所在部门：{{info.department}}</span>
      <span class="business-card-text ">职位：{{info.position}}</span>
    </h3>

    <a :href="printUrl"
       class="fa fa-file-pdf-o pdf-btn"
       target="_blank"
       v-if="print && isPc()"></a>
  </div>
</template>

<script>
  import reportListStatus from "@/components/report-list-item/components/report-list-status";
  import {isPc} from "@/util/util";

  export default {
    name: "d-business-card",
    components: {
      reportListStatus
    },
    props: {
      info: {
        type: Object,
        default() {
          return {
            user_name: "111", //用户名
            user_avatar: "", //用户头像
            report_name: "事件报告", //报告名字 如：事件报告
            report_type: "incident", //报告类型 [incident,sde]
            report_status: "1", //报告状态 [1,2,3,4,5]
            user_id: "", // 员工号
            department: "", // 员工部门
            position: "" // 员工职位
          };
        }
      },
      print: {
        type: Boolean,
        default: false
      },
      printUrl: String,
      stateless: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      isPc,
    }
  };
</script>

<style scoped>
  .business-card {
    display: flex;
    position: relative;
  }

  .business-card-info {
    display: flex;
    flex-direction: column;
    margin-left: 1.2rem;
    justify-content: space-between;
  }

  .business-card-text {
    font-size: 0.9rem;
    color: #888;
    word-break: break-word;
    line-height: 1.3em;
  }

  .business-card-title {
    font-size: 0.95rem;
    font-weight: bold;
    color: #333333;
  }

  .business-card-report-name {
    display: flex;
    align-items: center;
  }

  .business-card-img {
    width: 10rem;
    height: 10rem;
    position: relative;
  }

  .business-card-img::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background-image: url("~@/assets/default_avatar.png");
    background-size: cover;
  }

  .pdf-btn {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 1.2rem;
    color: #666;
  }
</style>
