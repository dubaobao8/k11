import Vue from "vue";
import Router from "vue-router";
import apply from "./views/apply/apply.vue";
import mine from "./views/mine/mine.vue";
import approval from "./views/approval/approval.vue";
import copy from "./views/copy/copy.vue";
import report from "./views/apply/initiate/report.vue";
import detail from "./views/details/detail.vue";
import potrol from "./views/apply/initiate/potrol.vue";
import engineer from "./views/apply/initiate/engineer.vue";
import eng_detail from "@/views/details/eng_detail.vue";
import pot_detail from "./views/details/pot_detail.vue";
import complete from "./views/complete/complete.vue";
import completeNew from "./views/completeNew/completeNew";
import sde from "./views/apply/initiate/sde";
import sde_detail from "./views/details/sde_detail.vue";
import statistics from "./views/statistics/statistics.vue";

Vue.use(Router);

var router = new Router({
  // mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/test",
      name: "/test",
      component: () => import('@/components/report-list-item/report-list-type/report-list-engineer.vue'),
      meta: {
        title: "test"
      }
    },
    {
      path: "/statistics",
      name: "statistics",
      component: statistics,
      meta: {
        title: "统计",
        keepAlive: true,
        backgroundColor: "#f2f2f2"
      }
    },
    {
      path: "/",
      name: "apply",
      component: apply,
      alias: "/apply",
      meta: {
        title: "发起申请",
        backgroundColor: "#f2f2f2"
      }
    },
    {
      path: "/mine",
      name: "mine",
      component: mine,
      meta: {
        title: "我的申请",
        keepAlive: true
      }
    },
    {
      path: "/approval",
      name: "approval",
      component: approval,
      meta: {
        title: "待我审批",
        keepAlive: true
      }
    },
    {
      path: "/complete",
      name: "complete",
      component: complete,
      meta: {
        title: "已审批",
        keepAlive: true
      }
    },
    {
      path: "/completeNew",
      name: "completeNew",
      component: completeNew,
      meta: {
        title: "所有工程单",
        keepAlive: true
      }
    },
    {
      path: "/copy",
      name: "copy",
      component: copy,
      meta: {
        title: "抄送我的",
        keepAlive: true
      }
    },
    {
      path: "/report",
      name: "report",
      component: report,
      meta: {
        title: "新建事件报告",
        backgroundColor: "#f2f2f2"
      }
    },
    {
      path: "/potrol",
      name: "potrol",
      component: potrol,
      meta: {
        title: "新建巡查报告",
        backgroundColor: "#f2f2f2"
      }
    },
    {
      path: "/engineer",
      name: "engineer",
      component: engineer,
      meta: {
        title: "新建工程单",
        backgroundColor: "#f2f2f2"
      }
    },

    {
      path: "/detail/:id",
      name: "detail",
      component: detail,
      meta: {
        title: "事件报告详情",
        keepAlive: true
      }
    },
    {
      path: "/pot_detail/:id",
      name: "pot_detail",
      component: pot_detail,
      meta: {
        title: "巡查报告详情",
        keepAlive: true
      }
    },
    {
      path: "/eng_detail/:id",
      name: "eng_detail",
      component: eng_detail,
      meta: {
        title: "工程单详情",
        keepAlive: true,
        backgroundColor: "#fff"
      }
    },

    {
      path: "/sde",
      name: "sde",
      component: sde,
      meta: {
        title: "取号",
        backgroundColor: "#f2f2f2"
      }
    },
    {
      path: "/sde_detail/:id",
      name: "sde_detail",
      component: sde_detail,
      meta: {
        title: "取号详情",
        backgroundColor: "#fff",
        keepAlive: true
      }
    }, {
      path: "/purchase",
      name: "purchase",
      component: () => import('@/views/apply/initiate/purchase'),
      meta: {
        title: "采购/一般费用申请表",
        backgroundColor: "#f2f2f2"
      }
    }, {
      path: "/purchase_detail/:id",
      name: "purchase_detail",
      component: () => import('@/views/details/purchase_detail'),
      meta: {
        title: "采购/一般费用申请表明细",
        backgroundColor: "#fff",
      }
    }, {
      path: "/engineer_progress",
      name: "engineer_progress",
      component: () => import('@/views/apply/progress/engineer_progress'),
      meta: {
        title: "进行中的工程单",
        backgroundColor: "#fff",
      }
    }, {
      path: "/engineer_done",
      name: "engineer_done",
      component: () => import('@/views/apply/done/engineer_done'),
      meta: {
        title: "已完成的工程单",
        backgroundColor: "#fff",
      }
    }, {
      path: "/engineer_draft",
      name: "engineer_draft",
      component: () => import('@/views/apply/draft/engineer_draft'),
      meta: {
        title: "工程单草稿箱",
        backgroundColor: "#fff",
      }
    }, {
      path: "/purchase_progress",
      name: "purchase_progress",
      component: () => import('@/views/apply/progress/purchase_progress'),
      meta: {
        title: "进行中的采购/报销单",
        backgroundColor: "#fff",
      }
    }, {
      path: "/purchase_done",
      name: "purchase_done",
      component: () => import('@/views/apply/done/purchase_done'),
      meta: {
        title: "已完成的采购/报销单",
        backgroundColor: "#fff",
      }
    }, {
      path: "/purchase_draft",
      name: "purchase_draft",
      component: () => import('@/views/apply/draft/purchase_draft'),
      meta: {
        title: "采购/报销单草稿箱",
        backgroundColor: "#fff",
      }
    }, {
      path: "/incident_progress",
      name: "incident_progress",
      component: () => import('@/views/apply/progress/incident_progress'),
      meta: {
        title: "事件报告进行中",
        backgroundColor: "#fff",
      }
    }, {
      path: "/incident_done",
      name: "incident_done",
      component: () => import('@/views/apply/done/incident_done'),
      meta: {
        title: "事件报告已完成",
        backgroundColor: "#fff",
      }
    }, {
      path: "/patrol_progress",
      name: "patrol_progress",
      component: () => import('@/views/apply/progress/patrol_progress'),
      meta: {
        title: "巡查报告进行中",
        backgroundColor: "#fff",
      }
    }, {
      path: "/patrol_done",
      name: "patrol_done",
      component: () => import('@/views/apply/done/patrol_done'),
      meta: {
        title: "巡查报告已完成",
        backgroundColor: "#fff",
      }
    }, {
      path: "/takenum_progress",
      name: "takenum_progress",
      component: () => import('@/views/apply/progress/takenum_progress'),
      meta: {
        title: "进行中的取号",
        backgroundColor: "#fff",
      }
    }, {
      path: "/takenum_done",
      name: "takenum_done",
      component: () => import('@/views/apply/done/takenum_done'),
      meta: {
        title: "已完成的取号",
        backgroundColor: "#fff",
      }
    }, {
      path: "/profolio",
      name: "profolio",
      component: () => import('@/views/apply/initiate/profolio'),
      meta: {
        title: "Profolio",
        backgroundColor: "#fff",
      }
    }, {
      path: "/profolio_detail/:id",
      name: "profolio_detail",
      component: () => import('@/views/details/profolio_detail'),
      meta: {
        title: "Profolio",
        backgroundColor: "#fff",
      }
    }, {
      path: "/statistics",
      name: "statistics",
      component: () => import('@/views/apply/initiate/statistics'),
      meta: {
        title: "SDE报告统计",
        backgroundColor: "#fefeff",
      }
    }, {
      path: "/todotask",
      name: "todotask",
      component: () => import('@/views/apply/initiate/todotask'),
      meta: {
        title: "To Do Task",
        backgroundColor: "#f2f2f2",
      }
    }, {
      path: "/todotask_progress",
      name: "todotask_progress",
      component: () => import('@/views/apply/progress/todotask_progress'),
      meta: {
        title: "进行中的To Do Task",
        backgroundColor: "#fff",
      }
    }, {
      path: "/todotask_done",
      name: "todotask_done",
      component: () => import('@/views/apply/done/todotask_done'),
      meta: {
        title: "已完成的To Do Task",
        backgroundColor: "#fff",
      }
    }, {
      path: "/todotask_detail/:id",
      name: "todotask_detail",
      component: () => import('@/views/details/todotask_detail'),
      meta: {
        title: "To Do Task详情",
        backgroundColor: "#fff",
      }
    }, {
      path: "/cleaning",
      name: "cleaning",
      component: () => import('@/views/apply/initiate/cleaning'),
      meta: {
        title: "新建清洁大做",
        backgroundColor: "#f2f2f2",
      }
    }, {
      path: "/cleaning_detail",
      name: "cleaning_detail",
      component: () => import('@/views/details/cleaning_detail'),
      meta: {
        title: "清洁大做详情",
        backgroundColor: "#fff",
      }
    }, {
      path: "/incident_draft",
      name: "incident_draft",
      component: () => import('@/views/apply/draft/incident_draft'),
      meta: {
        title: "事件报告草稿箱",
        backgroundColor: "#fff",
      }
    }, {
      path: "/eob",
      name: "eob",
      component: () => import('@/views/apply/initiate/eob'),
      meta: {
        title: "新建EOB",
        backgroundColor: "#f2f2f2",
      }
    }, {
      path: "/eob_done",
      name: "eob_done",
      component: () => import('@/views/apply/done/eob_done'),
      meta: {
        title: "我的EOB",
        backgroundColor: "#fff",
      }
    }, {
      path: "/eob_detail/:id",
      name: "eob_detail",
      component: () => import('@/views/details/eob_detail'),
      meta: {
        title: "EOB详情",
        backgroundColor: "#fff",
      }
    }, {
      path: "/cleaning_progress",
      name: "cleaning_progress",
      component: () => import('@/views/apply/progress/cleaning_progress'),
      meta: {
        title: "进行中的清洁大做",
        backgroundColor: "#fff",
      }
    }, {
      path: "/cleaning_done",
      name: "cleaning_done",
      component: () => import('@/views/apply/done/cleaning_done'),
      meta: {
        title: "已完成的清洁大做",
        backgroundColor: "#fff",
      }
    }, {
      path: "/mom",
      name: "mom",
      component: () => import('@/views/apply/initiate/mom'),
      meta: {
        title: "新建母婴室巡查报告",
        backgroundColor: "#f2f2f2",
      }
    }, {
      path: "/mom_detail/:id",
      name: "mom_detail",
      component: () => import('@/views/details/mom_detail'),
      meta: {
        title: "母婴室巡查报告详情",
        backgroundColor: "#fff",
      }
    }, {
      path: "/stationery",
      name: "stationery",
      component: () => import('@/views/apply/initiate/stationery'),
      meta: {
        title: "新增文具采购",
        backgroundColor: "#f2f2f2",
      }
    }, {
      path: "/stationery_progress",
      name: "stationery_progress",
      component: () => import('@/views/apply/progress/stationery_progress'),
      meta: {
        title: "进行中的文具采购",
      }
    }, {
      path: "/stationery_done",
      name: "stationery_done",
      component: () => import('@/views/apply/done/stationery_done'),
      meta: {
        title: "已完成的文具采购",
      }
    }, {
      path: "/stationery_detail/:id",
      name: "stationery_detail",
      component: () => import('@/views/details/stationery-detail'),
      meta: {
        title: "文具采购详情",
        backgroundColor: "#fff",
      }
    }, {
      path: "/mom_record",
      name: "mom_record",
      component: () => import('@/views/apply/done/mom_done'),
      meta: {
        title: "母婴室巡查报告记录",
        backgroundColor: "#fff",
      }
    }
  ]
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  if (to.meta.backgroundColor) {
    document.documentElement.style.backgroundColor = to.meta.backgroundColor;
    document.body.style.backgroundColor = to.meta.backgroundColor;
  } else {
    document.documentElement.style.backgroundColor = null;
  }
  next();
});

export default router;
