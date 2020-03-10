<template>
  <div>
    <section v-for="(item,index) in form.stationery" :key="item.key" class="mb10">
      <v-detail-title :title="'文具' + (index + 1)"
                      :del-text="'删除文具' + (index + 1)"
                      @del="delItem(index)"
                      :showDel="form.stationery.length>1"/>
      <div class="form-group">
        <v-picker title="文具类别"
                  required
                  class="mt20"
                  @select="onSelectStationery(item,index,$event)"
                  right-full
                  remember
                  ref="stationeryPicker"
                  :options="options.stationery"
                  values="goods"
                  text="name"/>
        <v-input-counter title="文具盒数量" required class="mt20 input-counter" v-model="item.number"/>
      </div>
    </section>
    <action-line class="pl10 pr10" @click="addItem">添加文具</action-line>

    <a class="form-submit-block" @click="onSubmit">提交</a>
  </div>
</template>

<script>
  import VPicker from "@/components/form/v-picker";
  import VInputCounter from "@/components/form/v-input-counter";
  import VDetailTitle from "@/components/form/v-detail-title";
  import extend from "@/util/extend";
  import ActionLine from "@/components/form/action-line";
  import request from "@/api";

  const Stationery = function () {
    this.name = "";
    this.number = 0;
    this.key = extend.generateUid();
  };

  export default {
    name: "stationery",
    components: {ActionLine, VDetailTitle, VInputCounter, VPicker},
    data() {
      return {
        form: {
          stationery: [new Stationery()]
        },
        options: {
          stationery: []
        }
      }
    },
    methods: {
      addItem() {
        this.form.stationery.push(new Stationery());
      },
      delItem(index) {
        this.ex.confirm('提示', '确定删除该文具采购吗？').then(res => {
          this.form.stationery.splice(index, 1);
        });
      },
      getStationeryList() {
        request.post('/api/Stationery/ChoosePencil').then(res => {
          let data = res.data.data;
          data.forEach(item => {
            item.name = item.type_name + " " + item.goods;
          });
          this.options.stationery = data;
        })
      },
      onSelectStationery(item, index, value) {
        if (this.form.stationery.some(item => item.name === value)) {
          this.$refs.stationeryPicker[index].clear();
          this.ex.alert('重复', '该商品已被添加！', false);
        }
        item.name = value;
      },
      onSubmit() {
        let form = {
          goods: this.form.stationery
        };
        let incomplete = form.goods.some(item => !item.name || !item.number);
        if (incomplete) {
          this.ex.alert('错误', '请填写完整！', false);
          return false;
        }

        request.post('/api/Stationery/SendReport', form).then(res => {
          this.ex.alert('提交成功', '', true).then(res => {
            this.$router.replace({
              path: '/mine',
              query: {
                tab: 'underway'
              }
            })
          })
        }).catch(err => {
          this.ex.alert('错误', '提交失败！', false)
        })

      }
    },
    mounted() {
      this.getStationeryList();
    }
  }
</script>

<style scoped></style>
