<template>
  <v-list :height="height" @load="onLoad" @refresh="onRefresh" class="list-wrp" ref="list">
    <div @click="onToDetail">
      <!-- 普通报告列表 -->
      <template v-if="listType === 'normal'">
        <div
          :class="{picked:item.isPicked,active:isPickerStatus}"
          @click.capture="onPick(item,$event)"
          class="list-item-wrp"
          v-for="item in list"
        >
          <reportListItem :data="item" :key="Date.now() * Math.random()" />
        </div>
      </template>
      <!-- 草稿箱列表 -->
      <template v-if="listType === 'draft'">
        <div
          :class="{picked:item.isPicked,active:isPickerStatus}"
          @click.capture="onPick(item,$event)"
          class="list-item-wrp"
          v-for="item in list"
        >
          <report-list-item-draft :data="item" :key="Date.now() * Math.random()" />
        </div>
      </template>
    </div>
  </v-list>
</template>

<script>
import request from "@/api";
import bus from "@/js/event";
import VList from "@/components/srcollList/v-list";
import ReportListItem from "@/components/report-list-item/report-list-item";
import ReportListItemDraft from "@/components/report-list-item/report-list-item-draft";

export default {
  name: "v-list-reports",
  components: { ReportListItemDraft, ReportListItem, VList },
  props: {
    url: {
      type: String
    },
    extraParams: {
      type: Object,
      default: () => {}
    },
    height: String,
    listType: {
      type: String,
      default: "normal"
    },
    listKey: {
      type: String,
      default: "list"
    },
    totalKey: {
      type: String,
      default: "page_num"
    },
    pickedList: Array, // 选中的项的id数组
    isPickerStatus: {
      // 是否为多选模式
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      nextPage: 1,
      totalPage: 1
    };
  },
  methods: {
    // 获取数据
    async getData(page) {
      var res = await request.post(this.url, {
        user_id: localStorage.getItem("user_id"),
        page: page,
        ...this.extraParams
      });
      if (res.data.data.list || res.data.data.length > 0) {
        var data = res.data.data;
        return {
          list: data[this.listKey],
          totalPage: data[this.totalKey]
        };
      } 
    },
    //  下拉刷新
    onRefresh() {
      this.getData(1)
        .then(res => {
          this.list = res.list;
          this.totalPage = res.totalPage;
          this.nextPage = 2;
          this.$refs.list.stopRefresh();
          // this.$notify({message: "刷新成功！", background: "#1989fa"});
        })
        .catch(err => {
          console.log(err);
          this.$refs.list.stopRefresh();
          // this.$notify('刷新失败！');
        });
    },
    //  加载更多
    onLoad() {
      if (this.nextPage > this.totalPage) {
        this.$refs.list.stopLoading();
        this.$refs.list.finished();
        return false;
      }
      this.getData(this.nextPage)
        .then(res => {
          if (res.list) {
            this.list = this.list.concat(res.list);
            this.totalPage = res.totalPage;
            this.nextPage++;
            this.$refs.list.stopLoading();
            this.$emit("load");
            if (this.nextPage > this.totalPage) {
              this.$refs.list.finished();
            }
          }
        })
        .catch(err => {
          this.$refs.list.setError();
        });
    },
    // 被选择时
    onPick(item, event) {
      if (!this.isPickerStatus || !Array.isArray(this.pickedList)) {
        return false;
      }
      event.stopPropagation();
      var itemIndex = this.pickedList.indexOf(item.id);
      if (itemIndex === -1) {
        this.pickedList.push(item.id);
        this.$set(item, "isPicked", true);
      } else {
        this.pickedList.splice(itemIndex, 1);
        this.$set(item, "isPicked", false);
      }
    },
    // 取消所有选中
    clearAllPicked() {
      this.list.forEach(item => {
        if (item.isPicked) {
          item.isPicked = false;
        }
      });
      this.pickedList.length = 0;
    },
    // 当点击报告列表时
    onToDetail() {}
  },
  mounted() {
    bus.$on("del_list_item", port_id => {
      var index = this.list.findIndex(value => value.id == port_id);
      this.list.splice(index, 1);
    });
  },
  activated() {
    // if (this.$route.query.refresh === 'true') {
    //   // this.onRefresh();
    //   // location.reload();
    // }
  },
  watch: {
    url(url) {
      this.onRefresh();
    },
    extraParams: {
      handler() {
        this.onRefresh();
      },
      deep: true
    }
  }
};
</script>

<style scoped>
.list-wrp {
  user-select: none;
}

.list-item-wrp {
  position: relative;
  background-color: #fff;
}

.list-item-wrp.active::after {
  display: block;
  position: absolute;
  right: 0.3rem;
  bottom: 0.3rem;
  content: "\F030";
  font: 1.5rem/1 "vant-icon";
  color: #428cff;
  z-index: 9;
}

.list-item-wrp.active.picked {
  background-color: #f2f2f2;
}

.list-item-wrp.active.picked::after {
  content: "\F02F";
  color: #428cff;
}
</style>
