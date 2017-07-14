<template>
  <div class="result">
      <rule class="rule-p"></rule>
      <div class="result-Head">
        <img :src="'/static/img/'+sourcelevel.imgface+'.png'" alt="">
      </div>
      <div class="resutl-Word">
       <div class="table">
         <div class="tableCell">
          <div v-if="!!source">
              {{sourcelevel.txt}}<span style="font-weight:bold; font-family: 'Heiti SC', 'Helvetica', 'HelveticaNeue', 'Droidsansfallback', 'Droid Sans', 'Dengxian', 'Segoe', 'microsoft yahei'">{{source}}</span>元<br>{{sourcelevel.tip}}
          </div> 
          <div v-else>
               要不再打一顿？！
          </div>          
         </div>
        </div>
      </div>
      <router-link to="/game" class="result-again">  
           再玩一遍 
       </router-link>     

      <p class="result-history">历史最高月薪<span style="font-family: 'Heiti SC', 'Helvetica', 'HelveticaNeue', 'Droidsansfallback', 'Droid Sans', 'Dengxian', 'Segoe', 'microsoft yahei'">{{historysource}}</span>元</p>
      
      <div class="result-invite" @click="showshare">
         邀好友免费得电影票
      </div>

      <div class="result-line"></div>
      <userlist @showTelEven='toshow'></userlist>
      <tablist class="tablistWrap" :isreg="isreg" :isexpire="isexpire" @showDialogEven="toshow" :isgetrankagain="isgetrankagain"></tablist>
      <p class="explain">*此活动最终解释权归深圳市爱记账有限公司所有</p> 
      <appdown></appdown>
      <x-dialog class="sendmessage" :value="dialogShow" :dialog-style="{'width':'80%', 'max-width': 'none','padding':'0.933333rem 0.4rem 0.8rem','overflow':'visible','border-radius':'0.133333rem'}">
           <span class="vux-close" @click="dialogShow = !dialogShow"></span>
           <div class="sendmessage-tip">为确保排名的公平公正，将对您的手机号进行验证，并将成绩记录在您手机号下。</div>
           <input type="tel" v-model="telvalue" placeholder="请输入手机号码" maxlength="11" class="reginput" ref="tel">
           <button class="regbtn" @click="send">短信验证</button>
      </x-dialog>

      <x-dialog class="register" :value="dialogShow2" :dialog-style="{'width':'80%','max-width': 'none','padding':'0.933333rem 0.4rem 0.8rem','overflow':'visible'}">
           <span class="vux-close" @click="dialogShow2 = !dialogShow2"></span>
           <div class="sendmessage-tip">为确保排名的公平公正，将对您的手机号进行验证，并将成绩记录在您手机号下。</div>
           <p class="send-success">验证短信已发送至{{telvalue}}</p>
           <div class="codewrap">
             <p>请输入短信验证码</p>
             <vue-input-code span-size="0.533333rem" type="number" :number="6" height="1.333333rem" span-color="#ffc12f" input-color="#ffc12f" input-size="0.64rem" :iscodefail="iscodefail" :code="messagecode"  :success="codesuccess"></vue-input-code>
             <span class="codewrap-tip" v-if="codetip">验证码错误</span>
           </div>
      </x-dialog> 

      <div class="sharemask" v-if="showshareswitch" @click="showshareMask">
        <img src="/static/img/share.png" alt="邀请好友">
      </div>    
  </div>
</template>

<script>
import axios from 'axios'
import userlist from './common/userlist'
import tablist from './common/tablist'
import appdown from './common/appdown'
import rule from './common/rule'
import VueInputCode from './common/inputcode'
import {XDialog} from 'vux'
import {Toast} from 'mint-ui'
import 'mint-ui/lib/Toast/style.css';
import qs from 'qs'

