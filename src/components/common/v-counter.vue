<template>
  <div class="counter">
    <a @click="subtract" class="iconfont icon-minus count" :disable="leftDisable"></a>
    <input :value="count" @change="onInput" class="input-field"/>
    <a @click="add" class="iconfont icon-plus count" :disable="rightDisable"></a>
  </div>
</template>

<script>
  export default {
    name: "v-counter",
    props: {
      value: {
        type: Number,
        default: 0
      },
      min: {
        type: [Number, undefined],
        default: 0
      },
      max: Number,
      integer: {
        type: Boolean,
        default: true
      },
      // initValue:Number
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    data() {
      return {
        count: 0
      }
    },
    methods: {
      add() {
        if (this.max !== undefined && this.count >= this.max) {
          return false
        }
        this.count++;
      },
      subtract() {
        if (this.min !== undefined && this.count <= this.min) {
          return false
        }
        this.count--;
      },
      onInput(e) {
        let count = e.currentTarget.value * 1;
        if (!count || isNaN(count)) {
          if (isNaN(count)) {
            this.$toast('请输入数字');
          }
          this.count = 1;
          this.count = 0;
        } else if (this.max !== undefined && count > this.max) {
          this.$toast('输入的值太大，最大值为' + this.max);
          this.count = this.count + 1;
          this.count = this.count - 1;
        } else if (this.min !== undefined && count < this.min) {
          this.$toast('输入的值太小，最小值为' + this.min);
          this.count = this.count + 1;
          this.count = this.count - 1;
        } else {
          if (this.integer) {
            count = Math.round(count)
          }
          this.count = this.count + 1;
          this.count = count;
        }
      },
      reset() {
        this.count = 0;
      }
    },
    watch: {
      'count'(count) {
        this.$emit('change', this.count)
      },
      'value': {
        handler(value) {
          this.count = this.count + 1;
          this.count = value;
        },
        immediate: true
      }
    },
    mounted() {
      if (this.initValue !== undefined) {
        this.count = this.count + 1;
        this.count = this.initValue;
      }
    },
    computed: {
      leftDisable() {
        if (this.min !== undefined) {
          return this.count - 1 < this.min;
        } else {
          return false
        }
      },
      rightDisable() {
        if (this.max !== undefined) {
          return this.count + 1 > this.max;
        } else {
          return false
        }
      }
    }
  }
</script>

<style scoped>
  .counter {
    border: 1px solid #D7DBE5;
    border-radius: 4px;
    display: inline-flex;
    align-items: stretch;
    overflow: hidden;
  }

  .count {
    font-size: 1rem;
    padding: 0.3rem 0.35rem;
    color: #606266;
    background-color: #F5F7FA;
    cursor: pointer;
  }

  .count:active {
    background-color: #edeff2;
  }

  .count[disable]{
    color: #BFC3CB;
    background-color: #F5F7FA;
    cursor: not-allowed;
  }

  .input-field {
    width: 3.5rem;
    text-align: center;
    font-size: 0.875rem;
    color: #777;
    background-color: #fff;
    border: 1px solid #D7DBE5;
    border-top: none;
    border-bottom: none;
  }
</style>
