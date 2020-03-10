<template>
  <div :class="[type === 'textarea'?'form-block':'form-inline-between']" class="form-item" @click="$emit('click')">
    <p :class="{'form-inline-left':type !== 'textarea'}" class="input-title">
      <slot name="label">
        {{title}}
        <i class="red-dot" v-if="required"></i>
      </slot>
    </p>
    <input
      :max="max"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :readonly="readonly"
      :type="type"
      :value="local_value"
      @blur="$emit('blur')"
      @compositionend="composition = false"
      @compositionstart="composition = true"
      @focus="$emit('focus')"
      @input="onInput($event.currentTarget.value,$event)"
      @paste="onPaste"
      @select="onSelect"
      @click="onClick"
      :class="{'cr-grey':readonly}"
      class="input-field-inline form-inline-right"
      v-if="type !== 'textarea'"
    />

    <textarea
      :maxlength="maxlength"
      :placeholder="placeholder"
      :readonly="readonly"
      :style="{'height':textareaHeight}"
      :value="local_value"
      @blur="$emit('blur')"
      @compositionend="composition = false"
      @compositionstart="composition = true"
      @focus="$emit('focus')"
      @input="onInput($event.currentTarget.value,$event)"
      @paste="onPaste"
      @select="onSelect"
      @click="onClick"
      class="mt15 textarea input-textarea"
      v-else
    />

    <!--<cube-textarea-->
    <!--  :autoExpand="false"-->
    <!--  :maxlength="maxlength"-->
    <!--  :placeholder="placeholder"-->
    <!--  :readonly="readonly"-->
    <!--  :value="local_value"-->
    <!--  @blur="$emit('blur')"-->
    <!--  @focus="$emit('focus')"-->
    <!--  @input="onInput($event)"-->
    <!--  @paste="onPaste"-->
    <!--  class="mt15 textarea"-->
    <!--/>-->

    <slot name="append">

    </slot>
  </div>
</template>

<script>
  export default {
    name: "v-input",
    props: {
      value: [Number, String],
      type: {
        type: String,
        default: "text"
      },
      title: {
        type: String
      },
      placeholder: {
        type: String,
        default: "请输入..."
      },
      readonly: {
        type: Boolean,
        default: false
      },
      max: {
        type: [Number, String]
      },
      maxlength: {
        type: [Number, String],
        default: 300
      },
      required: {
        type: Boolean,
        default: false
      },
      // 不可修改
      irrevocable: {
        type: Boolean,
        default: false
      },
      textareaHeight: String
    },
    model: {
      prop: "value",
      event: "input"
    },
    data() {
      return {
        local_value: "",
        composition: false
      }
    },
    methods: {
      onInput(value,e) {
        let old = this.local_value;
        // console.log(old,value,value.indexOf(old))

        if (this.irrevocable && !this.composition && (value.indexOf(old) !== 0 || value.toString().length <= old.toString().length)) {
          this.local_value = old + " ";
          this.local_value = old;
          return false
        }

        this.local_value = value;
        this.$emit('input', this.local_value);

      },

      onPaste(e) {
        if (this.irrevocable) {
          e.preventDefault();
        }
      },
      onSelect(e){
        // if (this.irrevocable) {
        //   let input = e.currentTarget;
        //   e.preventDefault();
        //   input.selectionStart = input.selectionEnd = input.value.length;
        // }
      },
      onClick(e){
        // if (this.irrevocable) {
        //   let input = e.currentTarget;
        //   e.preventDefault();
        //   input.selectionStart = input.selectionEnd = input.value.length;
        // }
      }
    },
    watch: {
      'value': {
        handler(value) {
          if (value === undefined || value === null) {
            this.local_value = "";
          }else {
            this.local_value = value;
          }
        },
        immediate: true
      }
    }
  };
</script>

<style scoped>
  .cube-textarea-wrapper::after {
    border: 1px solid #ccc;
  }

  .cube-textarea_active::after {
    border: 1px solid #5585f0 !important;
  }

  .input-textarea {
    width: 100%;
    height: 80px;
    text-align: left;
    padding: 10px;
    box-sizing: border-box;
    font-size: 100%;
    line-height: inherit;
    color: #666;
    background-color: #fff;
    border-radius: 2px;
    resize: none;
    outline: none;
    font-weight: normal;
    border: 1px solid #E5E5E5;
    word-break: break-all;
  }

  .input-textarea:focus {
    border: 1px solid #5585f0;
  }

</style>
<style scoped src='./form.css'></style>
