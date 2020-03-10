<!-- 审批记录列表 -->
<template>
  <div>
    <section class="operation">
      <h5 class="operation__section">
        <span class="operation__title">操作人：</span>
        <span class="operation__operator">{{name}}</span>
        <span class="operation__position">{{position}}</span>
      </h5>
      <p class="operation__section">
        <span class="operation__title">操作结果：</span>
        <span class="operation__result">{{getApprovalRes(result)}}</span>
      </p>
      <p class="operation__section">
        <span class="operation__title">审批时间：</span>
        <span class="operation__time">{{time | transTime}}</span>
      </p>
      <div class="operation__section">
        <span class="operation__title" v-if="content">审批意见：</span>
        <span class="operation__content__text">{{content}}</span>
      </div>
      <div class="divider mt15 mb15"></div>
    </section>
  </div>

</template>

<script>
  import {getProp} from "../../util/util";

  const approval = {
    engineer: [null, null, '接受单据', '拒绝单据', '指派维修员', '填写维修记录', '维修完成', '重新指派', '维修审批通过','待料','另约时间','其他'],
    todotask: [null,'收件人接受任务','收件人拒绝任务','收件人上级接受任务','收件人上级拒绝任务','收件人上级重新指派收件人','发起人上级认为单据合理',
    '发起人上级认为单据不合理','终审人认为单据合理','终审人认为单据不合理','收件人更新跟进','收件人跟进完成 ','发起人通过单据','发起人驳回单据'
    ]
  };
  export default {
    name: "d-approval-list",
    props: {
      // 信息表
      info: {
        type: Object,
        default: () => {
        },
      },
      report_type:{
        type:String
      },
      /* 字段别名开始 */
      // 审批人
      nameKey: {
        type: String,
        default: "user.username"
      },
      // 审批人职位
      positionKey: {
        type: String,
        default: "user.position"
      },
      // 操作结果
      resultKey: {
        type: String,
        default: "status"
      },
      // 审批时间
      timeKey: {
        type: String,
        default: "create_time"
      },
      // 审批意见
      contentKey: {
        type: String,
        default: "content"
      },
      /* 字段别名结束 */
    },
    data() {
      return {}
    },
    computed: {
      name() {
        return getProp(this.info, this.nameKey);
      },
      position() {
        return getProp(this.info, this.positionKey);
      },
      result() {
        return getProp(this.info, this.resultKey);
      },
      time() {
        return getProp(this.info, this.timeKey);
      },
      content() {
        return getProp(this.info, this.contentKey);
      }
    },
    methods:{
      getApprovalRes(value) {
        return approval[this.report_type][value]
      }
    },
    filters: {

    }
  }
</script>

<style scoped>
  .operation {
    margin-top: 15px;
    margin-bottom: 15px;
    padding: 0 15px;
  }

  .operation__section {
    margin-bottom: 0.6em;
    line-height: 1rem;
  }

  .operation__title {
    font-size: 0.875rem;
    color: #999;
    display: inline-block;
    width: 5em;
    text-align: right;
  }

  .operation__operator {
    color: #666;
    font-size: 0.95rem;
  }

  .operation__position {
    margin-left: 0.5rem;
    color: #aaaaaa;
    font-size: 0.75rem;
  }

  .operation__result {
    font-weight: bold;
    font-size: 0.95rem;
  }

  .operation__time {
    color: #666666;
    font-size: 0.875rem;
  }

  .operation__content__text {
    line-height: 1.5em;
    font-size: 0.875rem;
  }
</style>