export default {
  name: 'result',  
  data () {
    return {         
      source:0,//目前分数
      historysource:0,//历史最高
      sourcelevelList:[//分数档次存储      
         {txt:'我本月工资才',
          imgface:['3-1','3-2','3-3'],
          tip:['耗子去我家都是含着泪的！','一根金针菇我吃了好几顿！','不敢拉屎，怕肚子饿。','地沟油都吃不起。','买不起姨妈巾在厕所蹲了一个礼拜。']
         },
         {txt:'我本月工资终于有',
          imgface:['2-1','2-2','3-3'],
          tip:['想找个干爹包养我','想找个干妈包养我','吃泡面舍得加蛋了','喝酸奶终于不用舔盖了','安全套终于不用循环使用了','洗发水用到最后不用兑水了']
        },
         {txt:'我本月工资高达',
         imgface:['1-1','1-2','1-3'],
         tip:['已经扶了好几个老奶奶','早餐茶叶蛋中午吃辣条','我每次赌球只买中国男足','我用4G流量玩王者荣耀','充话费每次充1年','我喝酸奶只舔盖']
       }
      ],
      sourcelevel:{txt:'我本月工资才',//目前档次
          imgface:'1-3',
          tip:'耗子去我家都是含着泪的！'
         },
      isreg:0,//判断是否已注册，用于显示弹框
      isexpire:false,
      dialogShow:false,//填写手机号码弹框开关
      dialogShow2:false,//填写验证码弹框开关
      telPattern: /^(13[0-9]|15[0-9]|17[0-9]|18[0-9]|14[0-9])[0-9]{8}$/,//手机验证正则
      telvalue:'',//手机号码绑定
      messagecode:[],  
      codetip:false,
      showshareswitch:false,//显示分享
      isgetrankagain:false,
      iscodefail:false
    }
  }, 
  components:{
     userlist,
     tablist,
     rule,
     XDialog,
     VueInputCode, 
     Toast,
     appdown              
  },
  created(){
     let self = this; 
     self.gethistory();

     if(Math.round(new Date().getTime()/1000) >= 1497369600){
        self.isexpire = true;
     }

     this.$root.eventHub.$on('end',(source)=>{ //监听游戏结束传回的分数   
        // console.log('游戏传回的分数'+ source)
        self.source = source;         
        this.sourcelevelFun();//产生档次图片和文本 
        self.gethistory();//请求历史记录
        self.$root.wxInit('吊打老板加薪！赢iphone 7、3D电影票',self.sourcelevel.txt+self.source+'元，'+self.sourcelevel.tip,function(){
             // console.log('分享成功回到')
             //  console.log('回到result')
        })                  
     }); 
      
    if(!self.getstorage('ajzisreg')){//过本地有缓存就不再判断
        let regdata = {token:self.$root.token,api:{m:'uc',a:'isReg'}}//判断是否注册
        axios.post(self.$root.httpget,qs.stringify(regdata))
          .then(function(res) {
            // console.log('是否注册')
            // console.log(res)
            if(!!res.data.data.isReg){               
               self.setstorage('ajzisreg',1); 
            }  
            self.isreg = Number(res.data.data.isReg);                      
        });          
     }else{
        // console.log('已缓存注册');
        self.isgetrankagain = !self.isgetrankagain;
        self.isreg = Number(self.getstorage('ajzisreg'));
     }
  },
  methods:{
     randomTip(len){//随机生成数
       return parseInt(Math.random()*len,10);
     },
     sourcelevelFun(){//生成分数等级档次显示效果
         let self = this;
         if(this.source <=5000){                                  
            let arr = this.sourcelevelList[0];
            this.gameResult(arr);
         }else if(this.source <=10000){             
            let arr = this.sourcelevelList[1];
            this.gameResult(arr);
         }else{             
             let arr = this.sourcelevelList[2];
             this.gameResult(arr);
         }
     }, 
     gameResult(arr){//显示档次效果
         let self = this;
         this.sourcelevel = {txt:arr.txt,imgface:arr.imgface[self.randomTip(arr.imgface.length)],tip:arr.tip[self.randomTip(arr.tip.length)]}
     }, 
     toshow(){//点击ip7显示手机弹框
        this.dialogShow = true;
        setTimeout(() => {
            this.$refs.tel.focus();
          }, 500);        
     } ,
     send(){//点击发送验证码
        let self = this;
        if(this.validate()){  
            Toast({
              message: '号码验证中',
              position: 'middle',
              duration: 1000
            });            
            let regdata = {token:self.$root.token,api:{m:'uc',a:'sendSms'},data:{mobile:self.telvalue}}//发送验证码
            axios.post(self.$root.httpget,qs.stringify(regdata))
              .then(function(res) {
                console.log('发送验证码')
                console.log(res) 
                if(res.data.code =='5001003'){
                   self.dialogShow = false;
                   self.isreg = 1;
                   self.setstorage('ajzisreg',1);
                   // Toast({
                   //   message: '号码已注册',
                   //   position: 'middle',
                   //   duration: 1000
                   // });   
                    
                }else if(res.data.code =='200'){
                     self.dialogShow = false;
                     self.dialogShow2 = true;
                 }else{                                       
                    Toast({
                      message: '发送短息失败',
                      position: 'middle',
                      duration: 1000
                    });                    
                 }                         
            });
        }
     },
     validate() {//验证手机号码 
        if(this.telvalue==''){ 
            Toast({
                message: '请填写手机号',
                position: 'middle',
                duration: 1000
              });
            return false
        }      
        if (!this.telPattern.test(this.telvalue || '')) {
          Toast({
              message: '手机格式有误',
              position: 'middle',
              duration: 1000
            });
          return false
        }else{
           return true
        }
     },     
    codesuccess(val){
        console.log('输完验证码的回调'+val)
        let self = this;
        console.log('ref:'+self.$root.ref)
        let data = {token:self.$root.token,api:{m:'uc',a:'regBySms'},data:{mobile:self.telvalue,code:val,refer:self.$root.ref}}//验证码是否准确
        axios.post(self.$root.httpget,qs.stringify(data))
          .then(function(res) {
             console.log('输入验证码');
             console.log(res); 
             if(res.data.code == '200'){
                self.dialogShow2 = false;
                self.isreg = 1;
                self.setstorage('ajzisreg',1);
                Toast({
                    message: '注册成功！',
                    position: 'middle',
                    duration: 1000
                  });
             }else if(res.data.code == '5001003'){
                 self.codetip = true;
                 self.iscodefail = !self.iscodefail
             }else{
                Toast({
                    message: '系统出错了！',
                    position: 'middle',
                    duration: 1000
                  });
                 self.codetip = false;
                 self.iscodefail = !self.iscodefail               
             }                          
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
    showshare(){
       this.showshareswitch = true;
       // console.log('显示分享')
    },
    showshareMask(){
       this.showshareswitch = false;
       // console.log('隐藏分享')
    },
    gethistory(){//获取分数
        let self = this;
        if(!this.getstorage('ajzhigh')){//判断本地是否有最高历史记录
             // console.log('没有本地记录重新请求')
             let data = {token:self.$root.token,api:{m:'uc',a:'getScore'}}//获取分数
             axios.post(self.$root.httpget,qs.stringify(data))
               .then(function(res) {
                  // console.log('没有本地记录重新请求');
                  // console.log(res);
                  if( res.data.code == '200'){
                      // console.log('没有本地记录历史分数刷新成功！')
                       self.historysource = res.data.data.score;                  
                       self.setstorage('ajzhigh',self.historysource) 
                    if(self.source > self.historysource){
                      let data = {token:self.$root.token,api:{m:'uc',a:'flushScore'},data:{score:self.source}}//刷新分数
                        axios.post(self.$root.httpget,qs.stringify(data))
                           .then(function(res) {
                              self.isgetrankagain = !self.isgetrankagain;                                      
                        });
                       }
                    }else if(res.data.code == '5003101'){
                         let data = {token:self.$root.token,api:{m:'uc',a:'flushScore'},data:{score:self.source}}//刷新分数
                           axios.post(self.$root.httpget,qs.stringify(data))
                              .then(function(res) {
                                 self.isgetrankagain = !self.isgetrankagain;                                      
                           });
                         self.historysource = self.source;                  
                         self.setstorage('ajzhigh',self.source) 
                    }                        
             });
        }else{
            self.historysource = self.getstorage('ajzhigh');
            if(self.source > self.historysource){
                // console.log('刷新记录'+ self.source)
                let data = {token:self.$root.token,api:{m:'uc',a:'flushScore'},data:{score:self.source}}//刷新分数
                axios.post(self.$root.httpget,qs.stringify(data))
                  .then(function(res) {
                     // console.log('刷新分数');
                     // console.log(res);                     
                     self.historysource = self.source;
                     self.setstorage('ajzhigh',self.source);
                     self.isgetrankagain = !self.isgetrankagain;               
                });
            }else{
               self.historysource = this.getstorage('ajzhigh');
            }         
        }
    }
  } 
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
 .result{ padding-top: 1.12rem; background:#fcf5e9 url(/static/img/resultBg.png) no-repeat;background-size: 100% auto;}
 .result-Head{font-family: weijue;width:3.96rem;height: 3.293333rem; margin:0 auto;}
 .result-Head img{width: 100%;height: 100%;}
 .resutl-Word{font-family: weijue; margin-top: 0.133333rem;line-height: 1.2; height: 3.573333rem;text-align: center; background:url(/static/img/resultWord.png) no-repeat; background-size: 100%; font-size: 0.586667rem; color: #393939;}
 .resutl-Word span{display: inline-block; color: #c74040;font-size: 0.933333rem;}
 .table{display: table;width: 100%; height: 100%;}
 .tableCell{display: table-cell;vertical-align: middle;font-weight: bold;}
 .result-again{font-family: weijue;display: block;color: #393939; width: 2.96rem;height: 1.546667rem;margin:-0.666667rem auto 0; background: url(/static/img/resultTab.png) no-repeat;font-weight: bold;
  background-size: 6.053333rem 1.68rem;background-position: -0.133333rem -0.106667rem;line-height: 1.333333rem;
  font-size: 0.48rem;text-indent: 0.4rem;}
  .result-history{font-family: weijue;padding:0.133333rem 0 0 0; font-size: 0.48rem;text-align:center}
  .result-history:before{content: '';display: inline-block;width: 0.533333rem;height: 0.533333rem;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAnCAMAAABKdvqKAAAAkFBMVEUAAABAZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ81AZ812sefTAAAAL3RSTlMABScTDztNC2XszWCCHNLEv3FrW0hCGKqJfFYh9OXhsq6id9fKu5E2MNy1jpr6lRyhIRUAAAHhSURBVDjLhZSFrsMgFIbRlrq72zrn/d/uTu6WAZM/aYGTj2MQgCjdKS0WaJGGwBfByFpaw2janedOyyZC+lvMsft9n7EYIee6CZXDzg9VFJJs6YfqOmOPsLFpuBoUOTJ4rlXdt3jR07rmWSzWMBrzww/uti8OjovzwqVdPZLHAnW6UGBOngs8uxp4CjViaywfPzbRNn71YVIgKDzA/zyyQKhLBrHH7pNkI7Qg4ikQNc43i2Niwaw1WAJxU14H5onm2KBA0nm5/otECsQVkLaXIPqEJY88kEG91gCo9pJV4zmQlRUAkFAybnmvgNpw+WzJSPheAZH5Bky5r4B6C0Aoh6anGaVkq8VjrEUEIoQhhGYCAksCN5yf+E1Gw02z6TqPOSYCRSmB7FR7/r7PA0pxSinStxFKdlDN0bEtIIvtCIAb8FOQmQSAA/kJpr0HgVqNKmsaLn+8139wTtKu19EufoC0uB8qdtFXbi3r/xair4WjTenDx+UYP6dZFWv2jAiDI/6UX7661ot7w6zedjromJsLD8c8Wana6NCyJ+npq4amtaFYRX7M/W5V7iabDXekzm0/xFUSnA/+sn1/AAfDcP2jzexiyHzvHMYYfBApsqnmdb0zDoxC8FW4DJOkUkP+AZYFII5OOLA4AAAAAElFTkSuQmCC) no-repeat; vertical-align: bottom;margin-right: 0.133333rem; background-size: 100%;}
  .result-history span{color: #c74040;display: inline-block;}
  .result-invite{font-family: weijue;margin-top: 0.266667rem; height: 1.773333rem;line-height: 1.733333rem;background:url(/static/img/result-invite.png) no-repeat;background-size: 100% ;font-size: 0.48rem;text-align: center;}
  .result-line{margin-top: 0.8rem; height: 0.333333rem;background: url(/static/img/resultLine.png) no-repeat; background-size: 100%;}
  .explain{text-align: center; padding:1.333333rem 0 0.893333rem 0;font-size: 0.32rem}
  .rule-p{ position:absolute;top:0.4rem;right: 0.4rem}
  .tablistWrap{margin-top:0.8rem;}

  .sendmessage-tip{line-height: 1.5;text-align: left;padding-bottom: 0.266667rem;font-size: 0.373333rem}
  .reginput{width: 100%; line-height: 1;padding:0.4rem 0.266667rem; display: block;font-size:0.373333rem; margin:0 auto;border:1px solid #cacaca;}
  .regbtn{margin:0.4rem 0 0 0; width: 100%;padding:0.133333rem 0; font-size: 0.533333rem;background:url(/static/img/dialogbtn.png) no-repeat; font-family: weijue; background-size: 100%;border:none;height:1.746667rem;line-height:1.066667rem;}
  .send-success{text-align: left;}
  .codewrap{padding:0.333333rem 0.133333rem 0;text-align: left;font-size: 0.373333rem;color: #c2c2c2;}
   .codewrap p{padding:0.266667rem 0;}
   .codewrap-tip{padding:0.533333rem 0 0 0; display:block;text-align: center;color: #f38d8d;font-size: 0.373333rem;}
/*关闭按钮*/
.vux-close {position: absolute;right: -0.32rem;top:-0.32rem; background-color:#d8d8d8; border:1px solid #ccc;border-radius: 50%; display: inline-block;vertical-align: middle;color: #999;width: 1.013333rem;height: 1.013333rem;}
.vux-close:before,.vux-close:after {content: '';position: absolute;left: 50%;top: 50%;width: 0.506667rem;height: 1px;background-color: #fff;-webkit-transform:translate(-50%,-50%) rotate(-45deg) ;transform:translate(-50%,-50%) rotate(-45deg) ;}
.vux-close:after {-webkit-transform:translate(-50%,-50%) rotate(45deg) ;transform:translate(-50%,-50%) rotate(45deg);}
.dialog-demo .vux-close {margin-top: 0.213333rem;margin-bottom: 0.213333rem;}
.sharemask{position: fixed;z-index: 100; top:0;left: 0;bottom:0;width: 100%; background-color:rgba(0,0,0,.5);}
.sharemask img{display: block;width: 9.186667rem;height: 8.666667rem; float: right;}
</style>
