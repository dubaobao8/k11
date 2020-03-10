<!-- 图片（文件）浏览器 -->
<template>
  <div v-show="files.length">
    <!-- 缩略图，可左右切换 -->
    <section class="thumb-wrp">
      <swiper :options="config.thumb" ref="thumb" @slideChange="onThumbChange">
        <swiper-slide v-for="(item,index) in AllFiles.thumb_files">
          <span
            :href="item.image"
            :key="Date.now() * Math.random()"
            @click="showViewer(item,$event)"
            class="thumb__item">
            <img :src="item.image"
                 class="thumb__img">
            <p class="thumb-desc">{{item.title}}</p>
            <p class="thumb__pagination">{{index+1}} / {{thumbTotal}}</p>
          </span>
        </swiper-slide>
      </swiper>
      <!-- 缩略图切换按钮-->
      <van-icon @click="thumb_swiper.slidePrev()"
                class="thumb__arrow thumb__left"
                name="arrow-left"
      />
      <van-icon @click="thumb_swiper.slideNext()"
                class="thumb__arrow thumb__right"
                name="arrow"
      />
    </section>

    <!-- 大图，可缩放移动，左右切换 -->
    <transition name="fade">
      <section class="viewer-wrp" v-show="isShow">
        <p class="viewer__title">{{currentTitle}}</p>
        <swiper :options="config.viewer" class="viewer-swiper" ref="viewer">
          <swiper-slide :key="Date.now() * Math.random()" v-for="(item,index) in AllFiles.viewer_files">
            <div class="viewer__item swiper-zoom-container">
              <img :src="item.image"
                   class="viewer__img">
            </div>
          </swiper-slide>
        </swiper>

        <div class="remark" v-if="currentRemark">
          <p>备注：</p>
          <p v-html="currentRemark"></p>
        </div>

        <a @click="hideViewer" class="viewer__close">关闭</a>
        <p class="viewer__pagination">{{currentViewerIndex + 1}} / {{viewerTotal}}</p>
        <!-- 大图切换按钮-->
        <van-icon @click="viewer_swiper.slidePrev()"
                  class="viewer__arrow viewer__left"
                  name="arrow-left"
                  v-if="isPc"
        />
        <van-icon @click="viewer_swiper.slideNext()"
                  class="viewer__arrow viewer__right"
                  name="arrow"
                  v-if="isPc"
        />
      </section>
    </transition>
  </div>
</template>

<script>
  import {isPc} from "../../util/util";

  const config = {
    thumb: {
      preloadImages: true,
      spaceBetween: 10,
      loop: false
    },
    viewer: {
      zoom: true,
      spaceBetween: 30
    }
  };

  export default {
    name: "v-file-preview",
    components: {},
    props: {
      // 大图的字段名
      imageKey: {
        type: String,
        default: "file_url"
      },
      // 缩略图的字段名
      thumbKey: {
        type: String,
        default: "small_image"
      },
      // 文件标题的字段名
      titleKey: {
        type: String,
        default: "title"
      },
      // 文件数组
      files: {
        type: Array,
        default: () => []
      },
      remarkKey:{
        type:String,
        default:"remark"
      }
    },

    data() {
      return {
        config,
        isShow: false,
        currentTitle: "附件",
        currentThumbIndex: 0,
        currentViewerIndex: 0,
        thumbTotal: 0,
        viewerTotal: 0,
        currentRemark:""
      }
    },

    computed: {
      // 所有的文件，包括缩略图数组和大图数组
      AllFiles() {
        var all_files = this.files;
        var thumb_files = [];
        var viewer_files = [];
        var viewer_index = 0;

        all_files.forEach((item, index) => {
          let remark;
          if (Array.isArray(item[this.remarkKey])){
            remark = item[this.remarkKey].map(item=>item.remark).join('<br/>')
          }else{
            remark = item[this.remarkKey]
          }
          // 缩略图
          let thumb_item = {
            image: item[this.thumbKey],
            title: item[this.titleKey],
            remark: remark,
            rawProps:item
          };
          // 如果是图片，添加到大图数组，并保存对应缩略图的index，缩略图数组也保存对应大图的索引
          if (item[this.thumbKey]) {
            // 大图
            viewer_files.push({
              image: item[this.imageKey],
              title: item[this.titleKey],
              remark: remark,
              rawProps:item,
              // 保存缩略图的索引
              thumb_index: index
            });
            // 保存对应大图的索引
            thumb_item.viewer_index = viewer_index;
            viewer_index++;
          } else {
            // 非图片，大图索引为null,image为文件的真实地址
            thumb_item.image = item[this.imageKey];
            thumb_item.viewer_index = null;
          }

          thumb_files.push(thumb_item);
        });
        this.thumbTotal = thumb_files.length;
        this.viewerTotal = viewer_files.length;
        return {thumb_files, viewer_files}
      },

      // 缩略图swiper
      thumb_swiper() {
        return this.$refs.thumb.swiper
      },
      // 大图swiper
      viewer_swiper() {
        return this.$refs.viewer.swiper
      },
      isPc() {
        return isPc();
      }
    },

    methods: {
      // 显示查看器并跳转到对应的大图
      showViewer(item, event) {
        var docReg = /^.+\.((doc(x)?)|(xls(x)?)|(ppt(x)?))$/;
        var pdfReg = /^.+\.(pdf)$/;
        var defaultOpen = true;

        if (item.viewer_index !== null) {
          // 如果是图片文件，打开内嵌的图片浏览器
          this.viewerGoto(item.viewer_index);
          this.isShow = true;
          this.currentTitle = item.title;
          this.currentRemark = item.remark;
          document.body.classList.add('owh');
          defaultOpen = false;
        } else {
          // 其他文件
          if (docReg.test(item.image) && isPc()) {
            // 如果是office文件并且是PC端，打开微软的office接口
            defaultOpen = false;
            window.open('https://view.officeapps.live.com/op/view.aspx?src=' + item.image);
          }
        }

        // 其他情况，统一用浏览器打开
        if (defaultOpen) {
          window.open(item.image);
        }
      },
      // 关闭查看器
      hideViewer() {
        this.isShow = false;
        document.body.classList.remove('owh');
      },
      // 跳转缩略图到指定index
      thumbGoto(index) {
        this.thumb_swiper.slideTo(index);
      },
      // 跳转大图到指定index
      viewerGoto(index) {
        this.viewer_swiper.slideTo(index);
      },
      onThumbChange(){
        let index = this.$refs.thumb.swiper.realIndex;
        let item = this.AllFiles.thumb_files[index];
        this.$emit('change:thumb:raw',item.rawProps);
      }
    },

    mounted() {
      // 添加监听器
      // 缩略图切换
      this.thumb_swiper.on("slideChange", () => {
        this.currentThumbIndex = this.thumb_swiper.realIndex;
      });
      // 大图切换
      this.viewer_swiper.on("slideChange", () => {
        this.currentViewerIndex = this.viewer_swiper.realIndex;
        this.currentTitle = this.AllFiles.viewer_files[this.currentViewerIndex].title;
        this.currentRemark = this.AllFiles.viewer_files[this.currentViewerIndex].remark;
        this.thumbGoto(this.AllFiles.viewer_files[this.currentViewerIndex].thumb_index);
      })
    }
  }
