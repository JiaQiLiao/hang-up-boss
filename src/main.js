// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import begin from './components/begin'
import game from './components/game'
import result from './components/result'
import wx from 'weixin-js-sdk'
import axios from 'axios'
import qs  from 'qs'

// import 'babel-polyfill'
let token = document.getElementById('token').value;
let httpur = 'https://test-api.ajzhan.com/';
let httpurl = 'https://test-api.ajzhan.com/edge.php';

let ref = document.getElementById('refer').value;
// console.log('获取页面token'+token);
// console.log('获取页面url'+httpurl);


Vue.config.productionTip = false;

Vue.use(VueRouter)

const router = new VueRouter({
	routes:[{
		path:'/',
		component:begin
	},{
		path:'/begin',
		component:begin
	},{
		path:'/game',
		component:game
	},{
		path:'/result',
		component:result
	},]
})
// let token = '';
// let data2 = {api:{m:'uc',a:'getToken'}}
// axios.post('https://dev-api.ajzhan.com/edge.php',qs.stringify(data2))
//           .then(function(res) {
//              console.log('获取token');
//              console.log(res);
//              token = res.data.token;
// });
//微信分享使用方法
    Vue.prototype.wxInit = (title,desc,callback)=>{
      let links=httpurl;   //分享出去的链接      
     let data2 = {token:token,api:{m:'uc',a:'share'}}
       axios.post(httpurl,qs.stringify(data2))
          .then(function(res) {
             // console.log('获取分享');
             // console.log(res); 
           wx.config({
              debug: false,
              appId: res.data.data.appId,
              timestamp: res.data.data.timestamp,
              nonceStr: res.data.data.nonceStr,
              signature: res.data.data.signature,
              jsApiList: [
                  'onMenuShareTimeline','onMenuShareAppMessage'
              ]
          });  
        });
          wx.ready(function () {            
            wx.onMenuShareTimeline({
                title: title, // 分享标题
                link:httpurl+'?refer='+token, // 分享链接'
                desc:desc,
                imgUrl: httpur + '/static/img/wxshare.png', // 分享图标
                success: function () {
                    // 分享纪录  
                    callback();                  
                    // console.log("分享到朋友圈成功")
                },
                cancel: function () {
                    // console.log("分享失败,您取消了分享!")
                }
            });
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: httpurl+'?refer='+token, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: httpur + '/static/img/wxshare.png', // 分享图标                
                success: function () { 
                    // 用户确认分享后执行的回调函数
                    callback()
                },
                cancel: function () { 
                    // 用户取消分享后执行的回调函数
                }
            });
            
          });
          wx.error(function(res){
              // alert("error")
              // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
    }


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  data: {
    eventHub: new Vue(),
    token:token,
    httpget:httpurl,
    ref:ref
  }
});




