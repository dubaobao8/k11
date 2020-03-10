<template>
  <div class="v-select-input">
    <slot name="prepend"></slot>
    <v-input :value="cur_text" @input="onInput" style="padding: 0;flex: 1">
      <template #label>
        <div @click="showSelect" class="dpfx fxac pt15 pb15 pl5 pointer mr5">
          <div>{{cur_selectText}}</div>
          <van-icon class="ml5" name="arrow-down" color="#aaa"/>
        </div>
      </template>
    </v-input>
  </div>
</template>

<script>
  import VInput from "@/components/form/v-input";

  export default {
    name: "v-select-input",
    components: {VInput},
    props: {
      range: {
        type:Array,
        default: ()=>[{text:'',value:''}]
      },
      title: {
        type: String,
        default: "请选择"
      },
      // selectText: String
    },
    data() {
      return {
        cur_selectText: "",
        cur_selectValue: "",
        cur_text: ""
      }
    },
    methods: {
      showSelect() {
        if (!this.selectPicker) {
          this.selectPicker = this.$createPicker({
            title: this.title,
            data: [this.range],
            onSelect: (value, index, text) => {
              this.cur_selectValue = value[0];
              this.cur_selectText = text[0];
              this.$emit('change', {
                text: this.cur_text,
                select: this.cur_selectValue
              })
            }
          })
        }
        this.selectPicker.show();
      },
      onInput(e) {
        this.cur_text = e;
        this.$emit('change', {
          text: this.cur_text,
          select: this.cur_selectValue
        })
      }
    },
    mounted() {
      this.cur_selectValue = this.range[0].value;
      this.cur_selectText = this.range[0].text
    }
  }
</script>

<style scoped>
  .v-select-input{
    display: flex;
    align-items: center;
  }
  .v-select-input >>> .form-item {
    border-top: none;
  }

  .v-select-input >>> .form-inline-left {
    flex: 0 0 auto;
    width: auto;
  }

  .v-select-input >>> .form-inline-right {
    flex: 1 0 auto;
    width: auto;
  }
</style>
