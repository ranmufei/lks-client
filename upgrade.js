// 渲染进程
/**
 * 升级管理
 * author ranmufei@qq.com
 * date 2018/02/8
 */
const electron = require('electron')
const {ipcRenderer} = require('electron')
//const runpath=require('electron').remote.getGlobal('linksame').runpath
const version=require('electron').remote.getGlobal('linksame').version

const htmls=document.getElementById("#download")

let d= document.getElementById("downloading").style.width = '50%';

var vm = new Vue({
 	el:'#download',
 	data:{
 	    name:'ranmufei',
 	    arr:[ ],
 	    downloaded:0,
 	    dialogVisible:false,
 	    updateVisible:false,
 	    downloadVisible:false,
 	    version:{},
 	    versionlog:'',
 	    disabled:false,
 	    nowversion:version
 	},
 	methods:{
 		checkUpgrade:function(){
 			// 检测升级包
 			
 			vm.loading()
 			ipcRenderer.send('checkForUpdate')
 		},
 		download:function(){
 			// 下载
 			vm.downloadVisible=true
 			vm.disabled=true
 			ipcRenderer.send('download')
 		},
 		upgradeing:function(){
 			// 升级
 			
 			ipcRenderer.send('isUpdateNow')
 		},
 		handleClose:function(d){
 			console.log('close')
 		},
 		loading:function(){
 			const loading = vm.$loading({
			          lock: true,
			          text: '版本检测中……',
			          spinner: 'el-icon-loading',
			          background: 'rgba(0, 0, 0, 0.7)'
			        });
 			setTimeout(() => {
			         loading.close();
			        }, 3000);
 		}
 		
 	},
 	watch:{
 		downloaded:function(val){
 			if(val==100){
 				ipcRenderer.send('isUpdateNow')
 				this.dialogVisible=true
 			}
 		}
 	}
})


ipcRenderer.on('downloadProgress', (event, arg) => {
 	console.log(arg)
 	vm.downloaded=arg.percent.toFixed(0)
 	let d= document.getElementById("downloading").style.width = arg.percent+'%';

})
// 关闭窗口的时候清理监听
/*ipcRenderer.on('close', (event, arg) => {
 	 ipcRenderer.removeAll(["checkForUpdate", "download", "isUpdateNow","downloadProgress","checkinfo","close"]);
})*/

window.onunload = function(event) { 
	//alert("aaaa")
	ipcRenderer.removeAll(["checkForUpdate", "download", "isUpdateNow","downloadProgress","checkinfo","close"]);
 }

// 查询版本信息
ipcRenderer.on('checkinfo', (event, arg,abc) => {
 	console.log(arg)
 	vm.version=arg
 	if(arg.version){
 		vm.updateVisible=true
 		$.ajax({
 			type:'get',
 			url:'http://www.linksame.com/yberelease80/log-'+arg.version+'.txt',
 			success:function(data){
 				console.log('upgread log:',data)
 				vm.versionlog=data
 			}
 		})
 	}
 	//let d= document.getElementById("downloading").style.width = arg.percent+'%';

})

vm.loading()
setTimeout(function(){
	vm.checkUpgrade()
},3000)









