/**

	
 * 主登陆界面
 * author ranmufe@qq.com
 */
const {app} = require('electron')


var ipc = require('electron').ipcRenderer;
/*document.getElementById('maxbt').addEventListener('click', () => {
  console.log('hello vscode!')
  asd

  ipc.send('window-max');

})
document.getElementById('minbt').addEventListener('click', () => {
  console.log('hello vscode!')
  ipc.send('window-min');

})*/
document.getElementById('closebtn').addEventListener('click', () => {
  console.log('hello vscode!')
  ipc.send('window-close');

})

const closebtn=document.getElementById("login").addEventListener('click',()=>{
      $("#login").css('background','none');
      $("#login").text("登陆中……");
      console.log('clicke');
      
      window.location.href='http://www.linksame.com/index.php?app=Core&m=Pcdlogin&network=1&ip=0'
      
})
