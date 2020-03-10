<template>
  <div class="file-item-wrp">
    <div class="file-item">
      <div class="file-left">
        <img :src="file_img" class="file-img"/>
      </div>
      <div class="file-right">
        <p class="file-name">{{file_name}}</p>
        <p class="file-desc">{{file_desc}}
          <span @click="$emit('reupload')" class="reupload" v-if="need_reupload">重新上传</span>
        </p>
      </div>
      <div @click="delFile" class="file-cancel">删除</div>
    </div>

    <div v-if="!(limit_title&&id)">
      <input
        :value="file_title"
        @change="$emit('change',$event.target.value)"
        class="file-name-input"
        placeholder="请填写附件标题"
        v-if="requiredFileTitle"
      />
    </div>

    <div v-if="requiredFileRemark">
      <input
        :value="file_remark"
        @change="$emit('change:file_remark',$event.target.value)"
        class="file-name-input"
        placeholder="请填写附件备注"
      />
    </div>


  </div>
</template>

<script>
  /**
   * 事件
   * @remove:file 当点击删除文件时
   * @reupload 当点击重新上传时
   * @change 当添加文件时
   */
  export default {
    name: "v-file-item",
    props: {
      // 文件名
      file_name: String,
      // 文件描述小字
      file_desc: String,
      // 文件缩略图
      file_img: String,
      // 文件标题（手动填写）
      file_title: String,
      // 是否需要重新上传
      need_reupload: Boolean,
      // 是否需要文件标题
      requiredFileTitle: {
        type: Boolean,
        default: true
      },
      limit_title: {
        type: Boolean,
        default: false
      },
      id: {
        type: null
      },
      requiredFileRemark: {
        type: Boolean,
        default: false
      },
      // 文件备注
      file_remark:String,
    },
    model: {
      prop: "value",
      event: "change"
    },
    methods: {
      delFile() {
        this.$createDialog({
          type: "confirm",
          icon: "cubeic-warn",
          title: "提示",
          content: "是否删除文件？",
          onConfirm: () => {
            this.$emit("remove:file");
          }
        }).show();
      }
    }
  };
</script>

<style scoped>
  .file-item {
    display: flex;
    padding: 0.625rem;
    border: 1px solid #f2f2f2;
    background-color: #f7f7f7;
    border-radius: 2px 2px 0 0;
  }

  .file-img {
    width: 3rem;
    height: 3rem;
    border-radius: 2px;
    position: relative;
    overflow: hidden;
    display: block;
  }

  .file-img::after {
    content: "";
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAYAAAA5ZDbSAAAEi0lEQVR4nO3dPWwTZxzH8d9dLoZEDhECIkUqUUjsKFKRQoA49GXqVrUrEgMrW1QkxGtJFTLwIoEQSwa6tkNVMbQTU7s0A6WFqgIpKECoggABSaTEUew49l2nVB2ww9l393+ef36f1ZbvwV/x+Dk/54uTvj0RgNRypQdA8WJg5RhYOQZWjoGVY2DlGFg5BlaOgZVjYOUYWDkGVo6BlWNg5RhYOQZWjoGVY2DlGFg5BlaOgZVjYOU86QEAwOHOLEa6BzDY3gFHeCxj03dwfea+8CiiIx74cv8nGOkekB7Gf8b7DiHlurjy5E/poURCdIo+vmfQqLjrzmdyONN7UHoYkRAL3Nvajgt9w1KH39BoNocTPfulh9EwscBHP+iH55i9xhvvO4TTlv9PFnuHP9uxW+rQoXyTzeFkzwHpYdRNbJG1u6Wt6mNFv4KSX4l9DJ7joLWpecPnjfUNw0dg5epaLPBWt6nqYxP//J3Im/nR9k7cOvDFez3X1tW1WOBav1ldLq9hqVyKfQwLa8VQzz+fycGFg0tP/ohpRNEzcpXT7CYzrC01ZpFqzmWGrDqFMjKw6UazOYxmc9LDeC8MXKczvQfxdWZIehgbYuAG2DBdM3CDTJ+uGTgCJk/XDBwRU6drBo6QidM1A0fMtOmagWNg0nTNwDExZbpm4BiZMF0zcMzOZYZELxpg4ASczTCwaklcvFDNpg5cz3ZhPSqB3B2bxa+LlvRmtYDJhZeRvFZXSxu6alyGJGVTB36Qn8Pnd3+K5LW+6t6Hi/0fR/JaUdrUU3SU0t7GF+9JYGDlGFg5BlaOgZVjYOUYWDkGVo6BlbPumywHQNpLJX4vjwDAcrlU8zdVJrIucNpL4e6nR7DNSyV63KVyCbnJH5BP4EdxUbIusOs46Ei1IpXQD9TWbXU9uI70PYDCs+4zOAgCFP1y4sct+mUEgtt+9bIuMIXDwMoxsHLWBXYdJ/EVNABs81JWLrKsW0UXKmWMTd9J7Hqqdat+BYVK8ou7RlkXeNWvWHk7IynWTdEUDgMrx8DKMbByDKycdatobheGY11gbheGY11gbheGY91nMLcLw7EuMIXDwMoxsHLWBeZ2YTjWraK5XRiOdYG5XRiOdVM0hcPAyjGwcgysnJGB13xfegihrQVmjllsFe3W2PBLe80i57qNSNf4G4iSZ89igYt+GWm8+00Z6R7Asa69CY+oMbXOywsCmyPrxALPFvLYmWp552Nb3KbEv8iI0/PCstixxT6Df5l7LnXoxP0q+G8VC/zdi0fwLdxfDcsPAnz/4pHY8cUCP1tZxOmpSanDJ+bU1G+YWVkUO77oadLN2Qe4NnNPcgixuvr0Hr6dfSg6BvHNhvHp3zGVX8DxPYP4sG0Hmizckvu/ShDgYX4eN579hVuvHksPRz4wAPz46jFel1bwZUcPBtt3VV1dm26+VMD9xbf4+fXTyG403ignfXtC/0pnEzPyq0qKDgMrx8DKMbByDKwcAyvHwMoxsHIMrBwDK8fAyjGwcgysHAMrx8DKMbByDKwcAyvHwMoxsHIMrNy//goQdaIzQXQAAAAASUVORK5CYII=");
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 3rem;
    height: 3rem;
  }

  /* .file-left {
  	} */
  .file-right {
    margin-left: 15px;
    font-size: 0.95rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    flex: 1;
    width: 0;
  }

  .file-right > p {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .file-name {
    line-height: 1.3;
  }

  .file-desc {
    font-size: 0.875rem;
    color: #bbbbbb;
  }

  .file-cancel {
    margin-left: 15px;
    align-self: center;
    padding: 0.6rem 0.7rem;
    background-color: rgb(255, 25, 75);
    color: #fff;
    font-size: 0.875rem;
    border-radius: 2px;
  }

  .file-name-input {
    color: #666;
    box-sizing: border-box;
    border: 1px solid #f2f0f0;
    outline: none;
    display: block;
    width: 100%;
    margin-top: -1px;
    padding: 8px;
    border-radius: 0 0 2px 2px;
    font-size: 0.875rem;
  }

  .reupload {
    color: #ff194b;
    text-decoration: underline;
    cursor: pointer;
  }
</style>
<style scoped src="./form.css"/>
