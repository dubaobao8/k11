<template>
  <div class="form-item" :class="{'right-full':rightFull}">
    <div @click="showPicker" class=" form-inline-between">
      <p :style="leftStyle" class="input-title form-inline-left">
        {{title}}
        <i class="red-dot" v-if="required"></i>
      </p>

      <div :style="rightStyle" class="form-inline-right picker-right">
        <span class="placeholder" v-if="!$displayText">{{placeholder}}</span>
        <span v-else v-html="$displayText"></span>
      </div>
    </div>

    <!-- 多选选择器开始 -->
    <cube-popup
      :maskClosable="true"
      position="bottom"
      ref="multiPicker"
      type="multi-picker"
      v-if="type === 'multi'"
    >
      <div class="multi-picker-action">
        <span @click="hideMultiplePicker" class="multi-picker-cancel">取消</span>
        <span class="multi-picker-title">请选择</span>
        <span @click="confirmMultiplePicker" class="multi-picker-confirm">确定</span>
      </div>
      <div class="multi-pickerp">
        <cube-scroll class="multi-picker-limit">
          <cube-checkbox-group :options="multi_picker_options" v-model="multi_value"/>
        </cube-scroll>
      </div>
    </cube-popup>
    <!-- 多选选择器结束 -->
  </div>
</template>

