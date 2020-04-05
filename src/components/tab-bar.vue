<template>
  <div class="tab-bar-page">
    <template v-for="(item,index) in tabs">
      <section
        :class="item.value==curTab?'crtm':''"
        :key="index"
        @click="changeTab(item.value)"
        class="tab-bar-item"
      >
        <div class="bar-icon-wrp">
          <i :class="item.icon" class="tab-bar-icon">
            <span class="unreadNum"
                  v-if="item.unreadCount">{{item.unreadCount}}
            </span>
          </i>
        </div>

        <span class="tab-bar-name">{{item.label}}</span>
      </section>
    </template>
  </div>
</template>

<script>

  import bus from "@/js/event";
  import {getApprovalUnread} from "@/api/tab-bar/tab-bar";
  import {getItem} from "../util/util";

  export default {
    props: ["curTab"],
    data() {
      return {
        selected: this.curTab,
        tabs: localStorage.getItem("status") == 3?[
          {
            label: "单据",
            value: "apply",
            icon: "fa fa-file-o"
          },
          {
            label: "我的单据",
            value: "mine",
            icon: "fa fa-calendar-o"
          },
          {
            label: "待我审批",
            value: "approval",
            icon: "fa fa-envelope-open-o",
            unreadCount: 0
          },
          {
            label: "待我查阅",
            value: "myNoLookTask",
            icon: "fa fa-calendar-check-o"
          },
          {
            label: "我的审阅",
            value: "myAlLookTask",
            icon: "fa fa-pencil-square-o"
          }
        ]:[
          {
            label: "单据",
            value: "apply",
            icon: "fa fa-file-o"
          },
          {
            label: "我的单据",
            value: "mine",
            icon: "fa fa-calendar-o"
          },
          {
            label: "待我审批",
            value: "approval",
            icon: "fa fa-envelope-open-o",
            unreadCount: 0
          },
          {
            label: "已审批",
            value: "complete",
            icon: "fa fa-calendar-check-o"
          },
          {
            label: "抄送我的",
            value: "copy",
            icon: "fa fa-pencil-square-o"
          }
        ]

        // tabs: [
        //   {
        //     label: "单据",
        //     value: "apply",
        //     icon: "fa fa-file-o"
        //   },
        //   {
        //     label: "我的单据",
        //     value: "mine",
        //     icon: "fa fa-calendar-o"
        //   },
        //   {
        //     label: "待我审批",
        //     value: "approval",
        //     icon: "fa fa-envelope-open-o",
        //     unreadCount: 0
        //   },
        //   {
        //     label: "已审批",
        //     value: "complete",
        //     icon: "fa fa-calendar-check-o"
        //   },
        //   {
        //     label: "抄送我的",
        //     value: "copy",
        //     icon: "fa fa-pencil-square-o"
        //   }
        // ]
      };
    },
    methods: {
      changeTab(e) {
        this.$router.push({
          path: "/" + e,
          query: {
            refresh: "true"
          }
        });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      getUnreadCount() {
        getApprovalUnread(getItem('user_id')).then(res => {
          this.tabs[2].unreadCount = res.data.data;
        })
      }

    },
    mounted() {
      bus.$on('getUnRead', this.getUnreadCount);
      this.getUnreadCount();
    },
    activated() {
      this.getUnreadCount();
    }
  };
</script>

<style scoped>
  .tab-bar-page {
    display: flex;
    /* padding: 8px 0; */
    height: 3rem;
    color: #666;
    background-color: #fbfbfb;
    border-top: 1px solid #ddd;
    max-width: 620px;
    margin: 0 auto;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
  }

  .tab-bar-item {
    display: flex;
    flex: 1 0 0;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    position: relative;
  }

  .tab-bar-icon {
    font-size: 1.2rem;
    margin-bottom: 6px;
    position: relative;
  }

  .tab-bar-name {
    font-size: 0.75rem;
  }

  .bar-icon-wrp {
    height: 1.6rem;
  }

  .unreadNum {
    position: absolute;
    width: 1.2rem;
    height: 1.2rem;
    line-height: 1.2rem;
    border-radius: 50%;
    background-color: #ff425b;
    color: #fff;
    right: -0.8rem;
    top: -0.4rem;
    transform: scale(0.9);
    font-size: 0.7rem;
    text-align: center;
  }
</style>
