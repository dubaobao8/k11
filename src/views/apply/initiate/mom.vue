<template>
  <div class="pt20">
    <v-picker @select:allData="form.date = $event.value.join('/')"
              class="mb20"
              placeholder="请选择日期"
              required
              title="巡查日期"
              type="datetime"/>
    <v-picker class="mb20" placeholder="请选择时间" required title="巡查时间" type="time" v-model="form.time"/>
    <v-datalist :options="options.correlation"
                @send:value="onInputKeyWord"
                @select:option="onSelectedCorrelation"
                class="mb20 right-full"
                options_title="请选择关联的巡查报告"
                text="abstract"
                :value="correlationText"
                title="关联巡查报告"/>

    <v-input class="mb20 right-full" placeholder="自动填充" readonly title="巡查地点" v-model="form.place"/>
    <v-input class="mb20 right-full" placeholder="自动填充" readonly title="详细巡查地点" v-model="form.detail_place"/>

    <p class="mt20 fs08 margin15">环境卫生</p>
    <section class="form-group">
      <v-switch-item :key="item.uid"
                     :title="options.environment[index]"
                     type="judge"
                     v-for="(item,index) in form.environment"
                     v-model="item.value"/>
    </section>

    <p class="mt20 fs08 margin15">设备设施</p>
    <section class="form-group">
      <v-switch-item :key="item.uid"
                     :title="options.facility[index]"
                     type="judge"
                     v-for="(item,index) in form.facility"
                     v-model="item.value"/>
    </section>

    <p class="mt20 fs08 margin15">其他</p>
    <section class="form-group">
      <v-switch-item :key="item.uid"
                     :title="options.others[index]"
                     type="judge"
                     v-for="(item,index) in form.others"
                     v-model="item.value"/>
    </section>

    <section class="form-group">
      <v-switch-item title="其他异常" type="common" v-model="form.unusual"/>
      <v-input :key="1"
               placeholder="请填写异常说明"
               required
               title="请填写其他异常"
               type="textarea"
               v-if="form.unusual"
               v-model="form.content"/>
    </section>

    <section class="mt20">
      <v-ccp-container :ccp="form.look_user" :ccp_selection="options.look_user"/>
    </section>

    <section class="mt20">
      <v-ccp-group-container :ccp_group="form.look_group" :ccp_group_seletion="options.look_group"/>
    </section>

    <a @click="onsubmit" class="form-submit-block">提交</a>
  </div>
</template>

<script>
  import VInput from "@/components/form/v-input";
  import VPicker from "@/components/form/v-picker";
  import VSwitchItem from "@/components/form/v-switch-item";
  import VCcpContainer from "@/components/form/v-ccp-container";
  import request from "@/api";
  import extend from "@/util/extend"
  import VCcpGroupContainer from "@/components/form/v-ccp-group-container";
  import {getUserGroup, getUserList} from "@/util/business";
  import VDatalist from "@/components/form/v-datalist";

  class OptionItem {
    constructor(name) {
      this.uid = extend.generateUid();
      this.value = true;
      this.name = name;
    }
  }

  export default {
    name: "mom",
    components: {VDatalist, VCcpGroupContainer, VCcpContainer, VSwitchItem, VPicker, VInput},
    data() {
      return {
        form: {
          date: "",
          time: "",
          place: "",
          content: "",
          environment: [],
          facility: [],
          others: [],
          unusual: false,
          look_user: [],
          look_group: [],
          patrol_id: 0
        },
        options: {
          environment: [],
          facility: [],
          others: [],
          look_user: [],
          look_group: [],
          correlation: []
        },
        correlationText:""
      }
    },
    methods: {
      getPlaceOptions() {
        const query = this.$route.query;
        // console.log(query)
        if (query.mode !== 'QR') {
          return false
        }

        let data = {
          place: query.place,
          detail_place: query.detail_place,
        };

        this.form.place = data.place;
        this.form.detail_place = data.detail_place;

        request.post('/api/Mys/ChooseReport', data).then(res => {
          let data = res.data.data;
          data.facility = data.equipment;
          this.form.environment = data.environment.map(item => new OptionItem(item));
          this.form.facility = data.facility.map(item => new OptionItem(item));
          this.form.others = data.others.map(item => new OptionItem(item));

          this.options.environment = data.environment;
          this.options.facility = data.facility;
          this.options.others = data.others;

        })

      },
      async getPageInfo() {
        this.options.look_user = await getUserList();
        this.options.look_group = await getUserGroup();
      },
      processData() {
        const data = {...this.form};
        const errors = [];
        if (!data.date) {
          errors.push('请选择【巡查日期】！')
        }
        if (!data.time) {
          errors.push('请选择【巡查时间】！')
        }
        if (data.unusual && !data.content) {
          errors.push('请填写【其他异常】！')
        }

        if (errors.length) {
          this.ex.alert('请填写完整', errors[0], false);
          return false;
        }

        data.look_user = data.look_user.map(item => item.user_id).join(',');
        data.look_group = data.look_group.map(item => item.value.id).join(',');
        data.unusual = data.unusual === true ? 1 : 2;
        return data;
      },
      onsubmit() {
        const data = this.processData();
        if (!data) {
          return false;
        }

        request.post('/api/Mys/SendReport', data).then(res => {
          this.ex.alert('提交成功', '', true).then(res => {
            this.$router.replace({
              path: '/apply'
            })
          }).catch(err => {
            this.ex.alert('错误', '提交失败！', false)
          })
        });
      },
      onInputKeyWord(content) {
        request.post('/api/Mys/ChoosePatrol',{content}).then(res => {
          this.options.correlation = res.data.data
        })

      },
      onSelectedCorrelation(item){
        this.correlationText = item.abstract;
        this.form.patrol_id = item.id;
      }
    },
    mounted() {
      this.getPlaceOptions();
      this.getPageInfo();
    }

  }
</script>

<style scoped>

</style>
