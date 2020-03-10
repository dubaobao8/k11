<template>
  <del class="erase" @click="$emit('click')">
    <i class="erase-icon" :style="{backgroundColor:color}"></i>
  </del>
</template>

<script>
  export default {
    name: "v-del-btn",
    props:{
      color:{
        type:String,
        default:"#ff4864"
      }
    },
    data() {
      return {}
    }
  }
</script>

<style scoped>
  .erase{
    display: block;
    padding: 7px;
  }
  .erase-icon{
    width: 1.2rem;
    height: 1.2rem;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .erase-icon::after{
    content: "";
    display: block;
    width: 0.7rem;
    height: 0.7rem;
    background: url(data:image/png;base64,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)
    no-repeat;
    background-size: 100% 100%;
  }
</style>