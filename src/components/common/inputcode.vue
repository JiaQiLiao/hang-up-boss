<template type="x/template">
	<div id="vue_input_code">
		<div class="input" @click="focusInput" :style="{'height':height}">
      <div :class="{'input-code':true,first:inputCodeNum===0,last:inputCodeNum===6}" :style="{left:left,'z-index':zIndex,'height':height,'width':blockSize-1+'%'}">
      	<template v-if="type==='number'">
      		<input ref="input_code" type="tel" :style="{'font-size':inputSize,'color':inputColor}" @keyup="inputCodeEvent($event)" @blur="blurInput" v-model="inputCode" autofocus maxlength="1" @keyup.delete="deleteInput">
      	</template>
        <template v-else>
      		<input ref="input_code" type="text" :style="{'font-size':inputSize,'color':inputColor}" @keyup="inputCodeEvent($event)" @blur="blurInput" v-model="inputCode" autofocus maxlength="1" @keyup.delete="deleteInput">
      	</template>
      </div>
      <span v-for="(item,index) in block" :style="{'font-size':spanSize,'color':spanColor,'height':height,'line-height':height,'width':blockWidth}" v-text="codeArray[index]?codeArray[index]:''" :class="{'first':index===0,'last':index===number-1}"></span>
      <!-- <span :style="{'font-size':spanSize,'color':spanColor,'height':height,'line-height':height}" v-text="codeArray[1]?codeArray[1]:''"></span>
      <span :style="{'font-size':spanSize,'color':spanColor,'height':height,'line-height':height}" v-text="codeArray[2]?codeArray[2]:''"></span>
      <span :style="{'font-size':spanSize,'color':spanColor,'height':height,'line-height':height}" v-text="codeArray[3]?codeArray[3]:''"></span>
      <span :style="{'font-size':spanSize,'color':spanColor,'height':height,'line-height':height}" v-text="codeArray[4]?codeArray[4]:''"></span>
      <span :style="{'font-size':spanSize,'color':spanColor,'height':height,'line-height':height}" class="last" v-text="codeArray[5]?codeArray[5]:''"></span> -->
    </div>
	</div>
</template>

