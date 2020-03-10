<template>
  <div class="d-info-item">
    <p :style="{'min-width': titleWidth}" class="d-info-key">{{title}}</p>
    <p class="d-info-value" v-if="!html">{{value}}</p>
    <p class="d-info-value" v-else v-html="value"></p>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: "d-info-item",
    props: {
      title: String,
      value: null,
      titleWidth: {
        type: String,
        default: "9em"
      },
      html: {
        type: Boolean,
        default: false
      }
    }
  };
</script>

<style scoped>
  .d-info-item {
    display: flex;
    font-size: 0.875rem;
    line-height: 1.3;
    color: #333;
  }

  .d-info-key {
    color: #9b9b9b;
    margin-right: 10px;
    text-align: left;
  }

  .d-info-value {

    flex: 1;
  }
</style>
