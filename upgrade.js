// 渲染进程
/**
 * 升级管理
 * author ranmufei@qq.com
 * date 2018/02/8
 */
const electron = require('electron')
const {ipcRenderer} = require('electron')
//const runpath=require('electron').remote.getGlobal('linksame').runpath

const htmls=document.getElementById("#download")

let d= document.getElementById("downloading").style.width = '50%';

var vm = new Vue({
 	el:'#download',
 	data:{
 	    name:'ranmufei',
 	    arr:[ ],
 	    downloaded:0
 	},
 	methods:{
 		checkUpgrade:function(){
 			// 检测升级包
 			ipcRenderer.send('checkForUpdate')
 		},
 		upgradeing:function(){
 			// 升级
 		}
 		
 	}
})


ipcRenderer.on('downloadProgress', (event, arg) => {
 	console.log(arg)
 	vm.downloaded=arg.percent.toFixed(2)
 	let d= document.getElementById("downloading").style.width = arg.percent+'%';

})








