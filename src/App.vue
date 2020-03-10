<template>
  <div id="app">
    <keep-alive :include="keepAlivePage">
      <router-view/>
    </keep-alive>

  </div>
</template>

<script>
  import axios from "axios";
  import util from "./util/util.js";
  import {mapState} from "vuex";


  export default {
    computed: {
      ...mapState(['keepAlivePage'])
    },
    mounted() {
      var code = util.getUrlParam("code");
      if (code) {
        axios({
          baseURL: this.$store.state.domain,
          url: "/api/WxToken/getToken",
          method: "POST",
          data: {
            code: code
          }
        })
          .then(res => {
            var data = res.data.data;
            var token = data.token.token;
            var user_id = data.user_id;
            var status = data.status;
            localStorage.setItem("token", token);
            localStorage.setItem("user_id", user_id);
            localStorage.setItem("status", status);
            localStorage.setItem("department", data.department);
            localStorage.setItem('is_look', data.is_look);
            localStorage.setItem('user_name', data.token.user.name);
            // console.log("登录成功！" + data.token.user.name);
            this.$createDialog({
              type: "alert",
              title: "欢迎您，" + data.token.user.name,
              icon: "cubeic-ok",
              onConfirm() {
                location.href = "/#/";
              },
              onCancel() {
                location.href = "/#/";
              }
            }).show();
          })
          .catch(err => {
            this.$createDialog({
              type: "alert",
              title: "登录失败，请退出重试！",
              icon: "cubeic-close",
              onConfirm() {
                location.href = "/#/";
              },
              onCancel() {
                location.href = "/#/";
              }
            }).show();
          });
      }
    }
  };
</script>


