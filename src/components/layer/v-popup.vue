<template>
  <div>
    <transition name="fade">
      <div class="popup-wrp" v-if="isShow">
        <section class="popup-mask"></section>
        <transition name="fade-down">
          <section class="popup-container content">
            <slot></slot>
          </section>
        </transition>
      </div>
    </transition>

  </div>
</template>

<script>
  export default {
    name: "v-popup",
    data() {
      return {
        isShow: false
      }
    },
    methods: {
      show() {
        this.isShow = true;
      },
      hide() {
        this.isShow = false;
      }
    },
    watch: {
      isShow: {
        handler(value) {
          document.body.style.overflow = value ? "hidden" : "";
        },
        immediate:true
      }
    }
  }
</script>

<style scoped>
  .popup-wrp {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }

  .popup-mask {
    width: 100%;
    height: 100%;
    position: absolute;
    background-color: #25262d;
    overflow: hidden;
    opacity: 0.4;
  }

  .popup-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
