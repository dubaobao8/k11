<template>
    <div>
        <!-- 文件 -->
        <div class="file-selected-img">
            <!-- 文件缩略图 -->
            <img
                :src="fileObj.image||fileObj.small_image||''"
                @error="$event.target.setAttribute('src', fileImg)"
                alt="img"
                class="file-img"
            >
            <!-- 文件名&&大小 -->
            <div class="file_description">
                <div v-if="fileObj.file instanceof Object">
                    <p class="file-text">{{fileObj.file.name || fileObj.file_title}}</p>
                    <p class="file-text size">{{(fileObj.file.size/1024/1024).toFixed(2)}}MB</p>
                </div>
                <div v-else>
                    <p class="file-text">{{fileObj.file_title||fileObj.title}}</p>
                </div>
            </div>
            <!-- 删除按钮 -->
            <b class="del-wrp" @click="delFile">删除</b>
        </div>
        <!-- 文件标题 -->
        <label class="file-name" v-if="!fileObj.file_url">
            <input
                type="text"
                class="file-name__input"
                placeholder="请填写附件标题"
                @input="$emit('input',$event.target.value)"
            >
        </label>
    </div>
</template>


<script>
    export default {
        name: "file-add",
        mode: {
            prop: "value",
            event: "input"
        },
        props: {
            value: String,
            fileObj: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                fileImg: require("@/assets/fileImg.png")
            };
        },
        methods: {
            delFile() {
                this.$createDialog({
                    type: "confirm",
                    icon: "cubeic-alert",
                    title: "确定要删除附件吗？",
                    onConfirm: () => {
                        this.$emit("del");
                    }
                }).show();
            }
        }
    };
</script>

<style scoped>
    .file-selected-img {
        display: flex;
        width: 100%;
        position: relative;
        padding: 0.625rem;
        border: 1px solid #eee;
        background-color: #f2f2f2;
        box-sizing: border-box;
    }

    .file_description {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 0.625rem;
        width: 60%;
        overflow: hidden;
    }

    .del-wrp {
        display: block;
        line-height: 2rem;
        padding: 0 0.8rem;
        margin: 0;
        position: absolute;
        top: 50%;
        right: 1rem;
        transform: translateY(-50%);
        color: #ffffff;
        background-color: #ff4857;
        font-size: 0.875rem;
        font-weight: normal;
        border-radius: 2px;
    }

    .del-icon {
        width: 1.1rem;
        height: 1.1rem;
        background-color: #ff4857;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .file-name__input {
        padding: 10px;
        color: #666;
        border-radius: 2px;
        box-sizing: border-box;
        border: 1px solid #f2f0f0;
        outline: none;
        width: 100%;
        margin-top: -1px;
    }

    .file-img {
        width: 3rem;
        height: 3rem;
        border-radius: 4px;
        overflow: hidden;
    }

    p {
        margin: 0;
    }

    .file-text:not(:last-child) {
        margin: 0 0 0.4rem 0;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        line-height: 1.2em;
    }

    .file-text.size {
        color: #999999;
        font-size: 0.875rem;
        font-style: italic;
    }
</style>