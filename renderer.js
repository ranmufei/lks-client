// 渲染进程
/**
 * 下载 文件管理
 * author ranmufei@qq.com
 * date 2018/01/23 
 */
const electron = require('electron')
const Notification = electron.Notification
const {shell} = require('electron')
// Module to control application life.

const path = require('path')
const nedb = require('nedb'); // 数据库
//const app_data=app.getPath('userData')
// 实例化连接对象（不带参数默认为内存数据库）

const runpath=require('electron').remote.getGlobal('linksame').runpath

const db = new nedb({
  filename: path.join(runpath,'\\Cache\\downloadfile.db'),
  autoload: true
});

const htmls=document.getElementById("#download")


var vm = new Vue({
 	el:'#download',
 	data:{
 	    name:'ranmufei',
 	    arr:[ ]
 	},
 	methods:{
 		openfile:function(fullpath){
 			shell.openItem(fullpath)
 		},
 		openfield:function(fullpath){
 			let paths=fullpath.substring(0,fullpath.lastIndexOf("\\")+1,fullpath.length-1);
 			shell.openItem(paths)
 		},
 		del:function(id){
 			// 删除单项
			db.remove({
			  _id:id
			}, (err, ret) => {
				vm.arr=[];
				getall();
			})
 		}
 	}
})



function getall(){
	// 查询所有结果集
	db.find({}, function (err, docs) {
		for(var item in docs){
			console.log('',docs[item])
			vm.arr.push(docs[item])
		}
	  console.log('res :',docs)
	});	
}


getall();





