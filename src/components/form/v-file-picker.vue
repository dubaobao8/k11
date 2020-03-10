<template>
  <label class="v-add-file">
    <action-line font-class="fa fa-plus-circle">{{buttonText}}</action-line>
    <input
      :capture="onlyCamera?'camera':false"
      :accept="onlyCamera?'image/*':false"
      @change="file_change"
      class="file" type="file"
      :multiple="multiple"
    />
  </label>
</template>

<script>
  import actionLine from "./action-line";

  export default {
    name: "v-file-picker",
    components: {
      actionLine
    },
    props: {
      buttonText: {
        type: String,
        default: "添加附件"
      },
      onlyCamera:{
        type:Boolean,
        default:false
      },
      multiple:{
        type:Boolean,
        deafult:false
      }
    },
    methods: {
      file_change(e) {
        var file = e.currentTarget.files;
        this.$emit("select_file", file);
        e.currentTarget.value = "";
      }
    }
  };
</script>

<style scoped>
  .file {
    width: 0;
    height: 0;
    opacity: 0;
    overflow: hidden;
    position: fixed;
    right: 200%;
  }
</style>
