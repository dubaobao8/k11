<template>
    <div class="potrol-page">
        <main class="fs08">
            <!-- 巡查报告 -->
            <section class="form-item-wrp item-bor">
                <div class="form-title mb15">
                    巡查报告
                    <span class="required">*</span>
                </div>
                <cube-textarea
                    v-model="form.abstract"
                    :autoExpand="false"
                    placeholder="例：2019年2月25日写字楼巡查报告"
                    :maxlength="500"
                ></cube-textarea>
            </section>
            <!-- 项目名称 -->
            <section class="form-inline item-bor" @click="showMul">
                <div class="form-title">
                    项目名称
                    <span class="required">*</span>
                </div>
                <div class="inline-pick">
                    <span v-if="!form.title.length">请选择项目名称&nbsp;</span>
                    <span v-else>{{form.title | mulType}}</span>
                    <i class="ml5 fa fa-chevron-right"></i>
                </div>
            </section>
            <!-- 报告日期 -->
            <section class="form-inline item-bor" @click="showDatePick('create_time')">
                <div class="form-title">
                    报告日期
                    <span class="required">*</span>
                </div>
                <div class="inline-pick">
                    <span v-if="!form.create_time">请选择报告日期</span>
                    <span v-else>{{form.create_time | StamptoString}}</span>
                    <i class="ml5 fa fa-chevron-right"></i>
                </div>
            </section>
            <!-- 巡查日期 -->
            <section class="form-inline item-bor" @click="showSegDate('happen_time')">
                <div class="form-title">
                    巡查日期
                    <span class="required">*</span>
                </div>
                <div class="inline-pick">
                    <span v-if="!form.happen_time">请选择巡查日期</span>
                    <span v-else>{{form.happen_time | transSegTime}}</span>
                    <i class="ml5 fa fa-chevron-right"></i>
                </div>
            </section>
            <!-- 巡查范围 -->
            <section class="form-inline item-bor" @click="showPick('potrol_scope')">
                <div class="form-title">
                    巡查范围
                    <span class="required">*</span>
                </div>
                <div class="inline-pick">
                    {{!form.potrol_scope?'请选择巡查范围':form.potrol_scope}}
                    <i class="ml5 fa fa-chevron-right"></i>
                </div>
            </section>
            <!-- 所属外判公司 -->
            <section class="form-inline item-bor" @click="showPick('wp_company')">
                <div class="form-title">
                    所属外判公司
                    <span class="required">*</span>
                </div>
                <div class="inline-pick">
                    {{!form.wp_company?'请选择所属外判公司':form.wp_company}}
                    <i class="ml5 fa fa-chevron-right"></i>
                </div>
            </section>

            <!-- 明细填写开始 -->
            <template v-for="(item, index) in form.details">
                <div :key="index">
                    <p class="mx-t">
                        明细{{index+1}}
                    </p>
                    <ul class="item-bor plr15 bg-white">
                        <li class="md-item" @click="showMXSegDate('potrol_time',index)">
                            <span class="form-title">巡查时间<b class="required">*</b></span>
                            <div class="inline-pick">
                                <span v-if="!form.details[index].potrol_time">请选择&nbsp;</span>
                                <span v-else>{{form.details[index].potrol_time | transSegTime}}</span>
                                <i class="ml5 fa fa-chevron-right"></i>
                            </div>
                        </li>

                        <li class="md-bk">
                            <div class="form-title mb15">
                                巡查地点
                                <b class="required">*</b>
                            </div>
                            <cube-textarea
                                v-model="form.details[index].potrol_place"
                                :autoExpand="false"
                                placeholder="请详细描述巡查地点"
                                :maxlength="500"
                            ></cube-textarea>
                        </li>

                        <li class="md-bk">
                            <div class="form-title mb15">
                                巡查内容
                                <b class="required">*</b>
                            </div>
                            <cube-textarea
                                v-model="form.details[index].potrol_content"
                                :autoExpand="false"
                                placeholder="请详细描述巡查内容"
                                :maxlength="500"
                            ></cube-textarea>
                        </li>
                        <!-- 已添加的明细内附件列表 -->
                        <file-add class="file-add-wrp mb15"
                                  v-for="(fileItem,i) in item.file"
                                  v-model="fileItem.file_title"
                                  :file-obj="fileItem"
                                  :key="i"
                                  @del="delMxFile(fileItem,i,item.file)"
                        />

                        <!-- 添加明细内附件 -->
                        <label class="add-file-wrp">
                            <i class="fa fa-plus-circle"></i>
                            <input type="file" @change="addMxFile(item,$event)">
                            添加附件
                        </label>
                    </ul>

                    <span class="del-mx" @click="delDetail(index)" v-if="index!=0">
                            <i class="fa fa-minus-circle"></i>&nbsp;删除该明细
                    </span>
                </div>
            </template>

            <div class="add-mdetial" @click="addDetail">
                <i class="fa fa-plus-circle mr5"></i>添加明细
            </div>

            <!-- 明细填写结束 -->

            <!-- 综合附件 -->
            <section class="md-bk attach_file">
                <div class="form-title mb10">
                    附件
                    <!--<span class="required">*</span>-->
                </div>
                <p class="crbbb">请补充巡查相关图片</p>

                <div class="pt15 f-imgs-wrp">
                    <div v-for="(item, index) in files" class="added__files">
                        <i class="file-selected-img" :key="index">
                            <img :src="item.fileimg"
                                 @error="imgFail">
                            <div class="file_description">
                                <p>{{typeof item.file == 'string'?item.file_title||item.name:item.file.name}}</p>
                                <p v-if="typeof item.file != 'string'">
                                    {{(item.file.size/1024/1024).toFixed(2)}}MB
                                </p>
                            </div>

                            <b class="del-wrp" @click="delFile(index)">
                                <i class="del-icon"></i>
                            </b>
                        </i>
                        <!-- 文件标题 -->
                        <label class="file-name" v-if="typeof item.file != 'string'">
                            <input type="text"
                                   class="file-name__input"
                                   v-model="item.file_title"
                                   placeholder="请填写附件标题"/>
                        </label>
                    </div>
                    <!-- 添加综合附件 -->
                    <div class="mb20">
                        <label class="file-icon">
                            <input type="file" @change="getFile">
                        </label>
                    </div>
                </div>
            </section>
            <!-- 综合附件结束 -->


            <!-- 审批人 -->
            <section class="form-item-wrp">
                <div class="form-title mb15">审批人</div>
                <ul class="add-ul">
                    <li class="appro-men" v-for="(item, index) in select.check_user" :key="index">
                        <img :src="item.user_logo"/>
                        <p>{{item.username}}</p>
                    </li>
                </ul>
            </section>
            <!-- 抄送人 -->
            <section class="form-item-wrp">
                <div class="form-title mb15">抄送人</div>
                <ul class="add-ul">
                    <li class="appro-men" v-for="(item, index) in form.look_user" :key="index">
                        <img :src="item.user_logo"/>
                        <p>{{item.username}}</p>
                        <b class="del-wrp" @click="delCopy(index)">
                            <i class="del-icon"></i>
                        </b>
                    </li>
                    <i class="add-icon cmb20" @click="showCopy"></i>
                </ul>
            </section>

            <!-- 抄送群组 -->
            <div class="form-item-wrp pd15">
                <div class="form-title mb15">抄送群组</div>
                <div class="copy-men-wrp">
                    <template v-for="(item,index) in form.look_group">
                        <div class="look-group__wrap" :key="index">
                            <div class="look-group__item">
                                <span>{{item.name}}</span>
                                <del class="look-group__del"
                                     @click="form.look_group.splice(index,1)">
                                    <i class="del-icon"></i>
                                </del>
                            </div>
                        </div>
                    </template>
                </div>
                <div class="copy-add" @click="showLookGroupPicker" v-if="!form.look_group.length">
                    <div class="at-wrp">
                        <div class="at-r"></div>
                        <div class="at-c"></div>
                    </div>
                </div>
            </div>


            <!-- 提交 -->
            <cube-button
                @click="firstSubmit"
                class="n-form-sub"
                type="submit"
                :primary="true"
                :inline="true"
            >{{mode?'重新提交':'提交'}}
            </cube-button>

            <!--保存至草稿箱-->
            <cube-button
                v-if="mode!=1"
                class="n-form-sub"
                :inline="true"
                style="background-color: #16d0ab"
                @click="sendToDraft"
            >保存至草稿箱
            </cube-button>

        </main>
        <!-- 多选框 -->
        <div class="mul-bg" v-if="isMul">
            <div class="mul-wrp">
                <p class="mul-title">请选择项目名称</p>
                <div class="mul-g">
                    <cube-scroll>
                        <cube-checkbox-group v-model="form.title" :options="select.typeOption"/>
                    </cube-scroll>
                </div>
                <div class="mul-btns">
                    <a href="javascript:;" class="mul-btn highlight" @click="mulComfirm">确定</a>
                </div>
            </div>
        </div>

        <!-- 草稿箱-->
        <draft-box
            v-if="isShowDraft"
            @close="isShowDraft=false"
            @edit="setDraftInfo"
            @del="delDraftItem"
            mode="show"
            type="patrol">
        </draft-box>

        <draft-box
            v-if="isShowDraftReplace"
            @close="isShowDraftReplace=false"
            @replace="replacePatrolDraft"
            :dataForm="form"
            mode="replace"
            type="patrol">
        </draft-box>


        <i class="fa fa-file-text-o draft-box"
           @click="isShowDraft=true"
           v-if="mode!=1"
        ></i>

    </div>