<script>
  var pickerHandle = {
    // 单选单列
    radio: "showRadioPicker",
    // 多列选择器
    multiCol: "showMultiColPicker",
    // 多选
    multi: "showMultiplePicker",
    // 日期事件
    datetime: "showDateTimePicker",
    // 联级选择器
    cascade: "showCascadePicker",
    // 时间选择器
    time: 'showTimePicker'
  };

  const pickerInstanceName = {
    radio: "radio_picker",
    multiCol: "multiColPicker",
    datetime: "datatimePicker",
    cascade: "cascadePicker",
    time: 'timePicker'
  };

  import {stampToString} from "../../util/util";

  export default {
    name: "v-picker",
    model: {
      prop: "value",
      event: "select"
    },
    props: {
      values: {
        type: String,
        default: "value"
      },
      text: {
        type: String,
        default: "text"
      },
      // 选择器的类型，默认单选
      type: {
        type: String,
        default: "radio",
        validator(value) {
          return ["radio", "multiCol", "multi", "datetime", "cascade", 'time'].indexOf(value) !== -1;
        }
      },
      // 值
      value: null,
      // 外部指定选择后显示的文本内容
      displayText: null,
      // 预选择的文本
      pDisplayText: null,
      // 选择器的标题
      title: {
        type: String,
        default: "请选择"
      },
      // 选择器占位文本
      placeholder: {
        type: String,
        default: "请选择..."
      },
      // 是否必选
      required: {
        type: Boolean,
        default: false
      },
      // 是否只读
      readonly: {
        type: Boolean,
        dafault: false,
      },
      // 不可更改
      irrevocable: {
        type: Boolean,
        dafault: false,
      },
      // 选择器的选项
      options: {
        type: Array,
        default: function () {
          return [];
        }
      },
      // 当为日期选择器时可用，是否显示时间
      showTime: {
        type: Boolean,
        default: false
      },
      // 联级选择器是否异步
      cascadeAsync: {
        type: Boolean,
        default: false
      },
      // 日期起始
      dateStart: {
        type: null,
        // default() {
        //   return new Date()
        // }
      },
      // 日期截至
      dateEnd: {
        type: null,
        // default() {
        //   return new Date(2099, 1, 1)
        // }
      },
      leftStyle: String,
      rightStyle: String,
      rightFull: Boolean, // 样式：右侧的内容占满。默认五五开
      remember: { // 是否记住上次的选项
        type: Boolean,
        default: false
      },
      autoTime:{
        type:Boolean,
        default:false
      }
    },
    data() {
      return {
        multi_value: [],
        // 选择后默认显示的文本
        vDisplayText: "",
        cascadeIndexes: [0, 0, 0],
        // 当前选中的日期时间
        curSelectedDate: null
      };
    },
    computed: {
      multi_picker_options() {
        return this.options.map(ele => {
          return {
            label: ele[this.text],
            value: ele[this.values]
          };
        });
      },
      /**
       * 最终显示的文本
       * 外部指定的文本 > 选择后默认显示的文本 > 预选择的文本
       */
      $displayText() {
        if (this.displayText) {
          return this.displayText;
        } else if (this.vDisplayText) {
          return this.vDisplayText;
        } else {
          return this.pDisplayText;
        }
      }
    },
    methods: {
      showPicker() {
        this.$emit('click');
        if (this.readonly) {
          return false;
        }

        if (this.irrevocable && !!this.$displayText) {
          this.$toast('选择后不可修改！');
          return false
        }

        this[pickerHandle[this.type]]();
      },
      // 单列单选选择器
      showRadioPicker() {
        let remember = this.remember;
        let _this = this;
        if (remember) {
          if (!_this.radio_picker) {
            setPicker();
          }
        } else {
          setPicker();
        }

        function setPicker() {
          _this.radio_picker = _this.$createPicker({
            title: _this.title,
            data: [_this.options],
            alias: {
              value: _this.values,
              text: _this.text
            },
            onSelect: (value, index, text) => {
              _this.vDisplayText = text[0];
              if (_this.values === "index") {
                _this.$emit("select", index);
                return;
              }
              // 只返回选择的值value
              _this.$emit("select", value[0]);
              // 返回所有的信息
              _this.$emit("select:allData", {value, index, text})
            }
          });
        }


        this.radio_picker.show();
      },

      // 多列选择器
      showMultiColPicker() {
        if (!this.multiColPicker) {
          this.multiColPicker = this.$createPicker({
            title: this.title,
            data: this.options,
            alias: {
              value: this.values,
              text: this.text
            },
            onSelect: (value, index, text) => {
              this.vDisplayText = text.join(' ');
              this.$emit("select", value);
            }
          });
        }

        this.multiColPicker.show();
      },


      // 清除选择器的内容
      clear() {
        this.vDisplayText = "";
      },

      // 显示多选选择器
      showMultiplePicker() {
        this.$refs.multiPicker.show();
        if (this.type === "multi") {
          this.multi_value = Array.isArray(this.value) ? this.value : [];
        }
      },
      // 关闭多选选择器
      hideMultiplePicker() {
        this.$refs.multiPicker.hide();
      },
      // 多选选择器提交
      confirmMultiplePicker() {
        this.$emit("select", this.multi_value);
        this.hideMultiplePicker();
      },

      // 日期时间选择器
      showDateTimePicker() {
        var columnCount = this.showTime ? 5 : 3;
        // if (!this.datatimePicker) {
        this.datatimePicker = this.$createDatePicker({
          title: this.title,
          min: this.dateStart || new Date(2010, 1, 1),
          max: this.dateEnd || new Date(2099, 1, 1),
          value: this.curSelectedDate || this.dateEnd || new Date(),
          columnCount: columnCount,
          format: {
            year: "YYYY年",
            month: "M月",
            date: "D日",
            hour: "hh时",
            minute: "mm分",
            second: "ss秒"
          },
          onSelect: (date, value, text) => {
            var stamp = date.getTime();
            this.vDisplayText = this.showTime ? stampToString(stamp, "/", true) : stampToString(stamp, "/");
            this.$emit("select", Math.floor(stamp / 1000));
            this.curSelectedDate = date;
            this.$emit("select:allData", {date, value, text});
          }
        });
        // }
        this.datatimePicker.show();
      },

      // 时间选择器
      showTimePicker() {
        let data = [[], []];
        for (let i = 0; i <= 23; i++) {
          data[0].push({
            text: (i < 10 ? "0" + i : i + "") + "点",
            value: (i < 10 ? "0" + i : i + "")
          })
        }
        for (let i = 0; i <= 59; i++) {
          data[1].push({
            text: (i < 10 ? "0" + i : i + "") + "分",
            value: (i < 10 ? "0" + i : i + "")
          })
        }

        if (!this.timePicker) {
          this.timePicker = this.$createPicker({
            title: this.title,
            data: data,
            selectedIndex: [new Date().getHours(), new Date().getMinutes()],
            onSelect: (value, index, text) => {
              this.vDisplayText = value.join(':');
              this.$emit("select", value.join(':'));
            }
          });
        }

        this.timePicker.show();
      },

      // 联级选择器
      showCascadePicker() {
        if (!this.cascadePicker) {
          this.cascadePicker = this.$createCascadePicker({
            title: this.title,
            data: this.options,
            async: this.cascadeAsync,
            alias: {
              value: this.values,
              text: this.text
            },
            onSelect: (value, index, text) => {
              if (value.some(item => !item)) {
                return false
              }
              this.vDisplayText = text.join(' ');
              this.$emit("select", value);
              this.$emit("select:allData", {value, index, text});
            },
            onChange: (index, selectedIndex) => {
              this.cascadeIndexes[index] = selectedIndex;
              this.$emit('change', {index, selectedIndex, cascadeIndexes: this.cascadeIndexes})
            }

          });
        }
        this.cascadePicker.show();
      },

      // 设置显示的文本内容
      setText(value) {
        this.vDisplayText = value;
      }
    },
    watch: {
      value: {
        handler: function (val, old) {
          if (this.type === "multi") {
            this.multi_value = Array.isArray(val) ? val : [];
          }
        },
        deep: true,
        immediate: true
      },
      options: {
        handler: function (val) {
          let instenceName = pickerInstanceName[this.type];
          this[instenceName] && this[instenceName].setData(val);
        }
      }

    },
    filters: {
      stampToString(stamp) {
        return stampToString(stamp, "/");
      }
    },
    mounted() {
      if (this.autoTime && this.type === 'time'){
        let date = new Date();
        let value = [date.getHours(),date.getMinutes()]
        this.vDisplayText = value.join(':');
        this.$emit("select", value.join(':'));
      }
    }
  };
</script>

<style scoped>
  .multi-picker-action {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
  }

  .multi-picker-title {
    flex: 1;
    font-size: 18px;
    text-align: center;
  }

  .multi-picker-cancel {
    color: #999;
  }

  .multi-picker-confirm {
    color: #5585f0;
  }

  .multi-picker-cancel,
  .multi-picker-confirm {
    padding: 0 16px;
    font-size: 14px;
  }

  .multi-picker-warp {
    background-color: #fff;
  }

  .multi-picker-limit {
    height: 200px;
  }

</style>
<style scoped src="./form.css"></style>

<style scoped>

</style>
