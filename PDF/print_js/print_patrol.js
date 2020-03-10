
var vm = new Vue({
  el: "#report",
  data: function () {
    return {
      list: "",
      isOk: true,
      operationlist: [],
      details: [],
      showBtn: true
    }
  },
  methods: {
    getUrlParam: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
      var r = encodeURI(window.location.search).substr(1).match(reg);
      if (r != null) {
        return unescape(r[2]);
      }
      return null;
    },
    //时间戳转日期
    getDate(startTime, endTime) {
      var s1 = new Date(startTime.replace(/-/g, "/")),
        s2 = new Date(endTime),
        runTime = parseInt((s2.getTime() - s1.getTime()) / 1000);
      var year = Math.floor(runTime / 86400 / 365);
      runTime = runTime % (86400 * 365);
      var month = Math.floor(runTime / 86400 / 30);
      runTime = runTime % (86400 * 30);
      var day = Math.floor(runTime / 86400);
      runTime = runTime % 86400;
      var hour = Math.floor(runTime / 3600);
      runTime = runTime % 3600;
      var minute = Math.floor(runTime / 60);
      var str = "";
      if (year) {
        str += year + "年"
      }
      if (month) {
        str += month + "月"
      }
      if (day) {
        str += day + "天"
      }
      if (hour) {
        str += hour + "小时"
      }
      if (minute) {
        str += minute + "分钟"
      }
      return str;
    },
    getPdf: function () {
      var port_id = this.getUrlParam("port_id");
      document.getElementsByClassName("pdfBtn")[0].innerText = "";
      var html = document.getElementsByTagName('html')[0].innerHTML;
      document.getElementsByClassName("pdfBtn")[0].innerText = "正在导出PDF...";
      this.isOk = false;
      axios({
        url: "api/report/WorkPdf",
        method: "POST",
        data: {
          id: port_id,
          html: html
        }
      }).then(res => {
        this.isOk = true;
        document.getElementsByClassName("pdfBtn")[0].innerText = "导出PDF";
        var url = res.data.data;
        // location.href = url;
        window.open(url);
      })
    }
    // getPdf: function () {
    //   var vm = this;
    //   var element = document.querySelector("#report-content");
    //   var w = element.clientWidth; // 获得该容器的宽
    //   var h = element.clientHeight; // 获得该容器的高
    //   var canvas = document.createElement("canvas");
    //   var scale = 2;
    //   canvas.width = w * scale; // 将画布宽&&高放大两倍
    //   canvas.height = h * scale;
    //   canvas.getContext("2d").scale(scale, scale);
    //   var opts = {
    //     scale: scale,
    //     canvas: canvas,
    //     width: w,
    //     height: h,
    //     useCORS: true,
    //     backgroundColor: '#ffffff'
    //   };
    //   html2canvas(element, opts).then(function (canvas) {
    //     var contentWidth = canvas.width;
    //     var contentHeight = canvas.height;
    //     //一页pdf显示html页面生成的canvas高度;
    //     var pageHeight = contentWidth / 592.28 * 841.89;
    //     //未生成pdf的html页面高度
    //     var leftHeight = contentHeight;
    //     //页面偏移
    //     var position = 0;
    //     //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
    //     var imgWidth = 595.28;
    //     var imgHeight = 592.28 / contentWidth * contentHeight;

    //     var pageData = canvas.toDataURL('image/jpeg', 1.0);

    //     var pdf = new jsPDF('', 'pt', 'a4');

    //     //有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
    //     //当内容未超过pdf一页显示的范围，无需分页
    //     if (leftHeight < pageHeight) {
    //       pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight);
    //     } else { // 分页
    //       while (leftHeight > 0) {
    //         pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
    //         leftHeight -= pageHeight;
    //         position -= 841.89;
    //         //避免添加空白页
    //         if (leftHeight > 0) {
    //           pdf.addPage();
    //         }
    //       }
    //     }
    //     pdf.save(vm.list.work_num + '.pdf');

    //   })
    // }
  },
  computed: {

  },
  filters: {
    // 审批状态
    transStatus(v) {
      switch (v) {
        case 1:
          return "待审批";
        case 2:
          return "已通过";
        case 3:
          return "已驳回";
        case 4:
          return "跟进中";
        case 5:
          return "转审中";
      }
    },

  },
  mounted: function () {
    var vm = this;
    var port_id = this.getUrlParam("port_id");
    axios({
      url: "/api/patrol/printing",
      method: "POST",
      data: {
        port_id: port_id
      }
    }).then(res => {
      var list = res.data.data[0];
      vm.list = list;
      console.log(list);
      var operationlist = [];
      var operation = list.operation;
      var details = list.detail;
      for (var i = 0; i < operation.length; i++) {
        if (i == 0) {
          operationlist.push({
            content: operation[i].content || '',
            create_time: list.create_time,
            update_time: operation[i].create_time,
            time: this.getDate(list.create_time, operation[0].create_time),
            star: '/',
            status: operation[i].status,
            username: operation[i].username
          })
        } else {
          operationlist.push({
            content: operation[i].content,
            create_time: operation[i - 1].create_time,
            update_time: operation[i].create_time,
            time: this.getDate(operation[i - 1].create_time, operation[i].create_time) ? this.getDate(operation[i - 1].create_time, operation[i].create_time) : '0',
            star: operation[i].star ? operation[i].star : '/',
            status: operation[i].status,
            username: operation[i].username
          })
        }

      }
      this.operationlist = operationlist;
      console.log(operationlist);
      this.list.rate = list.status == 2 ? list.operation[operation.length - 1].star : '未评分';

      // 图片拆分2个一组
      var imgList = [];
      list.file_url.forEach((e, i) => {
        var postfixArr = list.file_url[i].file_url.split(".");
        var postfix = postfixArr.pop().toLowerCase();
        console.log(postfix);
        if (postfix == 'png' || postfix == 'jpg' || postfix == 'jpeg' || postfix == 'gif') {
          imgList.push(e)
        }
      });
      var imgs = [];
      for (var i = 0; i < imgList.length; i += 2) {
        imgs.push(imgList.slice(i, i + 2));
      }
      this.list.imgs = imgs;
      var detailsImg = [];
      details.forEach((detail, index) => {
        var files = detail.file;
        if (files) {
          files.forEach((item, i) => {
            // console.log(item);
            var postfixArr = item.file_url.split(".");
            var postfix = postfixArr.pop().toLowerCase();
            // console.log(postfix);
            if (postfix == 'png' || postfix == 'jpg' || postfix == 'jpeg' || postfix == 'gif') {
              detailsImg.push(item)
            }
          })
        }

      })
      var detailsImgs = [];
      for (var i = 0; i < detailsImg.length; i += 2) {
        detailsImgs.push(detailsImg.slice(i, i + 2));
      }
      console.log(detailsImg);
      this.details = detailsImgs;
    })



  },
  created() {
    var vm = this;
    document.onreadystatechange = function () {
      console.log(document.readyState)
      if (document.readyState == 'complete') {
        vm.isOk = true
      }
    }
  },
})