</template>

<script>
    import util from "../../../util/util.js";
    import axios from "axios/index";
    import draftBox from "../../../components/draft-box"
    import {
        draftDetail,
        draftIsFull,
        replaceDraft,
        saveDraft,
        savePatrolDraft,
        uploadDraft
    } from "../../../api/draft/patrol";
    import FileAdd from "../../../components/file-add/file-add";
    import {delFile} from "@/api/details/file";
    import {uploadDetailFile} from "@/api/initiate/initiate";
    import {deepCopy} from "../../../util/util";
    import request from "@/api";

    export default {
        components: {
            FileAdd,
            draftBox
        },
        // Data数据
        data() {
            return {
                isMul: false,
                isShowDraft: false,
                isShowDraftReplace: false,
                fileImg: require("../../../assets/fileImg.png"),
                mode: this.$route.query.mode === "change" ? 1 : 0,
                files: [],
                form: {
                    abstract: "",
                    create_time: "",
                    happen_time: "",
                    title: [],
                    details: [
                        {
                            potrol_time: "",
                            potrol_place: "",
                            potrol_content: "",
                            id: "",
                            file: []
                        }
                    ],
                    look_user: [],
                    potrol_scope: "",
                    event_id: "",
                    wp_company: "",
                    look_group: []
                },
                select: {
                    typeOption: [],
                    potrol_scope: [],
                    wp_company: [],
                    potrol_place: [],
                    check_user: [],
                    // nativeCopy:[],
                    copyMen: [],
                    look_group: []
                }
            };
        },
        // 方法
        methods: {
            // 一般选择器
            showPick(name) {
                var sn = name + "Picker";
                var vm = this;

                if (!this[sn]) {
                    this[sn] = this.$createPicker({
                        title: "请选择",
                        data: [this.select[name]],
                        onSelect(value, index, text) {
                            var newFrom = Object.assign({}, vm.form);
                            newFrom[name] = text[0];
                            vm.form = newFrom;
                        }
                    });
                }
                this[sn].show();
            },
            // 日期选择器
            showDatePick(n) {
                var vm = this;
                var name = n + "DatePicker";
                if (!this[name]) {
                    this[name] = this.$createDatePicker({
                        title: "请选择日期",
                        value: new Date(),
                        columnCount: 5,
                        format: {
                            year: "YYYY年",
                            month: "MM月",
                            date: "DD日",
                            hour: "hh时",
                            minute: "mm分"
                        },
                        onSelect(date, val, text) {
                            var newFrom = Object.assign({}, vm.form);
                            newFrom[n] = util.transStamp(date.getTime());
                            vm.form = newFrom;
                        }
                    });
                }
                this[name].show();
            },
            // (明细)日期选择器
            showMXDatePick(n, i) {
                var vm = this;
                var name = n + "MXDatePicker";
                if (!this[name]) {
                    this[name] = this.$createDatePicker({
                        title: "请选择日期",
                        value: new Date(),
                        columnCount: 5,
                        format: {
                            year: "YYYY年",
                            month: "MM月",
                            date: "DD日",
                            hour: "hh时",
                            minute: "mm分"
                        },
                        onSelect(date, val, text) {
                            var newFrom = Object.assign({}, vm.form);
                            if (!newFrom.details[i]) {
                                newFrom.details[i] = {};
                            }

                            newFrom.details[i].potrol_time = util.transStamp(date.getTime());
                            vm.form = newFrom;
                        }
                    });
                }
                this[name].show();
            },
            // (明细)一般选择器
            showMXPick(name, i) {
                var sn = i + "Picker";
                var vm = this;

                if (!this[sn]) {
                    this[sn] = this.$createPicker({
                        title: "请选择",
                        data: [this.select[name]],
                        onSelect(value, index, text) {
                            var newFrom = Object.assign({}, vm.form);
                            if (!newFrom.details[i]) {
                                newFrom.details[i] = {};
                            }
                            newFrom.details[i].potrol_place = text[0];
                            vm.form = newFrom;
                        }
                    });
                }
                this[sn].show();
            },
            //两段日期选择器
            showSegDate(name) {
                var fullName = name + "segDate";
                var vm = this;
                this[fullName] = this.$createSegmentPicker({
                    data: [{
                        is: 'cube-date-picker',
                        title: "请选择巡查开始时间",
                        value: new Date(),
                        columnCount: 5,
                        format: {
                            year: 'YYYY年',
                            month: 'MM月',
                            date: 'D日',
                            hour: "hh时",
                            minute: "mm分"
                        },
                    }, {
                        is: 'cube-date-picker',
                        title: "请选择巡查结束时间",
                        value: new Date(),
                        columnCount: 5,
                        format: {
                            year: 'YYYY年',
                            month: 'MM月',
                            date: 'D日',
                            hour: "hh时",
                            minute: "mm分"
                        },
                    }],
                    onSelect: (date, val, text) => {
                        if (date[0].getTime() > date[1].getTime()) {
                            vm.$createToast({
                                txt: "结束时间不能早于开始时间！",
                                type: "error",
                                time: 1500
                            }).show();
                            return false;
                        }
                        var time = date.map(function (e) {
                            return util.transStamp(e.getTime())
                        });
                        this.form[name] = time.join(",");
                    }
                });
                this[fullName].show();
            },
            //（明细）两段日期选择器
            showMXSegDate(name, index) {
                var vm = this;
                var fullname = name + "MXDatePicker" + index;
                if (!this[fullname]) {
                    this[fullname] = this.$createSegmentPicker({
                        data: [{
                            is: 'cube-date-picker',
                            title: "请选择巡查开始时间",
                            value: new Date(),
                            columnCount: 5,
                            format: {
                                year: 'YYYY年',
                                month: 'MM月',
                                date: 'D日',
                                hour: "hh时",
                                minute: "mm分"
                            },
                        }, {
                            is: 'cube-date-picker',
                            title: "请选择巡查结束时间",
                            value: new Date(),
                            columnCount: 5,
                            format: {
                                year: 'YYYY年',
                                month: 'MM月',
                                date: 'D日',
                                hour: "hh时",
                                minute: "mm分"
                            },
                        }],
                        onSelect(date, val, text) {
                            if (date[0].getTime() > date[1].getTime()) {
                                vm.$createToast({
                                    txt: "结束时间不能早于开始时间！",
                                    type: "error",
                                    time: 1500
                                }).show();
                                return false;
                            }
                            var newFrom = Object.assign({}, vm.form);
                            if (!newFrom.details[index]) {
                                newFrom.details[index] = {};
                            }
                            var time = date.map(function (e) {
                                return util.transStamp(e.getTime())
                            });
                            newFrom.details[index][name] = time.join(",");
                            vm.form = newFrom;
                        }
                    });
                }
                this[fullname].show();
            },
            // 添加附件
            getFile(e) {
                var vm = this;
                var file = e.target.files[0];
                this.files.push({
                    file: file,
                    fileimg: window.URL.createObjectURL(file),
                    file_title: ""
                });
                e.target.value = "";
            },
            // 删除附件
            delFile(i) {
                this.$createDialog({
                    type: "confirm",
                    icon: "cubeic-alert",
                    title: "确定删除附件？",
                    onConfirm: () => {
                        if (typeof this.files[i].file == "string") {
                            var id = this.files[i].id;
                            axios({
                                baseURL: this.$store.state.domain,
                                url: "/api/approval/Delete",
                                headers: {
                                    token: localStorage.getItem("token")
                                },
                                method: "POST",
                                data: {
                                    id: id
                                }
                            })
                                .then(res => {
                                    this.$createToast({
                                        type: "warn",
                                        time: 1000,
                                        txt: "删除成功！"
                                    }).show();
                                    this.files.splice(i, 1);
                                })
                                .catch(res => {
                                    this.$createToast({
                                        type: "warn",
                                        time: 1000,
                                        txt: "操作失败！"
                                    }).show();
                                });
                        } else {
                            this.files.splice(i, 1);

                        }
                    }
                }).show();
            },
            // 事件多选
            showMul() {
                this.isMul = true;
                this.form.title = this.form.title.concat();
            },
            mulComfirm() {
                this.isMul = false;
            },
            // 明细
            addDetail() {
                this.form.details.push({
                    potrol_time: "",
                    potrol_place: "",
                    potrol_content: "",
                    id: "",
                    file: []
                });
            },
            // 添加明细内附件
            addMxFile(item, e) {
                var file = e.target.files[0];
                item.file.push({
                    file: file,
                    image: window.URL.createObjectURL(file),
                    file_title: ""
                });
                this.form.details = this.form.details.concat();
                e.target.value = "";
            },
            // 删除明细内附件
            delMxFile(fileItem, i, files) {
                files.splice(i, 1);
                this.form.details = this.form.details.concat();
            },
            // 删除明细
            delDetail(i) {
                this.$createDialog({
                    type: "confirm",
                    icon: "cubeic-alert",
                    title: "确定删除该明细吗？",
                    onConfirm: () => {
                        var id = this.form.details[i].id;
                        // console.log(id)
                        if (id) {
                            axios({
                                baseURL: this.$store.state.domain,
                                url: "api/patrol/DeletePatrol",
                                headers: {
                                    token: localStorage.getItem("token")
                                },
                                method: "POST",
                                data: {
                                    id: id
                                }
                            })
                                .then(res => {
                                    this.$createToast({
                                        type: "warn",
                                        time: 1000,
                                        txt: "删除成功！"
                                    }).show();
                                    this.form.details.splice(i, 1);
                                })
                                .catch(res => {
                                    this.$createToast({
                                        type: "warn",
                                        time: 1000,
                                        txt: "操作失败！"
                                    }).show();
                                });
                        } else {
                            this.form.details.splice(i, 1);
                        }
                    }
                }).show();
            },
            // 选择抄送人
            showCopy() {
                var vm = this;
                if (!this.copySelectPicker) {
                    this.copySelectPicker = this.$createCascadePicker({
                        title: "请选择抄送人",
                        data: this.select.copyMen,
                        onSelect: (value, index, text) => {
                            this.form.look_user.push(value[1]);
                        }
                    });
                }
                this.copySelectPicker.show();
            },
            // 删除抄送人
            delCopy(i) {
                this.form.look_user.splice(i, 1);
            },
            //图片加载失败
            imgFail(err) {
                if (err.target.currentSrc) {
                    err.target.setAttribute("src", this.fileImg);
                }
            },
            // 回显数据
            echoData(data) {
                this.form.abstract = data.abstract;
                this.form.create_time = data.create_time;
                this.form.happen_time = data.happen_time;
                this.form.potrol_scope = data.potrol_scope;
                this.form.wp_company = data.wp_company;
                this.form.look_user = data.look_user;

                if (data.title == "") {
                    this.form.title = [];
                } else {
                    this.form.title = data.title.split(",");
                }


                var files = [];
                data.file_url.forEach((e, i) => {
                    files.push({
                        file: e.file_url,
                        file_title: e.title,
                        name: e.file_name,
                        fileimg: e.file_url,
                        id: e.id
                    });
                });
                this.files = files;

                data.detail.forEach((e, i) => {
                    var obj = {};
                    obj.potrol_content = e.patrol_content;
                    obj.potrol_place = e.patrol_place;
                    obj.potrol_time = e.patrol_time;
                    obj.id = e.id;
                    obj.file = e.file;

                    if (obj.file) {
                        obj.file.map((fileWrp, fileWrpIndex) => {
                            return {
                                file: fileWrp.file_url,
                                file_title: fileWrp.small_image,
                                image: fileWrp.title,
                            }
                        });
                    } else {
                        obj.file = [];
                    }

                    this.form.details[i] = obj;
                });
            },
            // 报告数据回显
            draftEdit(form) {
                this.echoData(form);
                this.form.event_id = form.id;
                this.isShowDraft = false;
            },
            // 用来过滤掉已提交的文件
            filterFile(ele, index) {
                if (ele.hasOwnProperty('file')) {
                    return true
                }
            },
            // 验证要提交的数据
            dataVerify() {
                //获取表单、文件数据
                var form = this.form;
                var files = this.files;

                // 验证必填项
                if (
                    !form.abstract ||
                    !form.title.length ||
                    !form.create_time ||
                    !form.happen_time ||
                    !form.potrol_scope ||
                    !form.wp_company
                ) {
                    this.$createToast({
                        time: 1000,
                        type: "txt",
                        txt: "请填写所有必填项！"
                    }).show();
                    return false;
                }
                // else if (!this.files.length) {
                //     // 验证综合附件
                //     this.$createToast({
                //         time: 1000,
                //         type: "txt",
                //         txt: "请上传附件！"
                //     }).show();
                //     return false;
                // }
                else if (this.form.create_time < this.form.happen_time) {
                    // 判断报告日期不能早于巡查日期
                    this.$createToast({
                        time: 1000,
                        type: "txt",
                        txt: "错误！报告日期不能早于巡查日期！"
                    }).show();
                    return false;
                }

                // 至少有一个附件
                var details_has_file = this.form.details.some(detail => detail.file.length);
                if (!this.files.length && !details_has_file) {
                    this.$createToast({time: 1000, type: "txt", txt: "请至少上传一个附件！"}).show();
                    return false;
                }

                var details = form.details;
                // 验证明细及明细内附件标题
                var verifyDetails = (element, index) => {
                    // 验证明细是否填写完整
                    if (!element.potrol_content || !element.potrol_place || !element.potrol_time) {
                        this.$createToast({type: "error", txt: `请将明细${index + 1}填写完整！`}).show();
                        return true;
                    }
                    let files;
                    if (!element.file || !element.file.length) {
                        files = [];
                    } else {
                        files = element.file;
                    }
                    files = files.filter(this.filterFile);

                    // 验证明细内附件标题
                    if (files.some((ele, i) => !ele.file_title)) {
                        this.$createToast({type: "error", txt: `请将明细${index + 1}内附件标题填写完整！`}).show();
                        return true;
                    }
                };
                if (details.some(verifyDetails)) {
                    return false
                }
                // 验证综合明细附件标题
                let realFiles = files.filter(this.filterFile);
                if (realFiles.some((ele, i) => !ele.file_title)) {
                    this.$createToast({time: 1000, type: "error", txt: `请将附件标题填写完整！`}).show();
                    return false;
                }
                return true;

            },

            // 新提交
            firstSubmit() {
                // 1.验证数据
                var isVerify = this.dataVerify();
                if (!isVerify) {
                    return false;
                }

                let form = deepCopy(this.form);

                // 2.准备数据
                var sendUrl = "";
                if (this.mode) {
                    sendUrl = "/api/patrol/AgainReport";
                    form.port_id = this.$route.query.id;
                } else {
                    sendUrl = "/api/Patrol/SendPatrol";
                }


                var loading = this.$createToast({txt: '正在提交...', time: 0, mask: true});
                loading.show();


                let counter = form.details.length;
                // 遍历明细
                form.details.forEach((e, i) => {
                    // 将明细内附件提取出FormData，返回的detail内没有本地文件对象
                    let {fileFormData, detail} = this.getDetailFileFormData(i);
                    form.details[i] = detail;
                    // 提交明细内附件
                    uploadDetailFile(fileFormData).then(res => {
                        if (Array.isArray(res.data.data)) {
                            form.details[i].file = form.details[i].file.concat(res.data.data);
                        }
                        counter--;
                        // 明细内附件上传完毕
                        if (counter < 1) {
                            let formData = this.resolveForm(form);
                            // 上传表单+外面的附件
                            request.post(sendUrl, formData).then(res => {
                                loading.hide();
                                this.$root.$createToast({txt: "发布成功", type: "correct"}).show();
                                this.$router.replace('/');
                            }).catch(err => {
                                loading.hide();
                                this.$createToast({txt: "上传表单失败", type: "error"}).show();
                                console.log('上传表单失败（有明细附件）', err);
                            })
                        }
                    }).catch(err => {
                        loading.hide();
                        this.$createToast({txt: "上传明细附件失败", type: "error"}).show();
                        console.log('上传明细附件失败', err);
                    })

                });


            },
            // 处理明细内文件
            getDetailFileFormData(detailIndex) {
                let detail = deepCopy(this.form.details[detailIndex]);
                detail.file = [];

                let filesArr = [];
                this.form.details[detailIndex].file.forEach((e, i) => {
                    if (e.hasOwnProperty('file')) {
                        filesArr.push(e);
                    } else {
                        detail.file.push(e)
                    }
                });

                let fileFormData = new FormData();
                filesArr.forEach((e, i) => {
                    fileFormData.append('file[]', e.file);
                    fileFormData.append('title[]', e.file_title);
                });

                return {
                    fileFormData,
                    detail
                }
            },

            // 处理表单，并转成formData
            resolveForm(form) {
                form.look_user = form.look_user.map(e => e.id);
                form.user_id = localStorage.getItem("user_id");
                form.look_group = form.look_group.map((e, i) => {
                    return e.id
                }).join(",");
                form.details = JSON.stringify(form.details);
                var formData = new FormData();
                for (let key in form) {
                    if (form.hasOwnProperty(key)) {
                        formData.append(key, form[key]);
                    }
                }
                this.files.forEach((e, i) => {
                    formData.append('file[]', e.file);
                    formData.append('file_title[]', e.file_title);
                });

                return formData
            },

            // 验证草稿箱
            draftVerify() {
                var form = this.form;
                var files = this.files;

                // // 过滤掉空明细
                // if (form.details.length > 1) {
                //     form.details = form.details.filter((e, i) => {
                //         return !!(i !== 0 && (e.potrol_content || e.potrol_place || e.potrol_time || e.file.length));
                //     });
                // }


                // 验证明细内附件标题
                var verifyDetails = (element, index) => {

                    let files;
                    if (!element.file || !element.file.length) {
                        files = [];
                    } else {
                        files = element.file;
                    }
                    files = files.filter(this.filterFile);

                    // let files = element.file.filter(this.filterFile);

                    // 验证明细内附件标题
                    if (files.some((ele, i) => !ele.file_title)) {
                        this.$createToast({type: "error", txt: `请将明细${index + 1}内附件标题填写完整！`}).show();
                        return true;
                    }
                };

                if (form.details.some(verifyDetails)) {
                    return false
                }

                // 验证附件标题

                let realFiles = files.filter(this.filterFile);

                if (realFiles.some((ele, i) => !ele.file_title)) {
                    this.$createToast({time: 1000, type: "error", txt: `请将附件标题填写完整！`}).show();
                    return false;
                }

                return true;

            },

            // 保存至草稿箱
            sendToDraft() {
                var vm = this;
                // 验证表单
                if (!this.draftVerify()) {
                    return false;
                }
                var loading = this.$createToast({txt: '正在提交...', time: 0, mask: true});
                loading.show();
                // 验证草稿箱是否已满
                draftIsFull(this.form.event_id).then(res => {
                    if (res.data.status === 1) {
                        // 草稿箱未满，准备提交

                        let form = deepCopy(this.form);
                        let counter = form.details.length;
                        // 遍历明细
                        form.details.forEach((e, i) => {
                            // 将明细内附件提取出FormData，返回的detail内没有本地文件对象
                            let {fileFormData, detail} = this.getDetailFileFormData(i);
                            form.details[i] = detail;

                            // console.log(form);
                            // 提交明细内附件
                            uploadDetailFile(fileFormData).then(res => {
                                if (Array.isArray(res.data.data)) {
                                    form.details[i].file = form.details[i].file.concat(res.data.data);
                                }
                                counter--;
                                // 明细内附件上传完毕
                                if (counter < 1) {
                                    let formData = this.resolveForm(form);
                                    // 上传表单+外面的附件
                                    savePatrolDraft(formData).then(res => {
                                        loading.hide();
                                        this.$root.$createToast({txt: "保存成功", type: "correct"}).show();
                                        this.setDraftInfo(res.data.data)
                                    }).catch(err => {
                                        loading.hide();
                                        this.$createToast({txt: "上传表单失败", type: "error"}).show();
                                        console.log('上传表单失败（有明细附件）', err);
                                    })
                                }
                            }).catch(err => {
                                loading.hide();
                                this.$createToast({txt: "上传明细附件失败", type: "error"}).show();
                                console.log('上传明细附件失败', err);
                            })

                        });
                    } else {
                        // 草稿箱已满，调起替换草稿
                        loading.hide();
                        this.$createToast({txt: '草稿箱已满，请替换草稿', type: 'error', time: 1500}).show();
                        this.isShowDraftReplace = true;
                    }
                }).catch(err => {
                    loading.hide();
                    console.log(err);
                    this.$createToast({txt: '请求失败', type: 'error', time: 1500}).show();
                });
            },


            //  回显草稿信息
            setDraftInfo(id) {
                draftDetail(id).then(res => {
                    this.echoData(res.data.data[0])
                });
                this.form.event_id = id;
                this.isShowDraft = false;
            },

            //  替换草稿
            replacePatrolDraft(id) {
                let form = deepCopy(this.form);

                var loading = this.$createToast({txt: '正在提交...', time: 0, mask: true});
                loading.show();

                let counter = form.details.length;
                // 遍历明细
                form.details.forEach((e, i) => {

                    // 将明细内附件提取出FormData，返回的detail内没有本地文件对象
                    let {fileFormData, detail} = this.getDetailFileFormData(i);
                    form.details[i] = detail;

                    console.log(form);
                    // 提交明细内附件
                    uploadDetailFile(fileFormData).then(res => {
                        if (Array.isArray(res.data.data)) {
                            form.details[i].file = form.details[i].file.concat(res.data.data);
                        }
                        counter--;
                        // 明细内附件上传完毕
                        if (counter < 1) {
                            let formData = this.resolveForm(form);
                            formData.set('event_id', id);
                            // 上传表单+外面的附件
                            replaceDraft(formData).then(res => {
                                loading.hide();
                                this.$root.$createToast({txt: "保存成功", type: "correct"}).show();
                                this.isShowDraftReplace = false;
                            }).catch(err => {
                                loading.hide();
                                this.$createToast({txt: "上传表单失败", type: "error"}).show();
                                console.log('上传表单失败（有明细附件）', err);
                            })
                        }
                    }).catch(err => {
                        loading.hide();
                        this.$createToast({txt: "上传明细附件失败", type: "error"}).show();
                        console.log('上传明细附件失败', err);
                    })

                });


                // var vm = this;
                // var data = this.resolveData(false);
                // if (!data) {
                //     return false;
                // }
                // data.form.event_id = id;
                // var tip = this.$createToast({txt: "正在保存至草稿箱...", time: 0, mask: true});
                // tip.show();
                //
                // replaceDraft(data.form).then(respond => {
                //     // 表单提交成功
                //

                //     this.form.event_id = id;
                //     if (respond.data.status == 1) {
                //         console.log(respond)
                //         // 草稿箱未满，表单已提交
                //         if (data.files.length) {
                //             // 有文件
                //             var count = 0;
                //             data.files.forEach((e, i) => {
                //                 var fd = new FormData();
                //                 fd.append("file", e.file);
                //                 fd.append("title", e.file_title);
                //                 fd.append("event_id", id);
                //                 fd.append("user_id", localStorage.getItem("user_id"));
                //                 // 提交文件
                //                 uploadDraft(fd).then(res => {
                //                     count++;
                //                     if (count >= data.files.length) {
                //                         // 文件全部提交成功
                //                         tip.hide();
                //                         this.$createToast({txt: '替换成功', type: 'correct', time: 1500}).show();
                //                         this.isShowDraftReplace = false;
                //                         this.setDraftInfo(id);
                //                     }
                //                 }).catch(err => {
                //                     console.log(err);
                //                     tip.hide();
                //                     vm.$createToast({time: 1500, type: "error", txt: "文件上传失败!"}).show();
                //                     return false;
                //                 })
                //             })
                //         } else {
                //             // 无文件
                //             tip.hide();
                //             this.$createToast({txt: '替换成功', type: 'correct', time: 1500}).show();
                //             this.isShowDraftReplace = false;
                //             this.setDraftInfo(id);
                //         }
                //     } else {
                //         // 其他原因
                //         tip.hide();
                //         this.$createToast({txt: '未知错误', type: 'error', time: 1500}).show();
                //     }
                // }).catch(err => {
                //     console.log(err)
                //     // 表单提交失败
                //     tip.hide();
                //     this.$createToast({txt: '表单提交失败', type: 'error', time: 1500}).show();
                // })
            },
            //  删除草稿项
            delDraftItem(id) {
                if (id == this.form.event_id) {
                    location.reload();
                }
            },
            // 选择抄送群组
            showLookGroupPicker() {
                var vm = this;
                if (!this.LookGroupPicker) {
                    this.LookGroupPicker = this.$createPicker({
                        title: "请选择",
                        data: [this.select.look_group],
                        onSelect(value, index, text) {
                            if (value[0]) {
                                var newFrom = Object.assign({}, vm.form);
                                newFrom.look_group.push(value[0]);
                                vm.form = newFrom;
                            }

                        }
                    })
                }
                this.LookGroupPicker.show();
            },
        },
        computed: {},
        filters: {
            StamptoString(v) {
                return util.stampToString(v);
            },
            StamptoTime(v) {
                return util.stampToString(v, "/", true);
            },
            mulType(v) {
                return v.join(",");
            },
            transSegTime(v) {
                return v.split(",").map((e) => {
                    return util.stampToString(e, "/", true)
                }).join(" - ");
            }
        },
        mounted() {
            // 请求页面信息
            axios({
                baseURL: this.$store.state.domain,
                url: "/api/Patrol/CallBack",
                method: "POST",
                data: {
                    user_id: localStorage.getItem("user_id")
                }
            }).then(res => {
                var data = res.data.data;
                // 事件类型
                data.title.forEach((e, i) => {
                    this.select.typeOption.push(e.content);
                });
                // 巡查范围
                data.potrol_scope.forEach((e, i) => {
                    if (!this.select.potrol_scope[i]) {
                        this.select.potrol_scope[i] = {};
                    }
                    this.select.potrol_scope[i].text = e.content;
                    this.select.potrol_scope[i].value = e.content;
                });
                // 所属外判公司
                data.wp_company.forEach((e, i) => {
                    if (!this.select.wp_company[i]) {
                        this.select.wp_company[i] = {};
                    }
                    this.select.wp_company[i].text = e.content;
                    this.select.wp_company[i].value = e.content;
                });
                // 巡查地点
                data.potrol_place.forEach((e, i) => {
                    if (!this.select.potrol_place[i]) {
                        this.select.potrol_place[i] = {};
                    }
                    this.select.potrol_place[i].text = e.content;
                    this.select.potrol_place[i].value = e.content;
                });
                // 审批人
                this.select.check_user = data.check_user;
            });
            /**
             * 2019/4/10
             * 修改抄送人二级联动选择
             * tang
             */
            axios({
                baseURL: this.$store.state.domain,
                url: "/api/report/lookuser",
                method: "POST",
                data: {}
            }).then(res => {
                var data = res.data.data;
                var list = [];
                data.forEach((e, i) => {
                    var dep = {};
                    dep.value = e.department;
                    dep.text = e.department;
                    dep.children = [];
                    e.user.forEach((e, i) => {
                        var user = {};
                        user.value = e;
                        user.text = e.username;
                        dep.children.push(user);
                    });
                    list.push(dep);
                });
                this.select.copyMen = list;
            });

            // 请求回显数据
            if (this.mode) {
                var id = this.$route.query.id;
                axios({
                    baseURL: this.$store.state.domain,
                    url: "/api/patrol/Details",
                    method: "POST",
                    headers: {
                        token: localStorage.getItem("token")
                    },
                    data: {
                        user_id: localStorage.getItem("user_id"),
                        port_id: id
                    }
                }).then(res => {
                    var data = res.data.data[0];
                    this.echoData(data);

                });
            }

            // 获取抄送群组信息
            axios({
                baseURL: this.$store.state.domain,
                url: "/api/approval/TransGroup",
                method: "POST",
                data: {}
            })
                .then(res => {
                    let data = res.data.data;
                    let arr = [];
                    data.forEach((e, i) => {
                        let obj = {};
                        obj.text = e.name;
                        obj.value = e;
                        arr.push(obj);
                    })
                    this.select.look_group = arr;

                })
        }
    };
