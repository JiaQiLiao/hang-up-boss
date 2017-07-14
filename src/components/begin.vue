<template>
  <div class="begin">
    <h1 class="begin-title">
       <img src="/static/img/begintitle.png" alt="吊打老板加薪">
       <div class="redgloves"></div>
       <div class="bluegloves"></div>
    </h1> 
    <div class="begin-gift">
      赢iPhone7,3D电影票
    </div>  
    <div class="gift-iphone">      
    </div>
    <div class="gift-movie">      
    </div>
    <div class="gift-movietheme">      
    </div>
    <router-link to="/game" class="begin-btn">  
         开始游戏  
     </router-link>  
     <!-- 装饰 -->
    <div class="redgloves orn1"></div>
    <div class="redgloves orn2"></div>
    <div class="bluegloves orn1"></div>
    <div class="football orn1"></div>
    <div class="football orn2"></div>
    <div class="football orn3"></div>
    <div class="football orn4"></div>
  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'begin',
  data () {
    return {
      title: '游戏开始',      
    }
  },
  created(){
     let self = this;
     let data = {token:self.$root.token,api:{m:'uc',a:'getScore'}}//判断是有分数记录，根据分数判断首页还是结果页
     axios.post(self.$root.httpget,qs.stringify(data))
       .then(function(res) { 
          // console.log('begin页：获取分数判断是否跳转');
          // console.log(res);
          if(Number(res.data.data.score)){
             self.$root.$router.push({path:'/result'}); 
          }
     });
    this.$root.wxInit('吊打老板加薪！赢iphone 7、3D电影票','吊打老板加薪！赢iphone 7、3D电影票',function(){
         // console.log('分享成功回到')
         //  console.log('回到result')
    })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>  
   .bluegloves{position: absolute;width: 1.946667rem;height: 1.786667rem;background:url(/static/img/bluegloves.png) no-repeat;background-size: 100%;}
   .redgloves{position: absolute;width: 2.2rem;height: 2.213333rem;background:url(/static/img/redgloves.png) no-repeat;background-size: 100%;}
   .football{position: absolute;width: 1.28rem;height: 1.28rem;background:url(/static/img/football.png) no-repeat;background-size: 100%;}

  .begin{position: fixed;left: 0;top:0;width: 100%;max-width: 10rem; bottom:0; height: 100%; background:#fcf5e9 url(/static/img/bloodbg.png) no-repeat; background-size: 100%;}
  .begin-title{position: absolute;z-index: 5; left: 50%; transform: translateX(-50%); top:1.013333rem; width: 7.6rem;height: 1.946667rem;}
  .begin-title img{width: 100%;}
  .begin-title .redgloves{left:-0.453333rem;top:0.8rem;}
  .begin-title .bluegloves{right:-0.693333rem;top:1.066667rem;}
  .begin-gift{ position: absolute; width:100%;height: 2.413333rem;background:url(/static/img/begingift.png) no-repeat;background-size: 100%;top:3.573333rem;font-family: weijue;font-size: 0.773333rem;text-align: center;line-height: 2.533333rem;}
  .begin-btn{position: absolute; width: 6.0rem;height: 2.013333rem;line-height: 1.733333rem; background:url(/static/img/beginbt.png) no-repeat; background-size: 100%;bottom:0.8rem;left: 50%;transform: translateX(-50%);font-family: weijue;color: #030303;font-size: 0.72rem;text-align: center;}
  .gift-iphone{position: absolute;z-index: 2; bottom:3.066667rem;right:1.6rem; width: 3.226667rem;height: 6.44rem;background:url(/static/img/iphone.png) no-repeat; background-size: 100%;}
  .gift-movie{position: absolute;bottom:4.0rem;left:1.546667rem; width: 4.36rem;height: 4.573333rem;background:url(/static/img/movie.png) no-repeat; background-size: 100%;}
  .gift-movietheme{position: absolute;left:0.64rem;bottom:3.2rem; width: 3.813333rem;height: 2.88rem;background:url(/static/img/movietheme.png) no-repeat; background-size: 100%;}

   .redgloves.orn1{left: 4.84rem;top:5.44rem; opacity: 0.5;z-index: -1;transform: scale(0.9);}
   .redgloves.orn2{left: 7.333333rem;bottom:3.6rem; opacity: 0.5;transform: scale(0.9);}
   .bluegloves.orn1{left: 0.933333rem;bottom:-0.133333rem;transform: rotateZ(30deg) scale(1.3);opacity: 0.5;}
   .football.orn1{left: 0.84rem;bottom:1.333333rem;opacity: 0.5;}
   .football.orn2{right: 2.626667rem;bottom:-0.4rem;transform: scale(0.8);}
   .football.orn3{right: 0.8rem;bottom: 0.4rem;transform: scale(0.8);opacity: 0.5;}
   .football.orn4{right: 1.733333rem;bottom: 2.933333rem;transform: scale(0.8);opacity: 0.3;}
</style>
