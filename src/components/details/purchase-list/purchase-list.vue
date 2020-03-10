<template>
  <div class="purchase-list">
    <!-- 表格区域 -->
    <table class="list-content">

      <tr>
        <td colspan="3" class="thead" width="50%">承包商名</td>
        <td colspan="3" width="50%">{{list.contractor}}</td>
      </tr>

      <!--<tr class="thead">-->
      <!--  <td colspan="2">品名</td>-->
      <!--  <td colspan="2">数量</td>-->
      <!--  <td colspan="2">单价</td>-->
      <!--</tr>-->
      <!--<tr :key="index" class="list-body-item" v-for="(item,index) in list.data">-->
      <!--  <td colspan="2">{{item.product_name}}</td>-->
      <!--  <td colspan="2">{{item.number}}</td>-->
      <!--  <td colspan="2">{{item.price}}</td>-->
      <!--</tr>-->
      <!--<tr>-->
      <!--  <td colspan="3" class="thead" width="50%">是否为推荐承包商</td>-->
      <!--  <td colspan="3" width="50%">{{list.recommend==1?'是':'否'}}</td>-->
      <!--</tr>-->
      <tr>
        <td colspan="3" class="thead" width="50%">总价</td>
        <td colspan="3" width="50%">{{list.total_price}}</td>
      </tr>
    </table>
  </div>
</template>

<script>

  export default {
    name: "purchase-list",
    props: {
      list: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .purchase-list {
    /*display: flex;*/
  }

  .list-content {
    width: 100%;
    text-align: center;
    border-collapse: collapse;
  }


  .list-content td{
    padding: 6px 4px;
    border: 1px solid #ebebeb;
    line-height: 1.2;
    font-size: 0.875rem;
    box-sizing: border-box;
  }

  .thead{
    color: #888;
  }
</style>
