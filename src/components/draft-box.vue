<template>
    <div class="mul-bg">
        <div class="mul-wrp">
            <p class="mul-title">已保存的草稿</p>
            <div class="mul-g">
                <cube-scroll>
                    <ul style="border-top: 1px solid #eee;">
                        <li :key="index" v-for="(item,index) in draftList" class="box-item">
                            <div v-if="type==='report'">
                                <p class="b-text">报告摘要：{{item.abstract}}</p>
                                <p class="b-text">事件类型：{{item.type}}{{item.more_type?","+item.more_type:""}}</p>
                                <p class="b-text">日期：{{item.create_time | transTime}}</p>
                            </div>

                            <div v-if="type==='patrol'">
                                <p class="b-text">巡查报告：{{item.abstract}}</p>
                                <p class="b-text">项目名称：{{item.title}}</p>
                                <p class="b-text">日期：{{item.create_time | transTime}}</p>
                            </div>

                            <div v-if="mode=='show'&&type==='report'">
                                <a href="javascript:" class="continue_edit" @click="editDraftReport(item.id)">继续填写</a>
                                <a
                                    href="javascript:"
                                    class="continue_edit continue_edit--del"
                                    @click="delDraftReport(item.id)"
                                >删除</a>
                            </div>

                            <div v-if="mode==='show'&&type==='patrol'">
                                <a href="javascript:" class="continue_edit" @click="$emit('edit',item.id)">继续填写</a>
                                <a
                                    href="javascript:"
                                    class="continue_edit continue_edit--del"
                                    @click="delPatrolDraft(item.id)"
                                >删除</a>
                            </div>

                            <div v-if="mode==='replace'&&type==='report'">
                                <a href="javascript:" class="continue_edit" @click="replaceDraftReport(item.id)">替换</a>
                            </div>

                            <div v-if="mode==='replace'&&type==='patrol'">
                                <a href="javascript:" class="continue_edit" @click="$emit('replace',item.id)">替换</a>
                            </div>
                        </li>
                    </ul>
                    <div v-if="!draftList.length" class="nodraft">没有任何草稿</div>
                </cube-scroll>
            </div>
            <div class="mul-btns">
                <a href="javascript:;" class="mul-btn" @click="$emit('close')">关闭</a>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from "axios";
    import util from "../util/util.js";
    import patrolReq from "../api/draft/patrol.js";
    import {getItem, setItem} from "../util/util";
    import {uploadDetailFile} from "@/api/initiate/initiate";
    import request from "@/api";
    import {replaceIncidentDraft} from "../api/draft/patrol";

    export default {
        name: "draft-box",
        props: {
            mode: String,
            type: String,
            dataForm: Object
        },
        data() {
            return {
                draftList: [],
                urls: {
                    list: "",
                    save: "",
                    del: "",
                    replace: ""
                }
            };
        },
        methods: {
            //验证
            contSaveDataVerify(form, details) {
                var form = form;
                console.log("草稿箱验证数据");
                //判断明细内容是否填写
                var isDetail = true;
                var isDetailFile = true;
                console.log(details);
                console.log(form);
                details.forEach(detail => {
                    if (detail.file.length > 0) {
                        //判断附件标题
                        var detailFileArray = detail.file;
                        detailFileArray.forEach(detailFile => {
                            if (detailFile.file && !detailFile.file_title) {
                                isDetailFile = false;
                                return false;
                            }
                        });
                    }
                });
                if (!isDetailFile) {
                    this.$createToast({
                        time: 1000,
                        type: "txt",
                        txt: "请检查明细的附件标题"
                    }).show();
                    return false;
                }
                //判断类型是否有其他
                let isOther = false;
                if (form.type instanceof Array) {
                    form.type.forEach((e, i) => {
                        if (e === "其他") {
                            form.type.splice(i, 1);
                            isOther = true;
                        }
                    });
                }
                if (isOther && !form.type.length && !form.more_type) {
                    this.$createToast({
                        time: 1000,
                        type: "txt",
                        txt: "请填写其他事件类型！"
                    }).show();
                    return false;
                }
                //判断附件
                var isFileTitle = true;
                if (this.$parent.addfile.length > 0) {
                    //验证附件标题
                    this.$parent.addfile.forEach(file => {
                        if (!file.file_title) {
                            isFileTitle = false;
                        }
                    });
                }
                if (!isFileTitle) {
                    this.$createToast({
                        txt: "请将附件标题填写完整",
                        time: 1500,
                        type: "error"
                    }).show();
                    return false;
                }
                return true;
            },
            //上传数据
            buildFormData(data, tip, callBack, id,api) {
                console.log("开始上传数据");
                console.log(data);
                var detailFileFormDataArray = data.detailFileFormDataArray;
                var details = data.details;
                var formDataAll = data.formDataAll;
                if (detailFileFormDataArray.length) {
                    console.log("明细有附件");
                    var count = detailFileFormDataArray.length - 1;
                    //循环上传明细，构建details
                    detailFileFormDataArray.forEach((item, index) => {
                        if (item) {
                            this.$emit("uploadDetailFile", details[index], item, id, res => {
                                console.log("上传明细文件回调");
                                if (res.data.status == 1) {
                                    if (count == 0) {
                                        console.log("附件上传完毕");
                                        console.log(JSON.stringify(details));
                                        formDataAll.append("details", JSON.stringify(details));
                                        callBack && this[callBack](formDataAll, tip, id,api);
                                    } else {
                                        count--;
                                    }
                                }
                            });
                        }
                    });
                } else {
                    //没有明细附件，直接上传
                    console.log("明细没有数据，直接上传");
                    formDataAll.append("details", JSON.stringify(details));
                    callBack && this[callBack](formDataAll, tip, id);
                }
            },
            //请求草稿箱列表数据
            getDraftReport() {
                axios({
                    baseURL: this.$store.state.domain,
                    url: this.urls.list,
                    method: "POST",
                    data: {
                        user_id: localStorage.getItem("user_id")
                    }
                }).then(res => {
                    this.draftList = res.data.data;
                });
            },
            //替换保存草稿箱
            replaceDraftPostFormData(formData, tip, id) {
                var vm = this;
                //保存至草稿箱
                patrolReq
                    .replaceDraft(formData)
                    .then(res => {
                        tip.hide();
                        if (res.data.status == 1) {
                            this.$createToast({
                                time: 1000,
                                type: "correct",
                                txt: "已替换该草稿"
                            }).show();
                            this.$parent.isShowDraftReplace = false;
                            this.$parent.form.event_id = id;
                            this.editDraftReport(id);
                            this.getDraftReport();
                        } else {
                            this.$createToast({
                                txt: res.data.ex,
                                type: "error",
                                time: 1500
                            }).show();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        tip.hide();
                        this.$createToast({
                            txt: "替换该草稿失败!",
                            type: "error",
                            time: 1500
                        }).show();
                    });
            },
            //保存草稿箱-提交数据
            saveDraftPostFormData(formData, tip, event_id,api="DraftDraft") {
                //保存至草稿箱
                console.log("保存至草稿箱");
                console.log(formData);
                if(event_id){
                    formData.append("event_id",event_id)
                }
                patrolReq[api](formData)
                    .then(res => {
                        tip.hide();
                        if (res.data.status == 1) {
                            this.$createToast({
                                time: 1000,
                                type: "correct",
                                txt: "已保存至草稿箱"
                            }).show();
                            this.getDraftReport();
                            this.editDraftReport(res.data.data);
                        } else {
                            this.$createToast({
                                txt: res.data.ex,
                                type: "error",
                                time: 1500
                            }).show();
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        tip.hide();
                        this.$createToast({
                            txt: "表单提交失败！",
                            type: "error",
                            time: 1500
                        }).show();
                    });
            },
            // 保存提交事件报告草稿
            saveDraftReport(form, detail) {
                //拷贝
                // var form = Object.assign({}, form);
                // var detail = Object.assign({}, details);
                //1.验证数据
                var tip = this.$createToast({
                    txt: "正在验证数据....",
                    type: "loading",
                    mask: true,
                    time: 0
                }).show();
                var isVerify = this.contSaveDataVerify(form, detail);

                if (isVerify) {
                    //判断草稿箱是否已满
                    var tip = this.$createToast({
                        txt: "正在查看草稿箱....",
                        type: "loading",
                        mask: true,
                        time: 0
                    }).show();
                    if (form.event_id) {
                        //2.准备数据
                        var data = this.resolveReport(form, detail);
                        var tip = this.$createToast({
                            txt: "正在保存草稿箱....",
                            type: "loading",
                            mask: true,
                            time: 0
                        }).show();
                        //提交
                        this.buildFormData(data, tip, "saveDraftPostFormData", form.event_id);
                    } else {
                        //2.准备数据
                        var data = this.resolveReport(form, detail);
                        patrolReq.contDraf(getItem("user_id")).then(res => {
                            if (res.data.status == 1) {
                                console.log("草稿箱没满");
                                var tip = this.$createToast({
                                    txt: "正在保存草稿箱....",
                                    type: "loading",
                                    mask: true,
                                    time: 0
                                }).show();
                                this.buildFormData(
                                    data,
                                    tip,
                                    "saveDraftPostFormData",
                                    form.event_id
                                );
                            } else {
                                this.$createToast({
                                    txt: "草稿箱已满，请替换已有的草稿",
                                    type: "error",
                                    time: 1000
                                }).show();
                                this.$parent.isShowDraftReplace = true;
                                this.$parent.$refs.draft_replace.getDraftReport();
                            }
                        });
                    }
                }
            },
            // 事件报告数据回显
            editDraftReport(id) {
                var vm = this;
                axios({
                    baseURL: this.$store.state.domain,
                    url: this.urls.detail,
                    method: "POST",
                    data: {
                        event_id: id
                    }
                }).then(res => {
                    var data = res.data.data[0];
                    this.$parent.draftEdit(data);
                });
            },
            // 删除事件报告草稿
            delDraftReport(id) {
                this.$createDialog({
                    type: "confirm",
                    title: "确定删除该草稿吗？",
                    content: "如果正在填写该报告，则会被清空！",
                    icon: "cubeic-alert",
                    onConfirm: () => {
                        axios({
                            baseURL: this.$store.state.domain,
                            url: this.urls.del,
                            method: "POST",
                            data: {
                                id: id
                            }
                        })
                            .then(res => {
                                this.$createToast({
                                    txt: "删除成功",
                                    time: 1500,
                                    type: "correct"
                                }).show();
                                this.getDraftReport();
                                this.$emit("del", id);
                            })
                            .catch(err => {
                                this.$createToast({
                                    txt: "删除失败",
                                    time: 1500,
                                    type: "error"
                                }).show();
                            });
                    }
                }).show();
            },
            //  替换事件报告草稿
            replaceDraftReport(id) {
                console.log(id);
                let tip = this.$createToast({
                    txt: "正在保存至草稿箱...",
                    type: "loading",
                    mask: true,
                    time: 0
                });
                var form = this.$parent.form;
                var detail = this.$parent.details;
                var data = this.resolveReport(form, detail);
                this.buildFormData(data, tip, "saveDraftPostFormData", id,"replaceIncidentDraft");
            },
            //  处理事件报告数据
            resolveReport(dataForm, detail) {
                console.log("处理事件报告数据");
                var formDataAll = new FormData();
                var form = Object.assign({}, dataForm);
                form.user_id = localStorage.getItem("user_id");
                var details = [];
                //准备附件数据
                if (this.$parent.addfile.length > 0) {
                    this.$parent.addfile.forEach((e, i) => {
                        if (typeof e.file != "string") {
                            formDataAll.append("file[]", e.file);
                            formDataAll.append("file_title[]", e.file_title);
                        }
                    });
                }

                //转换明细数组
                for (var i = 0; i < detail.length; i++) {
                    details.push(detail[i]);
                }
                //构建事件类型字符串
                if (form.type instanceof Array) {
                    if (form.more_type) {
                        form.type.push(form.more_type);
                    }
                    formDataAll.append("type", form.type.join(","));
                }
                //构建群组字符串
                formDataAll.append(
                    "look_group",
                    form.look_group
                        .map((e, i) => {
                            return e.id;
                        })
                        .join(",")
                );
                var sc = [];
                //构建抄送人
                this.$parent.selectedCopy.forEach((e, i) => {
                    sc.push(e.id);
                });
                formDataAll.append("look_user", sc.join(","));
                //构建剩下的表单数据
                for (let property in form) {
                    if (
                        property != "details" &&
                        property != "type" &&
                        property != "look_user" &&
                        property != "look_group"
                    ) {
                        formDataAll.append(property, form[property]);
                    }
                }
                //构建明细内容数据
                var detailFileFormDataArray = [];
                var deleteIndexs = [];
                details.forEach((detail, index) => {
                    console.log("单个明细数据");
                    console.log(detail);
                    var fileData = new FormData();
                    if (detail.file.length > 0) {
                        //明细有添加附件
                        console.log("明细有添加附件");
                        detail.file.forEach((item, fileIndex) => {
                            console.log("当前明细" + index + "的文件");
                            console.log(item);
                            if (item.file) {
                                //说明是新添加的文件
                                console.log("是新的附件，需要添加入detailFileFormDataArray");
                                fileData.append("file[]", item.file);
                                fileData.append("title[]", item.file_title);
                                deleteIndexs.push(fileIndex);
                            }
                        });
                        deleteIndexs.forEach(index => {
                            detail.file.splice(index, 1);
                        });
                        detailFileFormDataArray.push(fileData);
                    } else {
                        //明细没有添加附件
                        // detailFileFormDataArray.push({});
                    }
                });
                console.log("数据处理完成");
                console.log(form);
                console.log(formDataAll);
                console.log(detailFileFormDataArray);
                console.log(details);
                return {
                    form,
                    formDataAll,
                    detailFileFormDataArray,
                    details
                };
            },

            /* ***  事件报告结束 *** */
            /* ******************** */
            /* ***  巡查报告开始 *** */

            // 请求巡查报告草稿列表
            getPatrolList() {
                patrolReq.draftList(getItem("user_id")).then(res => {
                    this.draftList = res.data.data;
                });
            },
            // 删除巡查报告草稿
            delPatrolDraft(id) {
                this.$createDialog({
                    type: "confirm",
                    title: "确定删除该草稿吗？",
                    content: "如果正在填写该报告，则会被清空！",
                    icon: "cubeic-alert",
                    onConfirm: () => {
                        patrolReq
                            .delDraft(id)
                            .then(res => {
                                this.$createToast({
                                    txt: "删除成功",
                                    time: 1500,
                                    type: "correct"
                                }).show();
                                this.getPatrolList();
                                this.$emit("del", id);
                            })
                            .catch(err => {
                                this.$createToast({
                                    txt: "删除失败",
                                    time: 1500,
                                    type: "error"
                                }).show();
                            });
                    }
                }).show();
            }
        },

        filters: {
            transTime(v) {
                return util.stampToString(v, "/", true);
            }
        },
        created() {
            switch (this.type) {
                case "report":
                    this.urls.list = "/api/Draft/UserList";
                    this.urls.save = "/api/Draft/PortSave";
                    this.urls.del = "/api/Draft/Delete";
                    this.urls.replace = "/api/Draft/UpdatePort";
                    this.urls.detail = "/api/Draft/PortDetail";
                    this.urls.file = "/api/Draft/FileUpload";
                    break;
                case "patrol":
                    this.getPatrolList();
                    break;
                default:
                    break;
            }
        }
    };
</script>

<style scoped>
    .mul-bg {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 10;
    }

    .mul-wrp {
        background-color: #fff;
        border-radius: 2px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 17rem;
        text-align: center;
        font-size: 0.875rem;
    }

    .mul-title {
        padding: 15px;
        color: #333;
        line-height: 1;
    }

    .mul-btns {
        display: flex;
        border-top: 1px solid #ebebeb;
    }

    .mul-g {
        height: 17rem;
    }

    .mul-btn {
        flex: 1;
        padding: 16px 10px;
        color: #999;
    }

    .mul-btn:not(:last-child) {
        border-right: 1px solid #ebebeb;
    }

    .mul-btn.highlight {
        color: rgba(85, 133, 240, 1);
    }

    .box-item {
        padding: 1rem 1rem 0 1rem;
        font-size: 0.75rem;
        display: flex;
        justify-content: space-between;
        text-align: left;
        border-bottom: 1px solid #eee;
    }

    .b-text {
        margin-bottom: 0.6rem;
        color: #555;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1.2em;
    }

    .continue_edit {
        display: block;
        color: rgba(85, 133, 240, 1);
        width: 100%;
        box-sizing: border-box;
        text-align: center;
        line-height: 2em;
        margin-bottom: 0.3rem;
    }

    .continue_edit--del {
        color: #ff385c;
    }

    .nodraft {
        color: #888888;
        margin-top: 1rem;
    }

    .box-item > div:nth-child(1) {
        width: 70%;
    }

    .box-item > div:nth-child(2) {
        width: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 0.6rem;
        margin-left: 5%;
        flex-direction: column;
    }
</style>
