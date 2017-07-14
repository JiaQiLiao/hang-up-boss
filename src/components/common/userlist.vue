<template>
  <div class="userlist">
    <div class="userlist-head">
      我邀请的好友：共<span class="blue">{{inviteusers}}</span>人<span v-if="!(inviteusers >= 15)">(再邀<span class="red">{{15-inviteusers}}</span>人可获取电影票)</span>
      <div class="getTicker" :class="{isgetClass:isticker}" v-if="inviteusers >= 15"  @click="getTickerFn">{{ticker[isticker]}}</div>
    </div>
    <div class="userlist-content">
       <img v-for="item in userlist" :src="item.face" alt="用户头像">
       <p>注：为保证游戏的公平公正，将验证玩家的手机号，通过手机验证即视为有效参与。</p>
    </div>
    <x-dialog class="getT" :value="getTShow" :dialog-style="{'width':'80%','max-width': 'none','padding':'0.933333rem 0.4rem 0.8rem','overflow':'visible'}">
             <!-- <span class="vux-close" @click="getTShow = !getTShow"></span> -->
             <div class="sendmessage-tip"><p style="text-align:left;line-height:1.3">{{getTickerTip}}</p></div>           
             <a class="getBtn" href="http://a.app.qq.com/o/simple.jsp?pkgname=net.ajzhan">立即领票</a>
    </x-dialog> 
  </div>
  
</template>

<script>
import axios from 'axios'
import qs from 'qs'
import {XDialog} from 'vux'
import {Toast} from 'mint-ui'
import 'mint-ui/lib/Toast/style.css'
export default {
  name: 'userlist',
  // props: {    
  //   userlist: {
  //     type:Array      
  //   },
  //   inviteusers:{
  //     type:Number
  //   }   
  // },
  data(){
    return {
      userlist:[],
      inviteusers:0,
      isticker:0,
      ticker:['领票','已领票'],
      getTShow:false,
      getTickerTip:''
    }
  },
  created(){
     let self = this;  
     
     if(self.getstorage('isget')){
       self.isticker = 1;
     }

     let data = {token:self.$root.token,api:{m:'uc',a:'friendList'}}//获取邀请好友数据
     axios.post(self.$root.httpget,qs.stringify(data))
       .then(function(res) {
        if(Number(res.data.code) == 200){
           // console.log('邀请好友数据')
           // console.log(res);
           self.userlist = res.data.data.list;
           self.inviteusers = res.data.data.count;   
        }else{
           Toast({
             message: '邀请好友数据显示失败！',
             position: 'middle',
             duration: 1000
           }); 
        }                     
     });
  },
  methods:{
    getTickerFn(){
        let self = this;
        
        if(self.getstorage('ajzisreg')){
           let data = {token:self.$root.token,api:{m:'uc',a:'getTicket'}}//领取电影票       
           axios.post(self.$root.httpget,qs.stringify(data))
             .then(function(res) {
                console.log('领取电影票')
                console.log(res);   
                if(Number(res.data.code) == 200){
                   self.getTickerTip = res.data.msg;
                   self.getTShow = true;
                   self.isticker=1; 
                   self.setstorage('isget',self.isticker)
                }else if(Number(res.data.code) == 5003005){
                   self.showTel();                   
                }else{
                    Toast({
                     message: res.data.msg,
                     position: 'middle',
                     duration: 1000
                   }); 
                }                    
           }); 
        }else{
            self.showTel();
        }
    },
    showTel(){             
       this.$emit('showTelEven');
    },
    getstorage(key){//获取缓存数据
       if(!window.localStorage){
             return false;
        }else{
             let storage=window.localStorage;
             return storage.getItem(key);
        }
    },
    setstorage(key,val){//设置缓存数据
        if(!window.localStorage){
              return false;
           }else{
              let storage=window.localStorage;
              return  storage.setItem(key,val);
          }
    },
  },
  components:{
     XDialog              
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   .userlist{ line-height: 2;padding:0.133333rem 0 0.48rem  0.213333rem; width: 92%;margin:0.933333rem auto 0; border:1px solid #c8c8c8;background-color: #fff;font-size: 0.4rem;color: #3e3d3d;}
   .getTicker{font-family: weijue; margin-left: 0.4rem; text-align: center; line-height: 0.933333rem; display: inline-block;width: 1.773333rem;height: 0.973333rem;background:url(/static/img/getTicker.png) no-repeat;background-size: 100%;padding-right: 0.133333rem}
    .getTicker.isgetClass{background: url(/static/img/resultTab.png) no-repeat;background-size:190%;}
   .userlist-content{overflow: hidden;}
   .userlist-content p{font-size: 0.32rem;clear: both;line-height: 1.3;color: #888;padding-top: 0.133333rem;width: 98%;}
   .userlist-content img{float: left; width: 0.8rem;height: 0.8rem;margin-left: 0.093333rem;margin-bottom:0.133333rem; border-radius: 50%;}
   .userlist-head .red{color: red}
   .userlist-head .blue{color: #1963d3;}
   .getBtn{display: block;color: #393939;  margin:0.4rem 0 0 0; width: 100%;padding:0.133333rem 0; font-size: 0.533333rem;background:url(/static/img/dialogbtn.png) no-repeat; font-family: weijue; background-size: 100%;border:none;height:1.746667rem;line-height:1.4rem;}
</style>
