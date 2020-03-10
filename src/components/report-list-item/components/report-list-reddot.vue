<template>
    <div class="reddot" v-if="isShow"></div>
</template>

<script>
    export default {
        name: "report-list-reddot",
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                isShow: false
            }
        },
        mounted() {
            if (this.$route.path !== '/approval') {
                this.isShow = false
            } else {
                this.isShow = this.show;
            }
        }
    }
</script>

<style scoped>
    .reddot {
        width: 0.5rem;
        height: 0.5rem;
        background-color: #ff425b;
        border-radius: 50%;
        margin-left: 0.5rem;
    }
</style>