</script>

<style scoped>
  .thumb-wrp {
    width: 100%;
    position: relative;
    padding: 0 2.4rem;
    box-sizing: border-box;
  }

  .thumb__item {
    width: 100%;
    margin: 0 auto;
    display: flex;
    padding: 10px;
    box-sizing: border-box;
    line-height: 1.2rem;
    border: 1px solid #f2f2f2;
    border-radius: 4px;
    background-color: #f7f7f7;
  }

  .thumb__img {
    width: 3rem;
    height: 3rem;
    object-fit: cover;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    flex-shrink: 0;
  }

  .thumb-desc {
    margin-left: 0.8rem;
    font-size: 0.875rem;
    color: #333;
    max-height: 2.4rem;
    overflow: hidden;
    margin-top: 0.2rem;
    word-break: break-all;
  }

  .thumb__arrow {
    position: absolute;
    color: #808080;
    font-size: 1.6rem;
    top: 50%;
    z-index: 9;
    transform: translateY(-50%);
  }

  .thumb__left {
    left: 0.1rem;
  }

  .thumb__right {
    right: 0.1rem;
  }

  .thumb__pagination {
    position: absolute;
    text-align: right;
    margin-top: 5px;
    font-size: 0.95rem;
    color: #999;
    right: 0.6rem;
    bottom: 0.3rem;
    z-index: 9;
  }

  /* 大图 */
  .viewer-wrp {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #000;
    z-index: 99;
  }

  .viewer-swiper {
    height: 100%;
  }

  .viewer__item {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .viewer__img {
    max-width: 100%;
    max-height: 100%;
    width: auto;
    height: auto;
  }

  .viewer__title {
    position: absolute;
    z-index: 100;
    color: #ffffff;
    left: 50%;
    transform: translateX(-50%);
    top: 2.5rem;
    padding: 0.3rem 0.5rem;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    font-size: 0.875rem;
    line-height: 1.3;
    text-align: center;
  }

  .viewer__close {
    position: absolute;
    z-index: 100;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    border: 1px solid #fff;
    border-radius: 2px;
    padding: 0.6rem 0.9rem;
    font-size: 0.75rem;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.5);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    cursor: pointer;
  }

  .viewer__arrow {
    position: absolute;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    font-size: 2rem;
    z-index: 100;
    cursor: pointer;
    top: 50%;
    transform: translateY(-50%);
  }

  .viewer__left {
    left: 0.1rem;
  }

  .viewer__right {
    right: 0.1rem;
  }

  .viewer__pagination {
    position: absolute;
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    z-index: 100;
    left: 50%;
    transform: translateX(-50%);
    top: 1.2rem;
    font-size: 0.875rem;
  }

  .thumb__img::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3rem;
    height: 3rem;
    background-image: url("../../assets/fileImg.png");
    background-repeat: no-repeat;
    background-size: cover;
  }

  .remark{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
    z-index: 100;
    bottom: 6rem;
    line-height: 1.5;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 2px;
    padding: 0.4rem 0.7rem;
  }
</style>
