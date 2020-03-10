<template>
  <div @click="$emit('click')" class="report-wrp">
    <section class="report-left">
      <h3 class="r-title">
        <span class="r-name">
          {{data.title}}
        </span>
        <slot name="status">
          <report-list-status v-if="!data.stateless" :status="data.status" class="r-status" :type="data.type"/>
        </slot>
        <reportListReddot :show="data.read" class="unread"/>
      </h3>

      <p class="r-text" v-for="(item, index) in data.info_list">{{item.key}}：{{item.value}}</p>
    </section>

    <section class="report-right">
      <h5 class="r-date">{{date}}</h5>
      <slot name="center"></slot>
      <slot name="bottom"></slot>
    </section>
  </div>
</template>

<script>
  import {stampToString} from "../../../util/util";
  import ReportListStatus from "@/components/report-list-item/components/report-list-status";
  import ReportListReddot from "@/components/report-list-item/components/report-list-reddot";

  export default {
    name: "report-list-tamplate-common",
    components: {ReportListReddot, ReportListStatus},
    props: {
      data: {
        type: Object,
        default() {
          return {
            title: "",
            type: "",
            status: "1",
            read: false,
            info_list: [{
              key: "",
              value: ""
            },],
            date: ""
          }
        }
      }
    },
    data() {
      return {}
    },
    computed: {
      date() {
        return stampToString(this.data.date, "/")
      }
    }
  }
</script>

<style scoped src="../report-list-item.css"></style>
