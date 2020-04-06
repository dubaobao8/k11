// 校验的判断
let arrStr1 = localStorage.getItem("ruleUserArr1")
let ruleUserArr1 = []
if(arrStr1) {
  ruleUserArr1 = JSON.parse(localStorage.getItem("ruleUserArr1"))
}
let arrStr2 = localStorage.getItem("ruleUserArr2")
let ruleUserArr2 = []
if(arrStr2) {
  ruleUserArr2 = JSON.parse(localStorage.getItem("ruleUserArr2"))
}

let userId = Number(localStorage.getItem("user_id"))
let munuItem1 = {
  name: "所有工程单",
  url: "/completeNew"
}
let munuItem2 = {
  name: "统计",
  url: { path: "/statisticsNew", query: { pageStatus: 3 } }
}
let menuArr = [
  {
    name: "新增单据",
    url: {
      path: "/engineer",
      query: { mode: "release" }
    }
  }, {
    name: "扫一扫",
    handle: "scanQR"
  },
  {
    name: "进行中的单据",
    url: "/engineer_progress"
  },
  {
    name: "已完成的单据",
    url: "/engineer_done"
  }
]
if ((ruleUserArr1 && ruleUserArr1.indexOf(userId) > -1) || localStorage.getItem("status") == 3) {
  menuArr.push(munuItem1)
}
if (ruleUserArr2 && ruleUserArr2.indexOf(userId) > -1 || localStorage.getItem("status") == 3) {
  menuArr.push(munuItem2)
}
// 工单数组
export default [
  {
    title: "取号",
    icon: "fa fa-dot-circle-o",
    color: "#7e8c8d",
    to: { path: "/sde" },
    open: true,
    show: true,
    selection: localStorage.getItem("status") == 3 || (ruleUserArr2 && ruleUserArr2.indexOf(userId) > -1) ? [
      {
        name: "新增单据",
        url: "/sde"
      },
      {
        name: "进行中的单据",
        url: "/takenum_progress"
      },
      {
        name: "已完成的单据",
        url: "/takenum_done"
      },
      {
        name: "统计",
        url: { path: "/statisticsNew", query: { pageStatus: 4 } }
      }
    ] : [
        {
          name: "新增单据",
          url: "/sde"
        },
        {
          name: "进行中的单据",
          url: "/takenum_progress"
        },
        {
          name: "已完成的单据",
          url: "/takenum_done"
        },
        // {
        //   name: "草稿箱",
        //   url: ""
        // }
      ]
  },
  {
    title: "事件报告",
    icon: "fa fa-file-text",
    to: { path: "/report", query: { mode: "release" } },
    color: "#74C4C3",
    open: true,
    show: true,
    selection: localStorage.getItem("status") == 3 || (ruleUserArr2 && ruleUserArr2.indexOf(userId) > -1) ? [
      {
        name: "新增单据",
        url: { path: "/report", query: { mode: "release" } }
      },
      {
        name: "进行中的单据",
        url: "/incident_progress"
      },
      {
        name: "已完成的单据",
        url: "/incident_done"
      },
      {
        name: "草稿箱",
        url: "/incident_draft"
      },
      {
        name: "统计",
        url: { path: "/statisticsNew", query: { pageStatus: 1 } }
      }
    ] : [
        {
          name: "新增单据",
          url: { path: "/report", query: { mode: "release" } }
        },
        {
          name: "进行中的单据",
          url: "/incident_progress"
        },
        {
          name: "已完成的单据",
          url: "/incident_done"
        },
        {
          name: "草稿箱",
          url: "/incident_draft"
        }
      ]
  },
  {
    title: "巡查报告",
    icon: "fa fa-tasks",
    to: { path: "/potrol", query: { mode: "release" } },
    color: "#F1B046",
    open: true,
    show: (function () {
      return ["保安部", "综合部"].indexOf(localStorage.getItem("department")) !== -1
    })(),
    selection: localStorage.getItem("status") == 3 || (ruleUserArr2 && ruleUserArr2.indexOf(userId) > -1) ? [
      {
        name: "新增单据",
        url: { path: "/potrol", query: { mode: "release" } }
      },
      {
        name: "进行中的单据",
        url: "/patrol_progress"
      },
      {
        name: "已完成的单据",
        url: "/patrol_done"
      },
      {
        name: "统计",
        url: { path: "/statisticsNew", query: { pageStatus: 2 } }
      }
    ] : [
        {
          name: "新增单据",
          url: { path: "/potrol", query: { mode: "release" } }
        },
        {
          name: "进行中的单据",
          url: "/patrol_progress"
        },
        {
          name: "已完成的单据",
          url: "/patrol_done"
        },
        // {
        //   name: "草稿箱",
        //   url: ""
        // }
      ]
  },
  {
    title: "工程单",
    icon: "fa fa-paste",
    color: "#79B3F8",
    open: true,
    show: true,
    selection: menuArr
  },
  {
    title: "Profolio",
    icon: "fa fa-id-badge",
    color: "#6bbaff",
    open: true,
    show: true,
    handle: 'profolioEntry'
    // path: "/profolio"
  },
  {
    title: "清洁大做",
    icon: "fa fa-leaf",
    color: "#12d8b4",
    open: true,
    show: (function () {
      return ["物业部", "综合部"].indexOf(localStorage.getItem("department")) !== -1;
    })(),
    selection: [
      {
        name: "发布新任务",
        url: {
          path: "/cleaning",
        }
      },
      {
        name: "处理任务",
        url: "/cleaning_progress"
      },
      {
        name: "清洁日历更新",
        url: "/cleaning_detail"
      }
    ]
  }, {
    title: "To Do Task",
    icon: "fa fa-fire",
    color: "#ff8383",
    show: true,
    open: true,
    selection: localStorage.getItem("status") == 3 || (ruleUserArr2 && ruleUserArr2.indexOf(userId) > -1) ? [
      {
        name: "新增单据",
        url: {
          path: "/todotask",
        }
      },
      {
        name: "进行中的单据",
        url: "/todotask_progress"
      },
      {
        name: "已完成的单据",
        url: "/todotask_done"
      },
      {
        name: "统计",
        url: { path: "/statisticsNew", query: { pageStatus: 6 } }
      }
    ] : [
        {
          name: "新增单据",
          url: {
            path: "/todotask",
          }
        },
        {
          name: "进行中的单据",
          url: "/todotask_progress"
        },
        {
          name: "已完成的单据",
          url: "/todotask_done"
        },
        // {
        //   name: "草稿箱",
        //   url: "/todotask_draft"
        // }
      ]
  },
  {
    title: "采购/报销单",
    icon: "fa fa-gg",
    color: "#ffa66b",
    show: true,
    open: (function () {
      return ["综合部"].indexOf(localStorage.getItem("department")) !== -1;
    })(),
    selection: localStorage.getItem("status") == 3 || (ruleUserArr2 && ruleUserArr2.indexOf(userId) > -1) ? [
      {
        name: "新增单据",
        url: {
          path: "/purchase",
        }
      },
      {
        name: "进行中的单据",
        url: "/purchase_progress"
      },
      {
        name: "已完成的单据",
        url: "/purchase_done"
      },
      {
        name: "草稿箱",
        url: "/purchase_draft"
      },
      {
        name: "统计",
        url: { path: "/statisticsNew", query: { pageStatus: 5 } }
      }
    ] : [
        {
          name: "新增单据",
          url: {
            path: "/purchase",
          }
        },
        {
          name: "进行中的单据",
          url: "/purchase_progress"
        },
        {
          name: "已完成的单据",
          url: "/purchase_done"
        },
        {
          name: "草稿箱",
          url: "/purchase_draft"
        }
      ]
  },

  {
    title: "EOB",
    icon: "fa fa-bandcamp",
    color: "#ff5353",
    show: true,
    open: (function () {
      return ["综合部", "客服部"].indexOf(localStorage.getItem("department")) !== -1;
    })(),
    selection: [
      {
        name: "新增单据",
        url: {
          path: "/eob",
        }
      },
      // {
      //   name: "进行中的单据",
      //   url: "/eob_progress"
      // },
      {
        name: "我的EOB",
        url: "/eob_done"
      }
    ]
  },
  {
    title: "母婴室/物业部巡查",
    icon: "fa fa-child",
    color: "#ff58a4",
    show: true,
    open: true,
    selection: [
      {
        name: "扫一扫新增巡查报告",
        handle: "scanMomInfantInit"
      },
      {
        name: "巡查报告记录",
        url: "/mom_record"
      }
    ]
  },
  {
    title: "文具采购",
    icon: "fa fa-book",
    color: "#059EF9",
    show: true,
    open: true,
    selection: localStorage.getItem("status") == 3 || (ruleUserArr2 && ruleUserArr2.indexOf(userId) > -1) ? [
      {
        name: "新增文具采购",
        url: "/stationery",
      },
      {
        name: "进行中的文具采购",
        url: "/stationery_progress"
      },
      {
        name: "已完成的文具采购",
        url: "/stationery_done"
      },
      {
        name: "统计",
        url: { path: "/statisticsNew", query: { pageStatus: 8 } }
      }
    ] : [
        {
          name: "新增文具采购",
          url: "/stationery",
        },
        {
          name: "进行中的文具采购",
          url: "/stationery_progress"
        },
        {
          name: "已完成的文具采购",
          url: "/stationery_done"
        }
      ]
  }
]
