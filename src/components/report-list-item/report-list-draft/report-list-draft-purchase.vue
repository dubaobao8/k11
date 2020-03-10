<template>
  <report-list-tamplate-draft :data="data_info" @click="gotoDetail" @del:draft="delDraft"/>
</template>

<script>
  import ReportListTamplateDraft from "@/components/report-list-item/components/report-list-tamplate-draft";
  import {DeletePurchaseDraft} from "@/api/initiate/purchase";


  export default {
    name: "report-list-draft-purchase",
    components: {
      ReportListTamplateDraft,
    },
    props: {
      data: Object
    },
    methods: {
      gotoDetail() {
        this.$router.push("/purchase?mode=draft&draft_id=" + this.data.id);
      },
      delDraft() {
        this.$createDialog({
          title: "确认删除该草稿？",
          icon: "cubeic-warn",
          type: "confirm",
          onConfirm: () => {
            DeletePurchaseDraft(this.data.id).then(res => {
              this.$toast.success({message: '已删除该草稿！', mask: true});
              setTimeout(() => location.reload(), 800);
            }).catch(err => {
              this.$toast.fail('删除失败！');
            })
          }
        }).show();

      }
    },
    computed: {
      data_info() {
        let data = this.data;
        return {
          title: `采购/报销单 - 草稿`,
          info_list: [{
            key: "采购/报销主题",
            value: data.title,
          }, {
            key: "采购用途",
            value: data.type,
          }, {
            key: "采购用途",
            value: data.work_num,
          }],
          date: data.create_time
        }
      }
    }
  };
</script>

