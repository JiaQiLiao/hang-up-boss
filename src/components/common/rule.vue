<template>
  <div class="rule" @click="showRule">
      <span class="rule-tit">规则</span>
   <div class="rule-mask" v-show="ishow" @click.stop.prevent="hideRule"></div>
   <div class="rule-trems" v-show="ishow" ref="ruleSc">
     <div class="rule-tremsI">
      <h2><span>活动规则</span></h2>
      <ul>
        <li>
          <h3><i>●</i>活动时间：</h3>
          <p>2017年6月9-13日，共5天</p>
        </li>
        <li>
          <h3><i>●</i>奖品及获奖条件：</h3>
          <table border="1">
             <tr>
               <th class="one">奖项</th>
               <th class="two">奖品</th>
               <th class="three">获奖条件</th>
             </tr>
             <tr>
               <th>超级金领<br><span>(名额：1名)</span></th>
               <td>iPhone7一部</td>
               <td>活动5天总榜月薪第一名</td>
             </tr>
             <tr>
               <th>人气榜前3名<br><span>(名额：3名)</span></th>
               <td>第一名：全国通兑3D电影票3张；<br>第二名：全国通兑3
D电影票2张；<br>第三名：全国通兑3D电影票1张。</td>
               <td>活动5天，邀请好友有效参与游戏人数最多的3位玩家</td>
             </tr>
             <tr>
               <th>种草小能手<br><span>(名额：不限)</span></th>
               <td>全国通兑3D电影票1张。</td>
               <td>邀请好友有效参与游戏达15人，即实时发放！</td>
             </tr>
          </table>
          <p>注：①为保证游戏的公平公正，将验证玩家的手机号，通过手机验证即视为有效参与。<br>
                 ②上述“电影票”均为电子兑换码，可直接兑换电影票观影。</p>
        </li>
        <li>
           <h3><i>●</i>获奖公布：</h3>
           【超级金领】与【人气榜前3名】的获奖名单，将于活动
           结束后第1个工作日在爱记账官方微信（ID：ai-jizhang）
           公布。
        </li>
        <li>
           <h3><i>●</i>奖品发放：</h3>
           1.iPhone7将在活动结束后10个工作日内寄出。<br>2.【人气榜前3名】的电影票将于活动结束后3个工作日内，发放至用户的i记账APP里，用户可在i记账的消息中心查看。<br>3.【种草小能手】的电影票，满足获奖条件，点击【领票】后，在收到“电影票已发放到你手机号...”的消息提示之时，24小时内前往i记账APP领取，逾期视为放弃。<br>4.为保证您能顺利领取电影票，请确保您使用的i记账APP版本是2.0及以上
           <p><br></p>
           <p>※活动最终解释权归深圳市爱记账科技有限公司所有。</p>  
           <p><br></p>                    
        </li>
      </ul>
      </div>
   </div>
  </div>
  
</template>

<script>
import BScroll from 'better-scroll'
export default {
  name: 'rule',
  data () {
    return {
       ishow:false
    }
  },
  created(){    
  },
  methods:{
    _init(){
       this.$nextTick(()=>{
         this.ruleScroll = new BScroll(this.$refs.ruleSc);
       }) 
    },
    showRule(){
        this.ishow = true;
        this._init();
    },
    hideRule(){
        this.ishow = false;
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   .rule{width: 1.093333rem;height: 1.093333rem; background:url(../../../static/img/rulebtn.png) no-repeat;background-size: 100%; text-align: center;line-height: 1.093333rem;font-size: 0.373333rem;}
   .rule-mask{position: fixed;z-index: 10;top:0;bottom:0; left: 0;width: 100%;background-color: rgba(0,0,0,.5)}
   .rule-trems{font-size: 0.32rem;color: #666; line-height: 1.5; text-align: left; position: fixed;z-index: 11;width: 90%;padding:0 0.4rem 0.133333rem; top:2.266667rem;border-radius: 0.266667rem; left: 50%; transform: translateX(-50%); bottom:2.266667rem;background-color: #fff;overflow: hidden;}
   .rule-tremsI{border-top:1px solid #fff;}
   .rule-trems td,.rule-trems th{border:1px solid #c2c2c2;text-align: center;padding:0.133333rem;vertical-align: middle;}
   .rule-trems th span{font-size: 0.266667rem;color: #666;display: inline-block;}
   .rule-trems td{font-size: 0.293333rem;}
   .rule-trems th{font-size: 0.32rem;}
   .rule-trems h2{text-align: center; height: 0;border-top:1px solid #d2d2d2;width: 6.533333rem;margin:0.693333rem auto 0.453333rem;line-height: 0;font-size: 0.4rem;}
   .rule-trems h2  span{display: inline-block;line-height: 1;margin-top: -0.213333rem; padding:0 0.133333rem; background-color: #fff;}
   .rule-trems h3{font-size: 0.4rem;color: #333;}
   .rule-trems h3 i{margin:0 0.133333rem 0 0; display: inline-block; color: #999;font-style: normal;transform:scale(1.5,1.5);}
   .rule-trems table{margin:0.2rem 0 0.2rem;color: #333;vertical-align: middle;}
   .rule-trems li{padding-bottom: 0.213333rem}
   .rule-trems table th.one{width: 26%;background-color: #c8ccef}
   .rule-trems table th.two{width: 38%;background-color:#f2e3a8;}
   .rule-trems table th.three{width: 38%;background-color:#caedc7;}
   .rule-tit{font-family: weijue;}
</style>
