<template>
  <div class="form-item form-block">
    <p class="input-title">
      {{title}}
      <i class="red-dot" v-if="required"></i>
    </p>

    <div class="approver-list">
      <div class="approver-item" v-for="(item,index) in approver" :key="index">
        <v-contact-item :avatar="item[avatar]" :username="item.username"></v-contact-item>
        <b class="dot3-wrp" v-if="index !== approver.length-1">
          <i class="dot3" v-for="item in 3" :key="item"></i>
        </b>
      </div>
    </div>

  </div>
</template>

<script>
  import vContactItem from "@/components/form/v-contact-item";

  export default {
    name: "v-approver-container",
    props: {
      avatar:{
        type:String,
        default:"avatar"
      },
      title: {
        type: String,
        default: "审批人"
      },
      required: {
        type: Boolean,
        default: false
      },
      approver: Array
    },
    components: {
      vContactItem
    }
  };
</script>

<style src="./form.css"></style>
<style scoped>
  .approver-list {
    margin-top: 15px;
    display: flex;
    flex-wrap: wrap;
  }
  .approver-item {
    position: relative;
    margin-right: 44px;
    margin-bottom: 20px;
  }
  .dot3-wrp {
    position: absolute;
    display: flex;
    justify-content: space-between;
    width: 24px;
    top: 1.35rem;
    left: 100%;
    margin-left: 10px;
  }
  .dot3 {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #ccc;
  }
</style>