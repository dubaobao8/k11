<!-- 用来显示报告的状态 -->
<template>
  <div :style="{color:rule[this.type][this.status+''].color, borderColor:rule[this.type][this.status+''].color}"
       class="report-list-status">
    {{rule[this.type][this.status+''].desc}}
  </div>
</template>

<script>
  export default {
    name: "report-list-status",
    props: {
      status: {
        type: [Number, String],
        required: true
      },
      type: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        // 规则表，根据报告的类型返回对应的颜色、描述文字
        rule: {
          incident: {
            "1": {
              color: "rgba(85, 133, 240, 1)",
              desc: "待审批"
            },
            "2": {
              color: "#69AF50",
              desc: "已通过"
            },
            "3": {
              color: "#D9932D",
              desc: "已驳回"
            },
            "4": {
              color: "#C79BDD",
              desc: "跟进中"
            },
            "5": {
              color: "#009688",
              desc: "转审中"
            }
          },
          sde: {
            "1": {
              color: "rgb(0,22,255)",
              desc: "未提交"
            },
            "2": {
              color: "#42b8a1",
              desc: "已提交"
            },
            "3": {
              color: "#ec595c",
              desc: "退回修改"
            }
          },
          engineer: {
            "1": {
              color: "#5585F0",
              desc: "待领取"
            },
            "2": {
              color: "#e58ae8",
              desc: "待指派"
            },
            "3": {
              color: "#00bae8",
              desc: "维修中"
            },
            "4": {
              color: "#02d18a",
              desc: "维修完成"
            },
            "5": {
              color: "#009688",
              desc: "已完成"
            },
            "6": {
              color: "#FF004C",
              desc: "已驳回"
            }
          },
          purchase: {
            "1": {
              color: "rgba(85, 133, 240, 1)",
              desc: "待审批"
            },
            "2": {
              color: "#00d66f",
              desc: "已完成"
            },
            "3": {
              color: "#ec595c",
              desc: "已驳回"
            },
            "4": {
              color: "#C79BDD",
              desc: "已跟进"
            },
            "5": {
              color: "#009688",
              desc: "已转审"
            },
            "6": {
              color: "#ff9800",
              desc: "需付款"
            },
            "7": {
              color: "rgba(85, 133, 240, 1)",
              desc: "付款中"
            },
            "8": {
              color: "#009688",
              desc: "草稿箱"
            },
            "9": {
              color: "#ec595c",
              desc: "已终止"
            },
            "10": {
              color: "#ec78a3",
              desc: "撤销中"
            },
            "11": {
              color: "#ec208a",
              desc: "已撤销"
            }
          },
          todotask: {
            "1": {
              color: "#388def",
              desc: "待接受"
            },
            "2": {
              color: "#28d0e7",
              desc: "跟进中"
            },
            "3": {
              color: "#47deaa",
              desc: "跟进完成"
            },
            "4": {
              color: "#00d35e",
              desc: "已完成"
            },
            "5": {
              color: "#f15698",
              desc: "未接受"
            },
            "6": {
              color: "#7271f1",
              desc: "待指派"
            },
            "7": {
              color: "#f8b12b",
              desc: "上级未接受"
            },
            "8": {
              color: "#f12024",
              desc: "已终止"
            },
            "9": {
              color: "#3353ee",
              desc: "终审人审批"
            }
          },
          clean: {
            "1": {
              color: "#388def",
              desc: "待安排"
            },
            "2": {
              color: "#00bae8",
              desc: "已安排"
            },
            "3": {
              color: "#28d0e7",
              desc: "跟进中"
            },
            "4": {
              color: "#47deaa",
              desc: "已完成"
            },
            "5": {
              color: "#f12024",
              desc: "已拒绝"
            },
            "6": {
              color: "#00bae8",
              desc: "待审批"
            },
            "7": {
              color: "#f11150",
              desc: "已驳回"
            },
          },
          stationery: {
            "1": {
              color: "#388def",
              desc: "待审批"
            },
            "2": {
              color: "#00bae8",
              desc: "待采购"
            },
            "3": {
              color: "#28d0e7",
              desc: "已采购"
            },
            "4": {
              color: "#47deaa",
              desc: "已完成"
            },
            "5": {
              color: "#f12024",
              desc: "已拒绝"
            },
          }
        }
      };
    }
  };
</script>

<style scoped>
  .report-list-status {
    font-size: 0.75rem;
    line-height: 1rem;
    border-width: 1px;
    border-style: solid;
    padding: 1px 4px;
    border-radius: 3px;
    font-weight: normal;
  }
</style>
