<template>
  <div class="search-component">
    <cube-input
      :clearable="{visible: true, blurHidden: false}"
      class="input-field"
      placeholder="搜索：摘要、内容、状态"
      v-model="filterValue"
    >
      <template v-if="hasFilter" v-slot:prepend>
        <div @click="onSelect" class="status-text">
          {{searchParam.searchText}}
          <i class="fa fa-angle-down sdown"></i>
        </div>
      </template>
    </cube-input>
  </div>
</template>

<script>
import { GetSearchFilter } from "@/api/search/screen";

var inputDelay;
export default {
  name: "v-search",
  props: {
    searchParam: {
      searchStatus: 0,
      searchText: ""
    },
    value: String,
    // 是否需要过滤器
    hasFilter: {
      type: Boolean,
      default: true
    },
    // 筛选的选项
    selection: {
      type: Array,
      default() {
        return [
          {
            text: "全部",
            value: {
              label: "全部",
              value: ""
            }
          },
          {
            text: "选项一",
            value: {
              label: "选项1",
              value: ""
            }
          },
          {
            text: "选项二",
            value: {
              label: "选项2",
              value: ""
            }
          }
        ];
      }
    }
  },
  data() {
    return {
      $_selection: this.selection,
      filterValue: "",
      filterReportType: 0,
      filterReportStatus: 0
    };
  },
  methods: {
    onSelect() {
      if (!this.filterPicker) {
        this.filterPicker = this.$createCascadePicker({
          title: "请选择",
          data: this.$_selection,
          onSelect: (value, index, text) => {
            this.$set(this.searchParam,"searchText",text[0] + " " + text[1])
            this.filterReportType = value[0];
            this.filterReportStatus = value[1];
            this.$emit("select", {
              text: this.filterValue,
              type: this.filterReportType,
              status: this.filterReportStatus
            });
          }
        });
      }
      this.filterPicker.show();
    },
    reset() {
      this.selectedText = this.searchParam.searchText;
      this.filterValue = "";
      this.$emit("select", {
        text: "",
        type: 0,
        status: 0
      });
    }
  },
  watch: {
    filterValue(value) {
      clearTimeout(inputDelay);
      inputDelay = setTimeout(() => {
        this.$emit("select", {
          text: value,
          type: this.filterReportType,
          status: this.filterReportStatus
        });
      }, 300);
    }
  },
  mounted() {
    GetSearchFilter().then(res => {
      let selectionArr = [];
      let arr = [];
      selectionArr = res.data.data.map(item => {
        return {
          value: item.port_type,
          text: item.name,
          children: item.status.map(status => {
            return {
              value: status.id,
              text: status.name
            };
          })
        };
      });
      selectionArr.forEach(item => {
        if (item.value == this.searchParam.searchStatus) {
          arr.push(item);
        }
      });
      this.$_selection = arr;
      // this.$_selection.unshift({
      //   value: 0,
      //   text: "全 部",
      //   children: []
      // })
    });
  }
};
</script>

<style scoped>
.search-component {
  padding: 0.625rem 1rem;
  background-color: #f4f4f4;
  box-sizing: border-box;
  height: 3.5rem;
}

.search-icon {
  padding: 0 0.625rem;
  color: #999;
}

.status-text {
  padding: 0.2rem 0.3rem 0.2rem 0.5rem;
  background-color: #e6e6e6;
  font-size: 0.75rem;
  line-height: 1.5em;
  color: #999;
  border-radius: 2px;
  margin: 0 0 0 6px;
  /*width: 5em;*/
  letter-spacing: 2px;
  text-align: center;
}

.sdown {
  float: right;
  line-height: inherit;
  margin-left: 5px;
}

.search-component .cube-input-field {
  padding: 0.5rem;
  font-size: 0.875rem;
}

.search-component .cube-select {
  line-height: 1em;
}

.input-field {
  line-height: 1.3rem;
}
</style>

<style>
.search-component .cube-input-field {
  padding: 8px;
}
</style>