<script type="text/babel">
export default {
	props:{
		code:{
			type:Array,
			default:function(){
				return []
			},
			required:true
		},//接收一个可以改变父组件的数据(引用类型才可以修改,所以这里是引用类型)
		success:{
			type:Function,
			default:function(){}
		},//用户输入完成后的回调
		error:{
			type:Function,
			default:function(){}
		},//用户输入了不是数字的时候调用的函数
		getinput:{
			type:Function,
			default:function(){}
		},//每次输入都回调
		spanSize:{
			type:String,
			default:"20px"
		},// 显示字体大小
		spanColor:{
			type:String,
			default:"#f35252"
		},// 显示字体颜色
		inputSize:{
			type:String,
			default:"20px"
		},//输入框字体大小
		inputColor:{
			type:String,
			default:"#000"
		},//输入框字体颜色
		height:{
			type:String,
			default:"40px"
		},
		number:{
			type:Number,
			default:6,
		},//验证码个数
		type:{
			type:String,
			default:"number"
		},//用户输入类型,有number,mix
		iscodefail:{
			type:Boolean,
			default:false
		}
	},
	data () {
		return {
			inputCodeNum:0,//输入框的位置
			left:"0",//输入框距离左边的距离
			inputCode:"",//单次输入的值
			codeArray:[],//输入的值数组
			blockWidth:(100/this.number).toFixed(4)+'%',//每个格子的宽度
			blockSize:(100/this.number).toFixed(4),//计算用宽度
			block:[],//存放格子
			zIndex:10,//输入框层级(开始默认最高)
		}
	},
	created(){
		let block = [];
		for(let i=0;i<this.number;i++){
			block.push(i);
		}
		this.block = block;//获取格子数并保持方便循环
	},
	filters:{
		
	},
	watch:{
		iscodefail(a,b){
			// console.log('验证码错误重置')
			this.codeArray =  [],
			this.inputCodeNum = 0,
			this.inputCode = '',
			this.left = '0'
		}
	},
	computed:{
		codeString(){
			let data = "";
			this.codeArray.map(item=>{
				data+=item;
			});
			return data;
		}
	},
	methods:{
		/** 删除输入 */
		deleteInput(){
			if(this.inputCodeNum===this.number-1){
				this.inputCodeNum--;
				let n = this.blockSize*(this.inputCodeNum);
				this.left = n+"%";
				this.codeArray.pop();
				this.code.pop();
				this.getinput(this.codeString);//回调
				return;
			}
			if(this.inputCodeNum!==0){
				this.inputCodeNum--;
				this.codeArray.pop();
				this.code.pop();
				let n = this.blockSize*(this.inputCodeNum);
				this.left = n+"%";
				this.getinput(this.codeString);//回调
			}
		},
		/** 每次输入的事件 */
		inputCodeEvent(event){
			// 要求输入数字类型
			if(this.type==="number"&&event.keyCode>=48&&event.keyCode<=57){
				let code = event.target.value;//code
					
				if(this.inputCodeNum<this.number-1){
					this.codeArray.push(code);
					this.code.push(code);
					this.inputCode = "";
					this.inputCodeNum++;
					let n = this.blockSize*this.inputCodeNum
					this.left = n+"%";
					this.getinput(this.codeString);//回调
				}
				else{
					if(this.inputCodeNum===this.number-1){
						this.inputCodeNum++;
						this.codeArray.push(code);
						this.code.push(code);
						this.success(this.codeString);//输入完成后回调
						this.getinput(this.codeString);//回调
					}
				}
				return;
			}
			
			/** 输入字母和数字类型 */
			if(this.type==="text"&&(event.keyCode>=65&&event.keyCode<=81||event.keyCode>=48&&event.keyCode<=57)){
				// event.keyCode>=65&&event.keyCode<=81
				let code = event.target.value;//code
					
				if(this.inputCodeNum<this.number-1){
					this.codeArray.push(code);
					this.code.push(code);
					this.inputCode = "";
					this.inputCodeNum++;
					let n = this.blockSize*this.inputCodeNum
					this.left = n+"%";
					this.getinput(this.codeString);//回调
				}
				else{
					if(this.inputCodeNum===this.number-1){
						this.inputCodeNum++;
						this.codeArray.push(code);
						this.code.push(code);
						this.success(this.codeString);//输入完成后回调
						this.getinput(this.codeString);//回调
					}
				}
			}
		},
		/** 失去焦点 */
		blurInput(){
			this.zIndex = -10;
		},
		/** 获得焦点 */
		focusInput(){
			this.zIndex = 10;
			this.$refs.input_code.focus();
		}
	}
}
</script>

<style lang="css" scoped>
#vue_input_code {
  width: 100%; }
  #vue_input_code .input {
    width: 100%;
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: row;
        flex-direction: row;
    -ms-flex-pack: center;
        justify-content: center;
    -ms-flex-align: center;
        align-items: center; }
    #vue_input_code .input > div {
      border: 1px solid #323232;
      font-weight: 900;
      background-color: white; }
      #vue_input_code .input > div:nth-child(n) {
        border-right: none; }
      #vue_input_code .input > div:last-child {
        border-top-right-radius: 0.066667rem;
        border-bottom-right-radius: 0.066667rem;
        border-right: 1px solid #323232; }
      #vue_input_code .input > div input {
        font-size: 0.32rem;
        width: 90%;
        color: #323232;
        text-align: center;
        outline: none;
        border: none;
        margin-right: 0.066667rem;
        -webkit-tap-highlight-color: rgba(255, 255, 255, 0); }
    #vue_input_code .input .input-code {
      position: absolute;
      top: 0;
      left: 0;
      margin-left: 1%;
      border: none;
      background: none;
      display: -ms-flexbox;
      display: flex;
      -ms-flex-direction: row;
          flex-direction: row;
      -ms-flex-pack: center;
          justify-content: center;
      -ms-flex-align: center;
          align-items: center; }
    #vue_input_code .input > span {
      border: 1px solid #323232;
      font-weight: 900;
      background-color: white;
      display: inline-block;
      text-align: center;
      font-size: 20px; }
      #vue_input_code .input > span:nth-child(n) {
        border-right: none; }
      #vue_input_code .input > span:first-child {
        border-top-left-radius: 5px;
        border-bottom-left-radius: 5px; }
      #vue_input_code .input > span:last-child {
        border-top-right-radius: 5px;
        border-bottom-right-radius: 5px;
        border-right: 1px solid #323232; }
    #vue_input_code .input > span.first {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px; }
    #vue_input_code .input .input-code.first {
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px; }
    #vue_input_code .input .input-code.last {
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px; }
</style>