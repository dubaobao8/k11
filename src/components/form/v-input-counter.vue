<template>
  <div class="form-inline-between form-item v-input-counter">
    <p class="input-title">
      <slot name="label">
        {{title}}
        <i class="red-dot" v-if="required"></i>
      </slot>
    </p>

    <div class="form-inline-right dpfx justify-end">
      <v-counter :max="max" :min="min" v-model="count"/>
    </div>
  </div>
</template>

<script>
  import VCounter from "@/components/common/v-counter";

  export default {
    name: "v-input-counter",
    props: {
      value: Number,
      title: String,
      min: Number,
      max: Number,
      required: Boolean
    },
    model: {
      prop: 'value',
      event: 'change'
    },
    components: {VCounter},
    data() {
      return {
        count: 0
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
    }
  }
</script>

<style scoped src='./form.css'></style>