</script>

<style>
    .inline-pick {
        color: #bbb;
        font-size: 0.875rem;
        flex: 1 0 0;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        flex-wrap: nowrap;
        text-align: right;
        max-width: 76%;
    }

    .inline-pick span {
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    .inline-input {
        outline: none;
        line-height: 2.2rem;
        font-size: 0.875rem;
        color: #333;
        text-align: right;
        width: 14rem;
    }

    .form-inline {
        line-height: 2.8rem;
        display: flex;
        padding: 0 15px;
        margin-top: 20px;
        background-color: #fff;
        align-items: center;
        justify-content: space-between;
    }

    .form-item-wrp {
        margin-top: 20px;
        background-color: #fff;
        padding: 15px;
    }

    .form-title {
        font-weight: 500;
        font-size: 0.875rem;
        white-space: nowrap;
        flex-wrap: nowrap;
    }

    .required {
        color: rgb(255, 0, 76);
        font-weight: bold;
    }

    /* *********** */

    .potrol-page {
        color: #333;
        font-size: 0.7rem;
    }

    ::placeholder {
        color: #bbb;
        font-size: 0.875rem;
    }

    .item-bor {
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
    }

    .md-item {
        line-height: 2.8rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #eee;
    }

    .md-bk {
        border-bottom: 1px solid #eee;
        padding: 15px 0;
    }

    .md-bk:last-child {
        border-bottom: none;
    }

    .add-mdetial {
        color: rgba(85, 133, 240, 1);
        line-height: 2.8rem;
        padding: 0 15px;
        font-weight: 500;
        font-size: 0.9rem;
        background-color: #fff;
        border-bottom: 1px solid #eee;
    }

    .add-ul {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: -20px;
    }

    .add-ul > * {
        margin-right: 19px;
        margin-bottom: 20px;
    }

    .appro-men {
        width: 3.1rem;
        position: relative;
    }

    .appro-men img {
        width: 3.1rem;
        height: 3.1rem;
        border-radius: 4px;
        background-color: #eee;
        border: none;
        border-color: transparent;
    }

    .appro-men p {
        color: #888;
        margin: 0 auto;
        text-align: center;
        word-break: break-all;
        /* white-space: nowrap; */
        line-height: normal;
        font-size: 0.7rem;
    }

    .del-wrp {
        display: block;
        padding: 0.6rem;
        margin: 0;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(50%, -50%);
    }

    .f-imgs-wrp {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: -20px;
        flex-direction: column;
    }

    /* 添加文件标题修改样式 */
    .file-selected-img {
        display: flex;
        width: 98%;
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
        width: 80%;
    }

    .file_description > p {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 1rem;
        line-height: 1.2em;
    }

    .file_description > p:nth-child(2) {
        color: #888;
        font-size: 0.875rem;
    }

    .file-selected-img img {
        width: 3.1rem;
        height: 3.1rem;
        border-radius: 4px;
    }

    .added__files {
        margin-bottom: 1.2rem;
    }


    .n-form-sub {
        width: 90%;
        height: 2.4rem;
        font-size: 1rem;
        margin: 20px auto;
        display: block;
    }

    .mx-t {
        margin: 10px 10px 10px;
        color: #bbb;
        position: relative;
        font-size: 0.875rem;
    }

    .attach_file {
        background-color: #fff;
        padding: 15px;
        margin-top: 20px;
    }

    .del-mx {
        color: #ee4452;
        padding: 0.8rem;
        display: block;
        text-align: right;
    }

    .mx-gd-item {
        transition: all 0.5s;
    }

    .mx-gd-leave-active {
        position: absolute;
        left: 0;
        right: 0;
    }

    input[disabled] {
        background-color: transparent;
    }

    .file-name__input {
        padding: 10px;
        color: #666;
        border-radius: 2px;
        box-sizing: border-box;
        border: 1px solid #f2f0f0;
        outline: none;
        width: 98%;
        margin-top: -1px;
    }

    i.draft-box {
        width: 2.5rem;
        height: 2.5rem;
        line-height: 2.5rem;
        font-size: 1.2rem !important;
        text-align: center;
        border-radius: 50%;
        color: #fff;
        background-color: #3081fb;
        box-shadow: 0 2px 7px rgba(48, 129, 251, .8);
        position: fixed;
        bottom: 1.5rem;
        right: 1.5rem;
        z-index: 9;
        cursor: pointer;
    }

    .add-file-wrp {
        display: block;
        padding: 15px 0;
        color: rgb(22, 208, 171);
    }

    .copy-men-wrp {
        display: flex;
        flex-wrap: wrap;
    }

    .look-group__wrap {
        margin: 0 1rem 1rem 0;
    }

    .look-group__item {
        border: 1px solid #ccc;
        padding: 0.5rem 1.3rem;
        color: #888888;
        position: relative;
    }

    .look-group__del {
        position: absolute;
        padding: 0.5rem;
        left: 100%;
        top: 0%;
        transform: translate(-50%, -50%);
    }

    .copy-add {
        width: 50px;
        height: 50px;
        background-color: #fff;
        display: inline-block;
        border: 1px solid #e5e5e5;
        border-radius: 2px;
        position: relative;
    }


</style>
