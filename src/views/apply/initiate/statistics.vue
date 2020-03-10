<template>
  <div>
    <section class="dep-item" v-for="(type,type_index) in info">
      <h1 class="table-title">SDE{{type.type}}统计</h1>
      <table class="statistics-table">
        <thead>
        <tr>
          <th>部门</th>
          <th>昨日新增</th>
          <th>本月新增</th>
          <th>今年新增</th>
          <th>平均分</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(dep,dep_index) in type.list">
          <td>{{dep.department}}</td>
          <td>{{dep.day_count}}</td>
          <td>{{dep.mon_count}}</td>
          <td>{{dep.year_count}}</td>
          <td>{{dep.average}}</td>
        </tr>
        </tbody>
      </table>
    </section>

    <div class="refresh" @click="refresh">
      <i class="fa fa-repeat"></i>
    </div>
  </div>
</template>

<script>
  import {GetReportStatistics} from "@/api/initiate/statistics";

  export default {
    name: "statistics",
    data() {
      return {
        info: []
      }
    },
    methods:{
      refresh(){
        this.$toast({
          duration:1000,
          message:'正在更新数据...'
        });
        this.getData().then(res=>{
          this.$notify({
            type: 'primary',
            message:'数据已更新'
          });
        });
      },
      async getData(){
        return await GetReportStatistics().then(res => {
          this.info = res.data.data;
        })
      }
    },
    mounted() {
      this.getData();
    }
  }
</script>

<style scoped>
  .dep-item {
    margin-top: 2rem;
    margin-left: 0.9rem;
    margin-right: 0.9rem;
  }

  .table-title {
    font-size: 1rem;
    font-weight: bold;
    color: #585a78;
    text-align: center;
  }

  .statistics-table {
    width: 100%;
    font-size: 0.875rem;
    text-align: center;
  }

  /*.statistics-table td, .statistics-table th {*/

  /*}*/

  .statistics-table tr {
    border-bottom: 1px solid #ebeef5;
  }

  .statistics-table th {
    color: #909399;
    padding: 0.7rem 0.4rem;
  }

  .statistics-table td {
    color: #808080;
    padding: 0.7rem 0.4rem;
  }

  .refresh {
    cursor: pointer;
    color: #fff;
    /*padding: 0.5rem 0.8rem;*/
    background: linear-gradient(135deg, #7adfff, #1e7cfb);
    box-shadow: 0 3px 13px #54cdff;
    position: fixed;
    right: 1.875rem;
    bottom: 6.875rem;
    border-radius: 50%;
    width: 3rem;
    height: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
  }

</style>
