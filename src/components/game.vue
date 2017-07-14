<template>
  <div class="game">
    <div class="game-mask" v-if="readyshow">
       <div class="game-mask-lw">
         <div class="game-mask-l"></div>
       </div>  
       <div class="game-mask-rw">     
       <div class="game-mask-r"></div>
       </div>
       <div class="game-masktip">
           <div class="game-masktime"><countdown :value="3" :start="true" @on-finish="gamestart"></countdown>s</div>
           <div class="game-maskhand">10秒内，左右交替点击<br>
次数越多获得的薪水越高<div class="game-handl" v-show="readyhand"></div><div class="game-handr" v-show="!readyhand"></div></div>
       </div>
    </div>
    <div class="game-countdown">
       倒计时：<span><countdown :value="playingtime" :start="begin" @on-finish="gameend"></countdown>'</span>
       <!-- <div class="game-mao"></div> -->
    </div>
    <div class="game-bosswrap" :class="isshake"  ref="bloodwrap">
        <div class="game-boss">
          <div class="game-bubble" v-if="lefthand && righthand">想加薪？</div>
          <img v-show="lefthand==true && righthand==true" src="/static/img/gameboss.png" alt=""> 
          <img  v-show="lefthand==false && righthand==true" src="/static/img/gamebossl.png" alt="">
          <img  v-show="lefthand==true && righthand==false" src="/static/img/gamebossr.png" alt="">         
        </div>
        <!-- 血啊 -->
        <div v-for="blood in bloods" v-if="bloods">
          <div class="bloodstyle" :style="{top:blood.x + 'px',left:blood.y+'px',transform:'rotate('+ blood.rotate +'deg) scale('+ blood.scale +')',webkitTransform:'rotate('+ blood.rotate +'deg) scale('+ blood.scale +')'}"></div>         
        </div>
    </div>
    <div class="game-left"   @touchstart="lefttouchhit" @touchend="lefttouchfree" :class="{lefthit : lefthitclass}"></div>
    <div class="game-right"  @touchstart="righttouchhit" @touchend="righttouchfree" :class="{righthit : righthitclass}"></div>
    <!-- 加薪分数效果模块 -->
    <div class="addsource-container">
      <transition name="bound" v-on:before-enter="beforeEnter"
        v-on:enter="enter" v-on:after-enter="afterEnter"
        v-for="(ball,index) in hitsources">
        <div class="ball" v-show="ball.show">
          <div class="inner">+100元</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import countdown from './common/countdown'
import Vue from 'vue'