<style>
  .tab-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
  }

  .nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
  }

  .nav-main-tab {
    margin: 3rem 0;
  }

  .nav-main {
    margin-top: 3rem;
    border-top: 1px solid transparent;
  }

  /*@font-face {*/
  /*  font-family: 'Alibaba-PuHuiTi-Regular';*/
  /*  src: url('./assets/font/Alibaba-PuHuiTi-Regular.ttf') format('truetype');*/
  /*}*/
  /*@font-face {*/
  /*  font-family: '冬青黑体';*/
  /*  src: url('./assets/font/DongQingHeiTi.otf') format('truetype');*/
  /*} */
  /*@font-face {*/
  /*  font-family: 'Microsoft YaHei';*/
  /*  src: url('./assets/font/msyh.ttc') format('truetype');*/
  /*}*/


  body, html {
    background-color: #fff;
    touch-action: manipulation;
    font-family: "Microsoft YaHei", "微软雅黑", -apple-system, " SF UI Text ", " Helvetica Neue ", Arial, " PingFang SC ", sans-serif;
    max-width: 620px;
    margin: 0 auto;
  }

  /* .cube-popup ,.cube-popup_mask ,.cube-picker{
    max-width: 620px;
    margin: 0 auto;
  } */
  .file-icon {
    width: 3.1rem;
    height: 3.1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
  }

  .file-icon::after {
    content: "";
    display: block;
    width: 2.2rem;
    height: 2.2rem;
    background: url(data:image/png;base64,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) no-repeat;
    background-size: 100% 100%;
  }

  .add-icon {
    width: 3.1rem;
    height: 3.1rem;
    border: 1px solid #ddd;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    box-sizing: border-box;
  }

  .add-icon::after {
    content: "";
    display: block;
    width: 2.2rem;
    height: 2.2rem;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABmJLR0QA/wD/AP+gvaeTAAACYElEQVRYCe3VQWrCUBSFYX1x7NQFiOIiOukeHHXYYXfRVTjqXqR76KTBbqATN5DQJzQgwh0U/uYa+EuCyaWc+/gO6GzmnwIKKKCAAgoooIACCiiggAIKKKCAAgoooIACCiiggAIjCsxH3IWvatt2WUpZDcF93583m8338D7FzzLFQw9nrmXs6/PncNf31/o86WvShUxaPji8hQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1tpAs+WCvhQQwWWMLyZIP9lpIAJM1XhCL27ZdllL2RNYfMx5u/n93Op2eb2b//tp13XG73X4Ri5BCahmrepi3emdfj/UAl7t+jHc1TfNUtyGFlBrkdUcCFnJHZVyOgnxl9X1/rl9bh0vgyPeu7rv+ivqo7+/1HvtqqYVzKigj5/cH/Pq367Ber18yzkLtLFSQOYyAhTCOWIqFYJRMkIUwjliKhWCUTJCFMI5YioVglEyQhTCOWIqFYJRMkIUwjliKhWCUTJCFMI5YioVglEyQhTCOWIqFYJRMkIUwjliKhWCUTJCFMI5YioVglEyQhTCOWIqFYJRMkIUwjliKhWCUTJCFMI5YioVglEyQhTCOWIqFYJRMkIUwjljKAktKCOq67tg0zdPV6vbq2UcFFFBAAQUUUEABBRRQQAEFFFBAAQUUUEABBRRQQAEFFFBgYgI/2D4rKWMSNY4AAAAASUVORK5CYII=) no-repeat;
    background-size: 100% 100%;
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

  .del-icon::after {
    content: "";
    display: block;
    width: 0.7rem;
    height: 0.7rem;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGgAAABoCAYAAAAdHLWhAAAABmJLR0QA/wD/AP+gvaeTAAAGgElEQVRYCe2Z3W9UVRTFZ0oLmhhAWt+MUUM0RNSSKIkvRqKtEYkWYpSSGP8AH4xv6j+gb/4LklKxpQ01IX5EHuRBeVApmhhfJH5hEB+IUQTaouNv3/Sak0mn9/Psc+6wJ2vNvjNz7tnrrDV35s6dVstu5oA5YA6YA+aAOWAOmAPmgDlgDpgD5oA5YA6YA+aAOWAOmAPmgDlgDlRyoF1p7wI7dzqdYYY/DC/BxXa7vUJtBNB+O0J3wXPwO7R3qP0BFteGb8JlmOI8G3tiXyEab4Fz0MUZHtwVu/Zc+ljIIDwK18ISTz6ba6IAg9B2K/wSroXfePK+ALLqa8kCJJz3qOtBQpqor2s9MyF4G+wVDi8luMj9zno6Ks+CcAlnhpoHUYWEYAnnK2oeXGRQs0JCcJFwGJ4gipBQUiQchieQkO5XPgbKtUOuhDNLLYOgISG4TDjsluB37uMOCYFD8BisAjnTU/9OQnCVcNg9gYT0QLm3tue9kCfhzFHrgGpICJZw5NSZzcq4xAwPeba72PQIknDmqXVCJSQE1xkO0yWQkOQHeTEjfY1G0tvQB64y6VMedW9m/s+gD/zKpLf50p57XkTIO3CF6gvXmLj2kJhTwvmc6hNv5DZynYED67yW56VRBg1CX9jExMdxcS+1FjDXZib6CD4CfWJ3HZNXDeiPOkRkzCEhLWDs/oxxmS8zh1ywPcVA3+HQolWLN1UD+hYlF6BvDNFArumVPpIIZwtznICjUAMnNZpk9mDhj0P5rqB4h/QpHBKqtsDTUAuzNKr65s/0PvcAxDwBr0ANyCn4gbziEDQMF6EWpmi0Ia8+tXGIGoNaIV2n18GsxTHGwnFNwhDtkCbd/u42WkagHTmuKbKNKcFDQoOEc5aqhTg/1iSQtYgrwUKit4WzVijdz2GUekj07Ltw2t3G1vkYw/Yx3zzcCH1jmQbn4A6ogQWaPN9ut1eo3uA1IFFNSGPU9+HNsF8wzUJeIpx/qF7hPSBR32chqYUj3qn82uWd9gnNJuBV2GSohiNGqRxB0kjIkTROXYBN/LhTDwefWqoBScPVkOQ76SZ53BAGCSeYNxISlH9MKdHjCArju7bmOz0WPQ5jD+nGDCcNn4BiDunGDifykCycNCCpkR1JFo6E0k1CehKG/k6ycLqDcR8TUMiQLBw3jF7bgUKapm+Up9Iql3p6hdHj+dM8/z3UxAyXo7xf+NRckJdevIuH4RmojWUaTnhZVL9MikGhwqF1Agup15sJeyScRWpoWEjdIZFILOEgJYGFlIaEHbGFg6QEEtL+VGfIqv53Q7pYbBhm+yQchTFiBVEvcHZ3nBoMQQJqQDhpIMFDUg+oQeFEEZLqD9UGhiMhDXE3g/YDVHWoBcQCY//OWc98CWmWNRxcb5CP11QCYmEjiI/5hAB5mZBrdXJBdTJzZI0DvH8HOeE8WKPukFPJNbsXObs7qiHCa0CEs5VFfAx3w37CEot5jpBOUL3C20cc4Yyg/NNWq6UVzmF67YGXoW9sosECa5ykNg8IH4FnoRbeoVHyZqM+Cv+CGrhOk0ONSgjB2uEcpmcSTmoUjy2k1Ay3YkyIcOTsypWRbKPFQkqcWL3DkGjCWZXUQpOFJGZghITzNVUL8rG25pEjelwiSEK6TNVAfN9JrHor/AJq4RiNBt0QsrYZvxdegxpYoskzWZrUXkfMHNRC4XBSIxCoGZIcsXenvYNVFn0H1IKEI9fESq8XoZohvVVaqLPjgLNdZnNnmZ1K7DPPPof45S7/z7BZDuz/AXvKVeklqm/U4k3VgH7yvUrmn4Lyz2alcJgjwWpI4zz4G/rEj63QNz4yBuA30BfmmbjSx1ovj5j3aejrxOFf5n6sFcMNIffAC7BueAsn9Q3BvkJ6Pe0RRWWhd8IfOvXdpphqg8bi6DMGr8C68KqG7sI9WF1dIamFky4S7XWFFGc4zkKrhqQejqO9akhxh+MsdDvvyF9gUUyxg8rHWqq1u9K/bEjNCCddMAstGlLwcBztRUNqVjjOQvOGFE04jva8ITUzHGehWSEd4WgL+rGWau2u6MoKqdnhpAtmoTvgz7AbszyxMR0XY0XfPigXPin/Q36Evqalt63RiKVto88rcBf8E34I3+WyS4caNdC+HYEvw3vheTiN7lNUgzlgDpgD5oA5YA6YA+aAOWAOmAPmgDlgDpgD5oA5YA6YA+aAOWAOmAPmgDlgDvS7A/8B7bAxafN/uOgAAAAASUVORK5CYII=) no-repeat;
    background-size: 100% 100%;
  }

  input[type="file"] {
    width: 0;
    height: 0;
    opacity: 0;
    position: fixed;
    right: 100%;
  }
</style>



