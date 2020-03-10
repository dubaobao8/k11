<!-- 显示头像 + 名字 的组件 -->
<template>
  <div class="v-contact-item">
    <img :src="avatar" class="avatar"/>
    <p class="name">{{username}}</p>

    <v-del-btn @click="$emit('del')" class="erase" v-if="erasable"/>

    <!--<b class="close" @click="$emit('del')" v-if="erasable">-->
    <!--  <i class="fa fa-close"></i>-->
    <!--</b>-->

  </div>
</template>

<script>
  import VDelBtn from "@/components/form/v-del-btn";

  export default {
    name: "v-contact-item",
    components: {VDelBtn},
    props: {
      // 是否显示右上角叉叉
      erasable: {
        type: Boolean,
        default: false
      },
      // 头像
      avatar: String,
      // 名字
      username: String
    }
  };
</script>

<style scoped>
  .v-contact-item {
    display: flex;
    flex-direction: column;
    max-width: 3rem;
    align-items: center;
    position: relative;
  }

  .avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 4px;
    position: relative;
  }

  .avatar::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("~@/assets/default_avatar.png");
    background-size: cover;
  }

  .name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 0.55rem;
    font-size: 0.8rem;
    color: #888;
    width: 100%;
    text-align: center;
    position: relative;
    top: 0;
    width: 4rem;
  }

  .erase {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
  }

  /*.close {*/
  /*  background-color: #333;*/
  /*  width: 1.3rem;*/
  /*  height: 1.3rem;*/
  /*  text-align: center;*/
  /*  line-height: 1.3rem;*/
  /*  border-radius: 50%;*/
  /*  position: absolute;*/
  /*  top: 0;*/
  /*  right: 0;*/
  /*  transform: translate(50%, -50%);*/
  /*}*/
  /*.close > i {*/
  /*  color: #fff;*/
  /*  font-size: 0.8rem;*/
  /*}*/
</style>
