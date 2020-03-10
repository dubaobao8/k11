<template>
  <div class="profolio-wrp">
    <section :key="dep.id" class="department-item" v-for="(dep,dep_index) in profolioList">
      <div class="department-title">
        <div class="department-title__name">{{dep.department}}</div>
        <div class="department-title__eng">{{dep.code}}</div>
        <div class="department-title__num">人数({{dep.count}}人）</div>
      </div>

      <div class="staff">
        <div :class="{'new':user.is_new == 2}"
             :key="user.id"
             class="staff-item"
             v-for="(user,user_index) in dep.user_info">
          <div class="staff-item__avatar">
            <img :src="user.user_logo?user.user_logo:''" @error="onImgError($event)" class="staff-item__avatar__img"/>
          </div>
          <ul class="staff-item__info-list">
            <li class="staff-item__info-list__item">
              <p class="staff-item__info-list__item__attr">Name (CN)</p>
              <span class="staff-item__info-list__item__value">{{user.ch_name}}</span>
            </li>

            <li class="staff-item__info-list__item">
              <p class="staff-item__info-list__item__attr">Name (ENG)</p>
              <span class="staff-item__info-list__item__value">{{user.username}}</span>
            </li>

            <li class="staff-item__info-list__item">
              <p class="staff-item__info-list__item__attr">Position</p>
              <span class="staff-item__info-list__item__value">{{user.position}}</span>
            </li>

            <li class="staff-item__info-list__item">
              <p class="staff-item__info-list__item__attr">SN</p>
              <span class="staff-item__info-list__item__value">{{user.userid}}</span>
            </li>

            <li class="staff-item__info-list__item">
              <p class="staff-item__info-list__item__attr">ROD</p>
              <span class="staff-item__info-list__item__value">{{user.join_time | transDate}}</span>
            </li>

            <li class="staff-item__info-list__item">
              <p class="staff-item__info-list__item__attr">Company Moblie</p>
              <span class="staff-item__info-list__item__value">{{user.company_phone}}</span>
            </li>

            <li class="staff-item__info-list__item">
              <p class="staff-item__info-list__item__attr">Moblie No.</p>
              <span class="staff-item__info-list__item__value">{{user.phone}}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import {GetProfolio} from "@/api/initiate/profolio";

  export default {
    name: "profolio",
    data() {
      return {
        profolioList: []
      }
    },
    methods: {
      onImgError(e) {
        console.log(e);
        e.target.style.opacity = 0
      }
    },
    mounted() {
      GetProfolio().then(res => {
        this.profolioList = res.data.data;
      })
    }
  }
</script>

<style scoped>
  .department-title {
    font-size: 0.875rem;
    color: #41424f;
    text-align: center;
    padding: 1rem 0;
  }

  .department-title > div {
    line-height: 1.5;
    letter-spacing: 1px;
  }

  .department-title__name {
    font-size: 1rem;
    font-weight: bold;
  }

  .staff {
    display: flex;
    flex-wrap: wrap;
    margin: 0.6rem 0.9rem 0 0.9rem;
    justify-content: space-between;
  }

  .staff-item {
    padding: 1rem 0.5rem 0.9rem;
    box-shadow: 0 1px 1.25rem #e6e6e6;
    border-radius: 4px;
    flex: 0 0 48%;
    box-sizing: border-box;
    margin-bottom: 1.2rem;
    color: #4c5055;
    font-size: 0.875rem;
    width: 0;
    background-color: #fff;
  }


  /*@media (min-width: 600px) {*/
  /*  .staff-item {*/
  /*    flex: 0 0 31%;*/
  /*  }*/
  /*}*/

  .staff-item__avatar {
    width: 60%;
    padding-bottom: 80%;
    /*background-color: #f2f2f2;*/
    position: relative;
    margin: 0 auto 1rem;
    border-radius: 4px;
    overflow: hidden;

    background-color: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .staff-item__avatar__img {
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .staff-item__info-list__item {
    display: flex;
    margin-bottom: 0.4rem;
    font-size: 0.75rem;
    line-height: 1.4;
    justify-content: space-between;

  }

  .staff-item__info-list__item__attr {
    flex: 4;
  }

  .staff-item__info-list__item__value {
    flex: 6;
    vertical-align: top;
    word-break: break-all;
    color: #999;
    margin-left: 5px;
  }


  .staff-item.new {
    color: #dae7ff;
    /*background: linear-gradient(to bottom,#60aeff,#6065ff);*/
    background: transparent linear-gradient(to bottom, #76b9ff, #7075ff);
    box-shadow: 0 2px 1rem #91a9ff;
  }

  .staff-item.new .staff-item__info-list__item__value {
    color: #dae7ff;
  }


</style>
