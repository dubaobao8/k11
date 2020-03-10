<template>
  <p class="dpfx fxjbw v-detail-title">
    <span class="form-detail-title-bold">{{title}}</span>
    <!-- 删除明细按钮 -->
    <span @click="$emit('del')" class="fs08" style="color: #ff4e69;" v-if="showDel">
      <i class="fa fa-minus-square mr5"></i>{{delText}}
    </span>
  </p>
</template>

<script>
  export default {
    name: "v-detail-title",
    props:{
      title:String,
      delText:String,
      showDel:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .v-detail-title{
    padding: 10px 15px;
  }
</style>
