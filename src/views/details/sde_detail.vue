<template>
    <div class="detail-page bg-white">
        <main class="fs08 pd20">
            <!-- 标题 -->
            <div class="head-wrp">
                <div class="head-left">
                    <img :src="desc.user_logo" class="fa fa-user-circle detail-head-img crtm">
                    <h3 class="detail-user-info">
                        <span class="detail-head-text detail-head-title">{{desc.username}}</span>
                        <span class="detail-head-text ">取号
                            <span
                                :style="{color:getSEDStatus.color,borderColor:getSEDStatus.color}"
                                class="r-status"
                            >{{getSEDStatus.desc}}
                            </span>
                        </span>
                        <span class="detail-head-text ">员工号：{{desc.userid}}</span>
                        <span class="detail-head-text ">部门：{{desc.department}}</span>
                        <span class="detail-head-text ">职位：{{desc.position}}</span>

                    </h3>

                </div>
            </div>
            <!-- 详细列表 -->
            <section class="part-list">
                <h5 class="p-title">SDE取号编号</h5>
                <span class="p-desc">{{desc.work_num}}</span>
            </section>
            <section class="part-list">
                <h5 class="p-title">文件类型</h5>
                <span class="p-desc">{{desc.file_type}}</span>
            </section>
            <section class="part-list">
                <h5 class="p-title">文件名</h5>
                <span class="p-desc">{{desc.title}}</span>
            </section>
            <section class="part-list">
                <h5 class="p-title">文件用途</h5>
                <span class="p-desc">{{desc.file_use || '无'}}</span>
            </section>
            <section class="part-list">
                <h5 class="p-title">写件人</h5>
                <span class="p-desc">{{desc.username}}</span>
            </section>
            <div class="divider"></div>

            <cube-button
                class="form-sub"
                type="submit"
                :primary="true"
                :inline="true"
                id="copyBtn"
                :data-clipboard-text="desc.work_num"
            >复制编号
            </cube-button>

        </main>
    </div>
</template>

<script>
    import axios from 'axios/index';
    import clipboard from "clipboard";

    export default {
        name: "sde_detail",
        data() {
            return {
                desc: {}
            }
        },
        methods: {},
        computed: {
            getSEDStatus() {
                var obj = {};
                switch (this.desc.status) {
                    case 1:
                        obj.color = "rgb(0,22,255)";
                        obj.desc = "未提交";
                        break;
                    case 2:
                        obj.color = "#42b8a1";
                        obj.desc = "已提交";
                        break;
                    case 3:
                        obj.color = "#ec595c";
                        obj.desc = "退回修改";
                        break;
                }
                return obj;
            }
        },
        mounted() {
            // 请求页面
            axios({
                baseURL: this.$store.state.domain,
                url: "/api/TakeNumber/Detail",
                method: "POST",
                headers: {
                    token: localStorage.getItem("token")
                },
                data: {
                    port_id: this.$route.params.id
                }
            }).then(res => {
                console.log(res);
                this.desc = res.data.data[0];
            })
            //复制编号
            var copy = new clipboard('#copyBtn');
            var vm = this;
            copy.on('success', function (e) {
                vm.$createToast({
                    txt: "复制编号成功",
                    type: "correct",
                    time: 1000
                }).show();
            });

            copy.on('error', function (e) {
                vm.$createToast({
                    txt: "复制编号失败",
                    type: "error",
                    time: 1000
                }).show();
            });
        }
    }

</script>

<style scoped>
    .form-sub--red {
        background-color: #ff385c;
    }


</style>