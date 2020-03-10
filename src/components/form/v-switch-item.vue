<template>
  <div class="form-inline-between form-item">
    <p class="input-title">
      <slot name="label">
        {{title}}
        <i class="red-dot" v-if="required"></i>
      </slot>
    </p>

    <div class="form-inline-right dpfx justify-end">
      <van-switch :active-color="activeColorRes"
                  :inactive-color="inActiveColorRes"
                  @change="onChange"
                  size="1.5rem"
                  v-model="isChecked"/>
    </div>
  </div>
</template>

<script>
  let typeMap = {
    judge: {
      active: "#07c160",
      inactive: "#ee0a24"
    },
    common: {
      active: "#1989fa",
      inactive: "#f5f5f5"
    }
  };
  export default {
    name: "v-switch-item",
    props: {
      title: String,
      required: Boolean,
      activeColor: {
        type: String
      },
      inactiveColor: {
        type: String
      },
      checked: {
        type: Boolean
      },
      type: {
        type: String,
        default: "common"
      }
    },
    model: {
      event: 'change',
      prop: 'checked'
    },
    data() {
      return {
        isChecked: false
      }
    },
    computed: {
      activeColorRes() {
        if (this.activeColor) {
          return this.activeColor
        } else if (this.type) {
          return typeMap[this.type].active
        }
      },
      inActiveColorRes() {
        if (this.inactiveColor) {
          return this.inactiveColor
        } else if (this.type) {
          return typeMap[this.type].inactive
        }
      }
    },
    methods: {
      onChange(checked) {
        console.log(checked);
        this.$emit('change', checked)
      }
    },
    watch: {
      checked: {
        handler(value) {
          this.isChecked = value;
        },
        immediate: true
      }
    }
  }
</script>

<style scoped>
  .form-item{
    padding: 10px 0px !important;
  }
</style>
<style scoped src='./form.css'></style>
