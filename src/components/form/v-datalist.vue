<template>
  <div class="v-datalist">
    <slot name="prepend"></slot>
    <div class="position-relative flex-1">
      <v-input @blur="onBlur" @focus="onFocus" v-bind="$attrs" v-model="keyword" v-on="$listeners" class="flex-1"/>
      <section class="options" v-if="showOptions">
        <p class="options-title-wrp" v-if="options_title&&options.length">
          <span :style="{color:options_title_color}" class="options-title">{{options_title}}</span>
          <span @click="closeList" class="close-list">关闭</span>
        </p>
        <a @click="$emit('select:option',item)" class="option-item" v-for="(item,index) in options">
          {{item[text]}}
        </a>
        <p class="nothing" v-if="!options.length&&keyword">{{emptyText}}</p>
      </section>
    </div>

  </div>
</template>

<script>
  import VInput from "@/components/form/v-input";

  var searching;

  export default {
    name: "v-datalist",
    inheritAttrs: false,
    components: {VInput},
    props: {
      value: String,
      // 选项
      options: {
        type: Array,
        default() {
          return []
        }
      },
      // 选项为空时显示的文本
      emptyText: {
        type: String,
        default: "没有相关数据"
      },
      // 显示字段
      text: {
        type: String,
        default: "text"
      },
      // 标题
      options_title: {
        type: String,
      },
      //  选项标题颜色
      options_title_color: {
        type: String,
        default: "#333"
      },
    },
    data() {
      return {
        showOptions: false,
        keyword: ""
      }
    },
    methods: {
      onFocus() {
        if (this.keyword) {
          this.showOptions = true;
        }

      },
      onBlur() {
        setTimeout(() => {
          this.showOptions = false;
        }, 100)
      },
      closeList() {
        this.showOptions = false;
      }
    },
    watch: {
      keyword(value) {
        var _this = this;

        if (value) {
          this.showOptions = true;
        } else {
          this.showOptions = false;
        }

        // 延迟发送值
        clearTimeout(searching);
        searching = setTimeout(() => {
          _this.$emit('send:value', value);
        }, 300);

      },
      value(v){
        this.keyword = v;
      }
    }
  }
</script>

<style scoped>
  .v-datalist {
    /*position: relative;*/
    display: flex;
    align-items: center;
  }

  .options {
    position: absolute;
    padding: 8px 0;
    top: 100%;
    left: 0;
    right: 0;
    box-shadow: 0 8px 12px #ebedf0;
    border-radius: 0 0 6px 6px;
    display: flex;
    flex-direction: column;
    z-index: 99;
    max-height: 300px;
    overflow: auto;
    background-color: #fefefe;
  }

  .option-item {
    color: #666;
    padding: 10px 15px;
    font-size: 0.875rem;
    border-bottom: 1px solid #f2f2f2;
  }

  .option-item:hover {
    background-color: #ebebeb;
  }

  .options-title-wrp {
    padding: 10px 15px;
    display: flex;
    align-items: center;
  }

  .options-title {
    font-size: 0.9rem;
    font-weight: bold;
  }

  .close-list {
    margin-left: auto;
    color: #ff6b78;
    font-size: 0.875rem;
    cursor: pointer;
  }
</style>
