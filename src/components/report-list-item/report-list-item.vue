<template>
  <section>
    <div @click="goto" class="report-list-item">
      <report-list-incident :data="info" v-if="type == 1"/>
      <report-list-patrol :data="info" v-if="type == 2"/>
      <report-list-engineer :data="info" v-if="type == 3"/>
      <report-list-sde :data="info" v-if="type == 4"/>
      <report-list-purchase :data="info" v-if="type == 5"/>
      <report-list-todotask :data="info" v-if="type == 6"/>
      <report-list-clean :data="info" v-if="type == 7"/>
      <report-list-stationery :data="info" v-if="type == 8"/>
      <report-list-mom :data="info" v-if="type == 9"/>
      <report-list-eob  :data="info" v-if="type == 10"/>
    </div>
  </section>
</template>

<script>
  import reportListIncident from "./report-list-type/report-list-incident";
  import reportListPatrol from "./report-list-type/report-list-patrol";
  import reportListSde from "./report-list-type/report-list-sde";
  import {getSinglePortItem} from "@/api/getPortList/getPortList";
  import ReportListEngineer from "@/components/report-list-item/report-list-type/report-list-engineer";
  import ReportListPurchase from "@/components/report-list-item/report-list-type/report-list-purchase";
  import ReportListTodotask from "@/components/report-list-item/report-list-type/report-list-todotask";
  import ReportListClean from "@/components/report-list-item/report-list-type/report-list-clean";
  import ReportListStationery from "@/components/report-list-item/report-list-type/report-list-stationery";
  import ReportListMom from "@/components/report-list-item/report-list-type/report-list-mom";
  import ReportListEob from "@/components/report-list-item/report-list-type/report-list-eob";

  export default {
    name: "report-list-item",
    components: {
      ReportListEob,
      ReportListMom,
      ReportListStationery,
      ReportListClean,
      ReportListTodotask,
      ReportListPurchase,
      ReportListEngineer,
      reportListIncident,
      reportListPatrol,
      reportListSde
    },
    props: {
      data: {
        type: null,
        required: true
      }
    },
    data() {
      return {
        info: this.data,
        waitUpdate: false
      };
    },
    computed: {
      type() {
        return this.data ? this.data.port_type * 1 : 0;
      }
    },
    methods: {
      goto() {
        this.waitUpdate = true;
      }
    },
    activated() {
      if (this.waitUpdate) {
        try {
          getSinglePortItem(this.data.id).then(res => {
            this.info = res.data.data[0];
            this.waitUpdate = false;
          })
        } catch (e) {
          console.error(e)
        }

      }
    }

  };
</script>

<style scoped>
  .report-list-item {
    border-bottom: 1px solid rgb(240, 240, 240);
  }
</style>