export default {
  name: 'game',
  data () {
    return {      
      source:0,//分数
      readytime:3,//预备倒计时时间
      readyshow:true,//预备遮罩
      readyhand:true,      
      playingtime:10,//游戏时间
      begin:false,//是否开始游戏  
      lefthand:true,//左手是否可点击
      righthand:true,//右手是否可点击  
      hit:false,//是否开始打击   
      hitsources: [{//分数效果数组
         show:false
      },{
         show:false
      },{
         show:false
      },{
         show:false
      },{
         show:false
      }],
      hitsourcesA: [],
      lefthitclass:false,//是否挂载打击样式
      righthitclass:false,//是否挂载打击样式
      bloodbox:{//血盒子的长宽
        w:0,
        h:0
      },
      bloods:[],//血的分布 
      timer:null//预备手的左右效果定时器
    }
  }, 
  created(){
      this.$root.eventHub.$on('source', this.hits);//监听打击分数然后hit效果      
  },
  mounted(){ 
    let self = this;
    this.$nextTick(()=>{
        this.bloodbox.h = this.$refs.bloodwrap.clientHeight;//获取血的显示范围
        this.bloodbox.w = this.$refs.bloodwrap.clientWidth;//获取血的显示范围
       self.timer = setInterval(function(){ // 预备手的左右效果        
          self.readyhand = !self.readyhand         
       },1000)
    })      
  },
  computed:{
     isshake(){ //背景晃动效果       
        return{
          shake: !(this.lefthand && this.righthand),
          shake1: !(this.lefthand && this.righthand) && this.lefthand
        }
     }
  },
  methods:{
     lefttouchhit(){//左出拳
        if(this.lefthand){           
          this.lefthitclass=true;
        }
     },
     lefttouchfree(){//左收拳    
        let self = this; 
         this.lefthitclass=false;
         if(this.lefthand){ 
               self.hit = true;
               self.source = self.source+100;
               self.lefthand =false;
               self.righthand =true; 
               self.$root.eventHub.$emit('source')
               self.bloods.push({x:self.getrandom(0,self.bloodbox.h)*2/3, y:self.getrandom(0,self.bloodbox.w),rotate:self.getrandom(0,180),scale:self.getrandom(0,1.3) }) 
         }  

     },
     righttouchhit(){//右出拳 
        if(this.righthand){
         this.righthitclass=true;
       }
     },
     righttouchfree(){//右收拳  
           let self = this;
           this.righthitclass=false;
         if(this.righthand){           
            self.hit = true;
            self.source = self.source+100;
            self.righthand = false;
            self.lefthand = true; 
            self.$root.eventHub.$emit('source')           
            self.bloods.push({x:self.getrandom(0,self.bloodbox.h)*2/3, y:self.getrandom(0,self.bloodbox.w),rotate:self.getrandom(0,90),scale:self.getrandom(0,1.3) })                      
         }
         
     },         
     hits(el){//加分效果
        for (let i = 0, l = this.hitsources.length; i < l; i++) {
          let ball = this.hitsources[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.hitsourcesA.push(ball)
            return
          }
        }
     },
     gamestart(){//游戏开始蒙层消失开始倒计时
        clearInterval(self.timer) 
        this.readyshow = false;
        this.begin = true;
     },
     gameend(){//游戏结束跳转结果页
         this.$root.$router.push({path:'/result'}); 
     }, 
     beforeEnter(el) {//加分效果         
         let count = this.hitsources.length
         while (count--) {
           let ball = this.hitsources[count]
           if (ball.show) {
             el.style.display = ''
             el.style.webkitTransform = `translate3d(-50%,0px,0)`
             el.style.transform = `translate3d(-50%,0px,0)`          
           }
         }
       },
     enter(el) { //加分效果      
       el.offsetHeight // 触发浏览器重绘，offsetWidth、offsetTop等方法都可以触发
       this.$nextTick(() => {
         el.style.webkitTransform = 'translate3d(-50%,-200px,0)'
         el.style.transform = 'translate3d(-50%,-200px,0)'     
       })
     },
     afterEnter(el) {//加分效果       
       let ball = this.hitsourcesA.shift()
       if (ball) {
         ball.show = false
         el.style.display = 'none'
       }
     },
     getrandom(num1,num2){//获取随机数
        return  (Math.random()*(num2-num1)+num1).toFixed(1);
     }
  },  
  beforeDestroy(){ 
      this.$root.eventHub.$emit('end',this.source);
  },
  destroyed(){
      this.$root.eventHub.$off('end');
  },
  components:{
     countdown
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .game{position: fixed;width: 100%;left: 0;top:0;bottom:0;background:#fcf5e9 url(/static/img/gamebg.png) no-repeat;}
  .game-countdown{position: relative; width: 4.613333rem;height: 2.96rem;margin:0 auto; background-color:#fff;border:1px solid #a6a39d;border-top:none;border-radius: 0 0 0.133333rem 0.133333rem; font-family: weijue;font-size: 0.746667rem;text-align: center;padding-top: 1.333333rem;color: #4d4d4d;}
  .game-countdown span{color: #bf5641;display: inline-block;}
  .game-mao{position: absolute;right:0.8rem;bottom: -0.533333rem; width: 0.453333rem;height: 0.96rem;background: url(/static/img/gamemao.png) no-repeat; background-size: 100%;}
  .game-bosswrap{position: absolute;bottom:4.506667rem; width: 100%; height: 8.853333rem; background:url(/static/img/gameline.png) no-repeat; background-size: 100%;}
  .game-boss{position: absolute;top:50%;left:50%;transform: translate(-50%,-50%); width: 4.413333rem;height:5.933333rem;}
  .game-boss img{width: 100%;}
  .game-boss:after{content: '';display: block;border-radius: 50%;margin:0 auto; width: 2.933333rem;height: 0.586667rem;background-color: #d2d2d2;}
  .game-left,.game-right{position: absolute;bottom:0.346667rem; width: 2.933333rem;height: 3.653333rem;}
  .game-left{left: 1.04rem; background:url(/static/img/gamelefthand.png) no-repeat;background-size: 100%;}
  .game-left.lefthit{transform: translate3d(20px,-20px,0);}
  .game-right{right: 0.986667rem; background:url(/static/img/gamerighthand.png) no-repeat;background-size: 100%;}
  .game-right.righthit{transform: translate3d(-20px,-20px,0);}
  .game-bubble{position: absolute;left: -2.133333rem;top:-0.933333rem; width: 2.693333rem;height: 1.346667rem;background:url(/static/img/gamebubble.png) no-repeat;background-size: 100%;font-family: weijue;font-size: 0.533333rem;text-align: center;line-height:1.2rem; color: #333;}
   .game-bubble img{position: absolute;left: 0;top:0;}
  .game-mask{position: fixed;width: 100%;top:0;left: 0;bottom:0;z-index: 10;}  
  .game-mask-lw,.game-mask-rw{position: absolute;top: 0; width: 50%;height: 100%;bottom:0; overflow: hidden;}
  .game-mask-lw{left: 0;}
  .game-mask-rw{right: 0;}
  .game-mask-l,.game-mask-r{position: absolute;width: 3.466667rem;height: 4.053333rem;border-radius: 0.133333rem; bottom:0.213333rem;box-shadow: 0 0 0 2000px rgba(0,0,0,.5) }
  .game-mask-l{left: 0.8rem;}
  .game-mask-r{right: 0.8rem;}
  .game-masktip{position: absolute;width: 100%; z-index: 10;font-family: weijue;text-align: center;line-height: 1.093333rem;color:#333;bottom:2.666667rem;}
  .game-masktime{width: 2.386667rem;height: 2.453333rem;background:url(/static/img/gameready.png) no-repeat;background-size: 100%;margin:0 auto;font-size: 1.066667rem;line-height: 2.533333rem;}
  .game-maskhand{position: relative; width: 100%;height: 6.36rem;background:url(/static/img/gametiphand.png) no-repeat;background-size: 100%;padding: 0.533333rem 0 0 0.533333rem; font-size: 0.613333rem;line-height: 1.2;text-align: center;}
   .game-handl,.game-handr{position: absolute; width: 2.693333rem;height: 3.826667rem;background:url(/static/img/gamehand.png) no-repeat;background-size: 100%;top:2.453333rem;}
   .game-handl{left: 1.333333rem}
   .game-handr{right: 1.066667rem}
   /*100元动画*/
   .bound-enter-active{ transition:all .5s linear;opacity: 0;}
   .bound-enter{opacity: 1;}
   .addsource-container{font-family: weijue;font-size: 0.8rem; position: fixed;left: 50%; bottom:5.0rem;z-index: 100;}
   .addsource-container .ball{position: absolute;white-space: nowrap;}

   /*血*/
   .bloodstyle{position: absolute; width: 2.6rem;height: 1.733333rem;background:url(/static/img/blood.png) no-repeat; background-size:100%;z-index: 200;}

  .shake{-webkit-animation: shake 0.2s linear 0s;}
  @-webkit-keyframes shake {
    0%, 100% {-webkit-transform: translate3d(0, 0, 0);transform: translate3d(0, 0, 0);}
    10%, 30%, 50%, 70%, 90% {
      -webkit-transform: translate3d(-0.4rem, 0, 0);
      transform: translate3d(-0.4rem, 0, 0);}
    20%, 40%, 60%, 80% {-webkit-transform: translate3d(0.4rem, 0, 0);
      transform: translate3d(0.4rem, 0, 0);}
   }
  .shake1{-webkit-animation: shake1 0.2s linear 0s;}
  @-webkit-keyframes shake1 {
    0%, 100% {-webkit-transform: translate3d(0, 0, 0);transform: translate3d(0, 0, 0);}
    10%, 30%, 50%, 70%, 90% {-webkit-transform: translate3d(-0.4rem, 0, 0);transform: translate3d(-0.4rem, 0, 0);}
    20%, 40%, 60%, 80% {-webkit-transform: translate3d(0.4rem, 0, 0);transform: translate3d(0.4rem, 0, 0);
    }
  }

</style>
