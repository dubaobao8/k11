<template>
  <van-pull-refresh :style="{height: height}"
                    @refresh="onRefresh"
                    class="refresh-wrp"
                    ref="pull-refresh"
                    v-model="isRefreshing">
    <van-list :error.sync="isError"
              :finished="isFinished"
              @load="onLoad"
              error-text="加载失败，点击重新加载"
              finished-text="没有更多报告"
              v-model="isLoading">
      <slot>

      </slot>
    </van-list>
  </van-pull-refresh>
</template>

<script>
  export default {
    name: "v-list",
    props: {
      height: String
    },
    data() {
      return {
        isRefreshing: false,
        isLoading: false,
        isFinished: false,
        isError: false
      }
    },
    methods: {
      // 下拉刷新
      onRefresh() {
        this.isRefreshing = true;
        this.$emit('refresh');
      },
      //  上拉加载
      onLoad() {
        this.isLoading = true;
        this.$emit('load');
      },
      // 下拉刷新结束
      stopRefresh() {
        this.isRefreshing = false;
      },
      //  上拉加载结束
      stopLoading() {
        this.isLoading = false;
      },
      //  列表已全部加载完毕
      finished() {
        this.isFinished = true;
      },
      resetFinishedStatus() {
        this.isFinished = false;
      },
      //  加载失败，出错
      setError() {
        this.isError = true;
      }
    },
  }
</script>

<style>
  .refresh-wrp {
    min-height: 100%;
    display: flex;
    flex-direction: column;
  }

  .refresh-wrp .van-pull-refresh__track {
    flex: 1;
  }
</style>
