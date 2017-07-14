<template>
  <div class="tablist">
      <ul class="tablist-tab">        
        <li v-for="(item,index) in tabitems" :class="{cur: !isexpire && (!!isreg) && active==index}" @click="toggle(index)">{{item.text}}</li>        
      </ul>
     
      <div v-if="!isexpire">
      <ul class="tablist-con" v-if="isreg">
        <li v-show="activeView == 0">
           <ol>
             <li v-for="(item,index) in yxitems"><span class="num">{{++index}}</span><img :src="item.face" alt=""><span class="b">{{item.name}}</span><span class="fr">月薪<span>{{item.score}}</span>元</span></li>
           </ol>
        </li>
        <li v-show="activeView == 1">
           <ol>
             <li v-for="(item,index) in rqitems"><span class="num">{{++index}}</span><img :src="item.face" alt=""><span class="b">{{item.name}}</span><span class="fr">已邀请<span>{{item.subnum}}</span>人</span></li>
           </ol>
        </li>
      </ul> 
      <div class="iphoneBtn" v-else @click="showDialog">我的iPhont7到手了吗？</div>
     </div>
     <div v-else>
        <ul v-if="isreg" class="tablist-con out">
          <li><h2>活动已结束！</h2>
            关注公众账号“爱记账爱生活”<br>查看活动最终结果</li>            
        </ul>
        <div v-else class="iphoneBtnout">活动已结束</div>
     </div>

  </div>
</template>

<script>
import axios from 'axios'
import qs from 'qs'
export default {
  name: 'tablist',
  props: {    
    isreg: {
      type: Number,
      default: 0
    },
    isgetrankagain:{
      type:Boolean,
      default:false
    },
    isexpire:{
      type:Boolean,
      default:false
    }
  },
  data () {
    return {
      active:0,
      activeView:0,
      tabitems:[
        {id:0,text:'月薪榜'},
        {id:1,text:'人气榜'}
      ],
      yxitems:[],//月薪榜
      rqitems:[]//人气榜
    }
  },
  watch:{
    isreg:function(a,v){//监听是否注册显示数据
        this.getdata();
    },
    isgetrankagain:function(a,v){
        // console.log('我改变了')
        this.getdata();
    }
  },
  created(){    
      this.getdata();           
  },
  methods:{
    toggle(i){
      if(this.isexpire) return;
      let self= this;      
      if(self.getstorage('ajzisreg')){
          // console.log('已注册');
          self.active = i;  
          self.activeView = i;   
      }else{
        // console.log('未注册');
          self.showDialog();
      }
    },
    showDialog(){             
       this.$emit('showDialogEven');
    },
    getdata(){
      let self = this;
      if(!this.isreg) return false;         
        let data = {token:self.$root.token,api:{m:'uc',a:'inviteRank'}}//邀请排行榜
        axios.post(self.$root.httpget,qs.stringify(data))
          .then(function(res) {
             // console.log('获取邀请排名')
             self.rqitems = res.data.data.list;             
        });

         let data1 = {token:self.$root.token,api:{m:'uc',a:'scoreRank'}}//分数排行榜
         axios.post(self.$root.httpget,qs.stringify(data1))
           .then(function(res) {
               // console.log('获取分数排名')
               self.yxitems = res.data.data.list; 
         });
    },
    setstorage(key,val){//设置缓存数据
        if(!window.localStorage){
              return false;
           }else{
              let storage=window.localStorage;
              return  storage.setItem(key,val);
          }
    },
    getstorage(key){//获取缓存数据
       if(!window.localStorage){
             return false;
        }else{
             let storage=window.localStorage;
             return storage.getItem(key);
        }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
   .tablist-tab{position: relative; z-index: 1; overflow: hidden;text-align: center;font-size: 0;}
   .tablist-tab li{display: inline-block; width: 3.026667rem;height: 1.68rem;line-height: 1.68rem; text-align: center; font-family: weijue; background:url(/static/img/resultTab.png) no-repeat;background-size: 6.053333rem 1.68rem; background-position: -3.0rem 0; font-size: 0.373333rem;color: #999;}
   .tablist-tab li.cur{background-position: 0 0;color: #191919;font-size: 0.426667rem}
   .tablist-con{position: relative; width: 92%;margin:-0.8rem auto 0;padding:1.2rem 0.453333rem 0 0.266667rem; border:1px solid #b7b7b7;background-color:#fff;}   
   .tablist-con li{font-size: 0.4rem;}   
   .tablist-con ol li{padding-bottom:0.453333rem;}
   .tablist-con .num{font-family: weijue;vertical-align: middle;  display: inline-block;text-align: center; width: 0.586667rem;height: 0.586667rem;line-height: 0.586667rem; border-radius: 50%;border:1px solid transparent;}
   .tablist-con  ol > li:nth-child(1) .num{border-color:#afafaf;background-color: #ffc12f}
   .tablist-con > li:nth-child(2) ol > li:nth-child(1) .num{border-color:#afafaf;background-color: transparent;}
   .tablist-con ol > li:nth-child(2) .num{border-color:#afafaf}
   .tablist-con ol > li:nth-child(3) .num{border-color:#afafaf}
   .tablist-con > li:nth-child(1) ol > li:nth-child(2) .num{border-color:transparent; }
   .tablist-con > li:nth-child(1) ol > li:nth-child(3) .num{border-color:transparent;}
   .tablist-con img{vertical-align: middle; width: 0.8rem;margin:0 0.08rem 0; height: 0.8rem;border-radius: 50%;}
   .tablist-con .fr{float: right;line-height:0.8rem}
   .tablist-con .b{font-weight: bold;}
   .tablist-con .fr span{color: #dc3434;display: inline-block;}
   .tablist-con.out{text-align: center;line-height: 1.5;padding-bottom: 0.666667rem}
   .tablist-con.out h2{font-size:0.533333rem;font-weight: bold;}
   .iphoneBtn,.iphoneBtnout{width: 100%;margin-top:0.666667rem; height: 1.773333rem;line-height: 1.733333rem;background:url(/static/img/result-invite.png) no-repeat;background-size: 100% ;font-family: weijue;text-align: center;font-size: 0.533333rem }
    .iphoneBtnout{background: url(/static/img/resultbtn2.png);background-size: 100% ;}
</style>
