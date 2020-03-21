<template>
  <div>
    <section :key="item.uid" class="" v-for="(item,index) in task">
      <p class="ml15 mr15 mt15 mb10 dpfx fxjbw fxac">
        <span class="fw-b" style="font-size: 1.04rem;">任务{{index+1}}</span>
        <span @click="delTask(index)" class="fs08 cr-red pointer" v-if="index !== 0">
          <i class="fa fa-minus-square"></i>
          <span class="ml5">删除任务{{index+1}}</span>
        </span>
      </p>
      <div class="form-group">
        <v-input class="" placeholder="请填写任务名称" required title="任务名称" v-model="item.title"/>
        <v-picker :options="options.cleanType"
                  @select:allData="onSelcteType(item,$event,index)"
                  required
                  text="name"
                  remember
                  title="工作类型"
                  values="id"/>
        <v-picker :options="item.contentOptions"
                  ref="clean_content"
                  required
                  text="name"
                  title="工作内容"
                  v-model="item.clean_content"
                  values="name"/>
        <v-input-counter required title="任务总次数" v-model="item.count"/>
        <v-picker required title="开始时间" :dateStart="new Date()" type="datetime" v-model="item.start_time"/>
        <v-picker required title="结束时间" :dateStart="new Date()" type="datetime" v-model="item.end_time"/>
      </div>
    </section>
    <action-line @click="addTask" class="bg-white form-item mt20">添加任务</action-line>

    <a @click="onSubmit" class="form-submit-block">提交任务</a>
  </div>
</template>

<script>
  import VInputCounter from "@/components/form/v-input-counter";
  import VInput from "@/components/form/v-input";
  import VPicker from "@/components/form/v-picker";
  import ActionLine from "@/components/form/action-line";
  import request from "@/api";

  class Task {
    constructor() {
      this.start_time = "";
      this.end_time = "";
      this.title = "";
      this.count = 0;
      this.clean_type = null;
      this.clean_content = null;
      this.uid = Math.random() * Date.now();
      this.contentOptions = []
    }
  }

  export default {
    name: "cleaning",
    components: {ActionLine, VPicker, VInput, VInputCounter},
    data() {
      return {
        task: [new Task()],
        options: {
          cleanType: []
        }
      }
    },
    methods: {
      addTask() {
        this.task.push(new Task())
      },
      delTask(index) {
        this.ex.confirm('提示', '确认删除任务' + (index + 1)).then(res => {
          this.task.splice(index, 1)
        });
      },
      getCleanType() {
        request.post('/api/clean/TypeSeach').then(res => {
          this.options.cleanType = res.data.data;
        })
      },
      async getCleanContent(type_id) {
        const res = await request.post('/api/clean/ContentSeach', {type_id});
        return res.data.data;
      },
      async onSelcteType(item, res, index) {
        const value = res.value[0];
        const name = res.text[0];
        if (value !== item.clean_type) {
          this.$refs.clean_content[index].clear();
          item.clean_content = null;
        }
        item.clean_type = name;
        item.contentOptions = await this.getCleanContent(value);
      },
      onSubmit() {
        let error = [];
        let isIncomplete = this.task.some((item, index) => {
          if (!item.title) {
            error.push("请将任务" + (index + 1) + "【任务名称】填写完整")
          }
          if (!item.count) {
            error.push("任务" + (index + 1) + "【任务总次数】不能为0")
          }
          if (!item.start_time) {
            error.push("请选择任务" + (index + 1) + "的【开始时间】")
          }
          if (!item.end_time) {
            error.push("请选择任务" + (index + 1) + "的【结束时间】")
          }
          if (!item.clean_type){
            error.push("请选择任务" + (index + 1) + "的【工作类型】")
          }
          if (!item.clean_content){
            error.push("请选择任务" + (index + 1) + "的【工作内容】")
          }

          if (error.length) {
            return true
          }

        });

        if (error.length) {
          this.$notify(error[0]);
          return false
        }

        let loading = this.$toast.loading({message: '正在提交...', mask: true});

        request.post('/api/Clean/SendCleanTask', {task: this.task}).then(res => {
          loading.clear();
          this.ex.alert('提示', '发布成功！').then(res => {
            this.$router.replace({
              path: "/cleaning_detail",
              query: {
                tab: 'underway'
              }
            })
          });
        }).catch(err => {
          loading.clear();
          this.ex.alert('提示', '发布失败！', false);
        })
      }
    },
    mounted() {
      this.getCleanType();
    }

  }
</script>

<style scoped>

</style>
