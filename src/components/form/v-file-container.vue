<template>
  <div class="form-item form-block file-container">
    <p class="input-title">
      {{title}}
      <i class="red-dot" v-if="required"></i>
      <span class="required-notice ml10" v-if="requiredNotice">{{requiredNotice}}</span>
    </p>
    <template v-for="(file,fileindex) in files">
      <v-file-item
        :file_desc="file.file_desc"
        :file_img="file.file_img"
        :file_name="file.file_name"
        :file_remark="file.file_remark"
        :file_title="file.file_title"
        :id="file.id"
        :key="Date.now() * Math.random()"
        :limit_title="limit_title"
        :need_reupload="file.need_reupload"
        :required-file-title="requiredFileTitle"
        :requiredFileRemark="requiredFileRemark"
        @change="changeFileTitle($event,file,fileindex)"
        @change:file_remark="changeFileRemark(file,$event)"
        @remove:file="delFile(fileindex)"
        @reupload="upLoadFile(file)"
        class="mt15"
        v-on="$listeners"
      />
    </template>
    <v-file-picker :buttonText="buttonText"
                   :only-camera="onlyCamera"
                   @select_file="pushFile"
                   v-bind="$attrs"
                   v-on="$listeners"/>
  </div>
</template>

<script>
  import vFileItem from "@/components/form/v-file-item";
  import vFilePicker from "./v-file-picker";
  import request from "@/api";

  export default {
    name: "v-file-container",
    inheritAttrs: false,
    components: {
      vFileItem,
      vFilePicker
    },
    props: {
      // 标题
      title: {
        type: String,
        default: "附件"
      },
      buttonText: {
        type: String,
        default: "添加附件"
      },
      // 是否必选
      required: {
        type: Boolean,
        default: false
      },
      // 必填提醒
      requiredNotice: {
        type: null,
      },
      files: {
        type: Array
      },
      action: {
        type: String,
        default: '/api/form/upload'
      },
      del_action: {
        type: String,
        default: '/api/form/deleteEnclosure'
      },
      auto_upload: {
        type: Boolean,
        default: true
      },
      auto_del: {
        type: Boolean,
        default: true
      },
      requiredFileTitle: { //是否需要填写文件标题，如果为否，则文件名为文件标题
        type: Boolean,
        default: true
      },
      limit_title: {
        type: Boolean,
        default: false
      },
      onlyCamera: {
        type: Boolean,
        default: false
      },
      requiredFileRemark: {
        type: Boolean,
        default: false
      },
    },
    methods: {
      // 添加文件
      pushFile(files) {
        for (let i = 0; i < files.length; i++) {
          let file = files.item(i);
          var fileItem = {
            file: file,
            file_img: window.URL.createObjectURL(file),
            file_name: file.name,
            file_title: "",
            file_desc: "",
            file_remark: "",
            need_reupload: false,
          };
          if (!this.requiredFileTitle) {
            fileItem.file_title = file.name;
          }
          this.files.push(fileItem);
          this.$emit('push:file', fileItem);
          // 自动上传文件
          if (this.auto_upload) {
            this.upLoadFile(fileItem)
          }
        }

      },
      // 上传文件
      upLoadFile(fileItem) {
        var formData = new FormData();
        formData.append('file', fileItem.file);
        fileItem.file_desc = "正在上传...";
        fileItem.need_reupload = false;
        request.post(this.action, formData).then(res => {

          var data = res.data.data;
          fileItem.image = data.image;
          fileItem.small_image = data.small_image;
          fileItem.file_desc = "已上传";
          fileItem.id = ""
        }).catch(err => {
          fileItem.file_desc = "上传失败，请";
          fileItem.need_reupload = true;
          console.log(err)
        })
      },

      changeFileTitle(file_title, file, fileindex) {
        file.file_title = file_title;
        this.$emit('chang_title', file, fileindex);
      },

      delFile(fileindex) {
        this.$emit('del:file', fileindex);
        // 自动删除文件
        if (this.auto_del) {
          var file = this.files[fileindex];
          if (file.image) {
            request.post(this.del_action, {
              image: file.image,
              small_image: file.small_image
            });
          }
          this.files.splice(fileindex, 1);
        }
      },

      delFileIndex(fileindex) {
        this.files.splice(fileindex, 1);
      },
      changeFileRemark(file, remark) {
        file.file_remark = remark
      }
    }

  };
</script>


<style scoped src="./form.css"></style>

<style scoped>
  .file-container {
    padding-bottom: 0 !important;
  }
</style>
