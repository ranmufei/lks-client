if (require('electron-squirrel-startup')) return;
const electron = require('electron')
//import { autoUpdater } from "electron-updater"
const autoUpdater=require('electron-updater').autoUpdater
autoUpdater.autoDownload = false // 配置取消自动下载
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const BrowserView = electron.BrowserView
const dialog = electron.dialog
const Tray = electron.Tray
const Menu = electron.Menu
const Notification = electron.Notification
const window = electron.window
const ipcMain = require('electron').ipcMain
const ipcRenderer = require('electron').ipcRenderer
//const storage = require('electron-json-storage')
const {shell} = require('electron')
const notify = require('electron-main-notification')
const {session} = require('electron')
const fs = require('fs');
const nedb = require('nedb'); // 数据库
const storage = require('electron-json-storage'); 

const path = require('path')
const url = require('url')

const  child_process = require('child_process')
const startOnBoot = require('./js/startOnBoot.js')  // 开机启动相关
// 打印机模块
//const escpos = require('escpos');
//const usb = require('usb');

const icologo=__dirname+'\\ioc\\ls.ico'
// 域名
const domain="http://login.03in.net:81/";
const loginpath=domain+"/index.php?app=Core&m=Pcdlogin&network=1&ip=0"
const request = require('request')
// 注册快捷键
const {globalShortcut} = require('electron')

const exname='yinbeier'

const Stream = require('node-rtsp-stream');


// 判断网络配置
const  options = {
　　　　　　 method: 'post',
                      url:domain+'/net.json',
                      form: "content",
                      headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      }
                    };

const message={
      error:'check version error',
      checking:'check updateing ......',
      updateAva:'find a New Version，downloading ......',
      updateNotAva:'now it New best',
    };
const os = require('os');
const mainindex = path.join('file://', __dirname, 'index.html')
// init obj
let mainWindow
let tray = null
const app_data=app.getPath('userData')
console.log('app_data',app_data)

// 设置共享运行目录
global.linksame = {
  runpath: app_data,
  version:app.getVersion()
}

// 实例化连接对象（不带参数默认为内存数据库） 

const db = new nedb({
  filename: path.join(app_data,'\\Cache\\downloadfile.db'),
  autoload: true
});


let ybeurl=domain;//'http://pos.ybe.03in.com:8086/#/login'

//婴贝儿 自定义编辑打开地址存放数据库中 
/*storage.set('url', 'pos.ybepro.03in.com', function(error) {
  if (error) throw error;
});
*/
storage.get('url', function(error, data) {
   if (error) throw error;

    if(typeof(data) =="string" && data.length>5){
        console.log('geturl ok:  ',data,data.length);
        ybeurl=data
    }else{
        console.log('geturl no:  ',data);
    }
   //mainWindow.loadURL(ybeurl)
   mainWindow.loadURL(mainindex)
    console.log('typeof',typeof(data))
});

console.log('url:',ybeurl)

let date=new Date();

const initobj={
  width:800,
  height:760,
}



// 设置自动启动
startOnBoot.getAutoStartValue(exname, (error, result) => {

/*
  storage.get('disableAutoStart', function(error, data) {
   if (error) throw error;
    // 取消开机启动
    if(data==1){
        
    }else{
         if (result) {
              // 不是自动启动会执行这里
              console.log('设置自动启动',result)
              startOnBoot.enableAutoStart(exname, process.execPath)
          }
    }

});
*/
})

// 参数说明 mainindex 打开窗口url 地址
// 
function createWindow() {
    // Create the browser window.
    mainWindow = new BrowserWindow({ 
    /* width:300,
     height:500,*/
     width: 1024,//electron.screen.getPrimaryDisplay().workAreaSize.width,
     height: 760,//electron.screen.getPrimaryDisplay().workAreaSize.height,
      icon:icologo,
      title:'步步高零售风险管控系统',
      //frame: false,     
      //resizable:false, 
      //transparent: false,
      backgroundColor:'#4385F4',
      webPreferences:{
        nodeIntegration:true,
        nodeIntegrationInWorker:true,
      }
    })

// 全屏
  //  mainWindow.setFullScreen(true);
    // 退出全屏
   /* globalShortcut.register('ESC', () => {
        mainWindow.setFullScreen(false);
    })*/

//Menu.setApplicationMenu(null);
// 本地url
 //mainWindow.loadURL(mainindex)
  
// 全局组合键功能
globalShortcut.register('CommandOrControl+F1',function(){
        //强制退出软件
          const dopt={
                type:'question',
                title:'你确定要退出软件？',
                buttons:['确定','取消'],
                defaultId:1,
                message:'确定关闭件吗？',
                //icon:'./ioc/ls.ico',
                noLink:true,
              }
              dialog.showMessageBox(dopt,function(e){
                 console.log('e:',e)
                 if(e==0){
                      app.quit(); 
                 }else{
                    console.log('nat close')
                 }
                //   
              })
       
});

// 全局组合键关机
globalShortcut.register('CommandOrControl+F12',function(){
            const dopt={
                type:'question',
                title:'你确定要关闭计算机吗？',
                buttons:['确定','取消'],
                defaultId:1,
                message:'警告！ 执行此操作将会关闭电脑 你确定要关闭吗？',
                //icon:'./ioc/ls.ico',
                noLink:true,
              }
              dialog.showMessageBox(dopt,function(e){
                 console.log('e:',e)
                 if(e==0){
                    child_process.exec("shutdown /s /t 0")
                 }else{
                    console.log('nat close')
                 }
                //   
              })
});

// 设置开机启动
globalShortcut.register('CommandOrControl+F10',function(){
            const dopt={
                type:'question',
                title:'你确定要开机启动步步高吗？',
                buttons:['确定','取消'],
                defaultId:1,
                message:'警告！ 你确定要开机启动步步高吗？',
                //icon:'./ioc/ls.ico',
                noLink:true,
              }
              dialog.showMessageBox(dopt,function(e){
                 console.log('e:',e)
                 if(e==0){
                    startOnBoot.enableAutoStart(exname, process.execPath)
                 }else{
                    console.log('nat close')
                 }
                //   
              })
});

// 设置取消开机启动
globalShortcut.register('CommandOrControl+F11',function(){
            const dopt={
                type:'question',
                title:'你确定要取消开机启动步步高客户端吗？',
                buttons:['确定','取消'],
                defaultId:1,
                message:'警告！你确定要取消开机启动步步高客户端吗？',
                //icon:'./ioc/ls.ico',
                noLink:true,
              }
              dialog.showMessageBox(dopt,function(e){
                 console.log('e:',e)
                 if(e==0){
                      startOnBoot.disableAutoStart(exname)
                      // 记录 已取消开机启动
                      storage.set('disableAutoStart', '1', function(error) {
                        if (error) throw error;
                      });
                 }else{
                    console.log('nat close')
                 }
                //   
              })
});

// 快捷键弹出 设置入口地址
globalShortcut.register('CommandOrControl+F9',function(){
         const modalPath = path.join('file://', __dirname, 'seturl.html')
                   //let win = new BrowserWindow({ width: 705, height: 250,resizable:false,autoHideMenuBar:true,type: 'desktop', icon: './ioc/download2.png' })
                   let win = new BrowserWindow({ 
                    width: 705, 
                    height: 250,
                    autoHideMenuBar:true,
                    type: 'desktop', 
                    icon: __dirname+'\\ioc\\download2.png',
                    resizable:false,
                    maximizable:false,
                     })
                  //win.setApplicationMenu(null);
                  win.on('close', function() { win = null })
                  win.loadURL(modalPath)
                  win.show()
});


    mainWindow.once('ready-to-show', () => {
        mainWindow.show()


     /*   usb.on('attach', function(device) {
          console.log(device);
        });
           */
         /* // Select the adapter based on your printer type
          const device  = new escpos.USB(0x01, 0xff);
          // const device  = new escpos.Network('localhost');
          // const device  = new escpos.Serial('/dev/usb/lp0');
           
          const options = { encoding: "GB18030"  }
          // encoding is optional
           
          const printer = new escpos.Printer(device, options);
           
           
           
          device.open(function(){
            printer
            .font('a')
            .align('ct')
            .style('bu')
            .size(1, 1)
            .text('The quick brown fox jumps over the lazy dog')
           // .text('敏捷的棕色狐狸跳过懒狗')
           //  .barcode('1234567', 'EAN8')
           
          });*/

    })

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {
       
        mainWindow = null
    })



    //捕获新打开窗口事件 定制新窗口
    mainWindow.webContents.on('new-window', (event, url) => {
      event.preventDefault()
      const win = new BrowserWindow({ 
        width: 1024, 
        height: 760,
        icon:__dirname+'./ioc/ls.ico',
        title:'步步高收银客户端 正式版',
        //frame: false,
        //resizable:false,
        //transparent: false,
        backgroundColor:'#4385F4',

      })
      
      win.once('ready-to-show', () => win.show())
      win.loadURL(url)
      //event.newGuest = win

      console.log('windowID:',win.id)

      ipcMain.on('sub-close',function(d){
        console.log('d',d)
        win.hide()
      })

    })

    // download 

    mainWindow.webContents.session.on('will-download', (event, item, webContents) => {
        // Set the save path, making Electron not to prompt a save dialog.

        item.on('updated', (event, state) => {

            if (state === 'interrupted') {
                console.log('Download is interrupted but can be resumed')
            } else if (state === 'progressing') {
                // set loading progressBar
                 mainWindow.setProgressBar(item.getReceivedBytes() / item.getTotalBytes());

                if (item.isPaused()) {
                    console.log('Download is paused')
                } else {

                  if(Math.ceil(item.getReceivedBytes()/1024/1024)===1){
                      let title='稍等 正在下载';
                      let body= item.getSavePath();
                      let ico=getico(item.getSavePath());
                      notifly(title,body,ico)
                  }

                    let download = `Received bytes: ${Math.ceil(item.getReceivedBytes()/1024/1024)} M / ${Math.ceil(item.getTotalBytes()/1024/1024)}M`

                    console.log(`Received bytes: ${Math.ceil(item.getReceivedBytes()/1024/1024)} M / ${Math.ceil(item.getTotalBytes()/1024/1024)}M`)
                }
            }
        })
        item.once('done', (event, state) => {

            if (state === 'completed') {
                const filepath=item.getSavePath();
                var arr = filepath.split('\\');
                let filename=arr[arr.length-1];

                let title=filename+' 下载完成！';
                let body= item.getSavePath()+'    打开';
                let ico=getico(item.getSavePath());

                //notifly(title,body,ico)
                notiflyclick(title,body,function(){ shell.openItem(filepath) })
                console.log('Download successfully')
            
                db.insert({
                    name: filename,
                    path:item.getSavePath(),
                    datetime:date.toLocaleDateString(),
                    sizes:Math.ceil(item.getTotalBytes()/1024/1024),
                  }, (err, ret) => {
                     console.log('insert successfully',err,ret)
                  });
               

            } else {
                console.log(`Download failed: ${state}`)
            }
        })



    })

    //  任务栏图标菜单 A 
    tray = new Tray(icologo)
    const contextMenu = Menu.buildFromTemplate([{
            label: '帮助中心',
            type: 'normal',
            icon:  __dirname+'\\ioc\\help.png',
            click: function() {
                 //   child_process.exec("shutdown /s /t 0")
                  shell.openExternal('http://help.linksame.com/')
             }
        },
        { label: '官网', type: 'normal', icon: __dirname+'\\ioc\\web.png',click:function(){
            shell.openExternal('http://www.linksame.com')
        }},
     /*   { label: '移动端', type: 'normal', icon:__dirname+'\\ioc\\phone.png',click:function(){
            //shell.openExternal('http://www.linksame.com/index.php?app=Core&m=V7&a=download')
            
            const modalPath = path.join('file://', __dirname, 'qcode.html')
            //let win = new BrowserWindow({ width: 705, height: 250,resizable:false,autoHideMenuBar:true,type: 'desktop', icon: './ioc/download2.png' })
            let win = new BrowserWindow({ 
              title:'移动设备软件下载', 
              width: 250, 
              height: 250,
              autoHideMenuBar:true,
              type: 'desktop', 
              icon:__dirname+'\\ioc\\phone.png',
              resizable:false,
              transparent:false,
              maximizable:false,

               })
            //win.setApplicationMenu(null);
            win.on('close', function() { win = null })
            win.loadURL(modalPath)
            win.show()

        } },*/
        {
            label: '下载管理',
            type: 'normal',
            icon:__dirname+'\\ioc\\down.png',
            click: function() {
                const modalPath = path.join('file://', __dirname, 'download.html')
                //let win = new BrowserWindow({ width: 705, height: 250,resizable:false,autoHideMenuBar:true,type: 'desktop', icon: './ioc/download2.png' })
                let win = new BrowserWindow({ 
                  width: 705, 
                  height: 250,
                  autoHideMenuBar:true,
                  type: 'desktop', 
                  icon: __dirname+'\\ioc\\download2.png',
                  resizable:false,
                  maximizable:false,
                   })
                //win.setApplicationMenu(null);
                win.on('close', function() { win = null })
                win.loadURL(modalPath)
                win.show()
            }
        },
        {
            label: '设置',
            type: 'submenu',
            icon:__dirname+'\\ioc\\setting.png',
            submenu: [
                { label: '开机启动', type: 'normal', icon:__dirname+'\\ioc\\sysset.png' ,click:function(){

                   
                    let st=startOnBoot.enableAutoStart(exname, process.execPath)
                     console.log('st',st)

                }}, 
                { label: '取消开机启动', type: 'normal', icon:__dirname+'\\ioc\\sysset.png' ,click:function(){

                   
                    let dst=  startOnBoot.disableAutoStart(exname)
                     console.log('dst',dst)  
                     // 记录 已取消开机启动
                      storage.set('disableAutoStart', '1', function(error) {
                        if (error) throw error;
                      });

                }},
            
                { label: '自定义店铺入口', type: 'normal', icon:__dirname+'\\ioc\\sysset.png' ,click:function(){

                   const modalPath = path.join('file://', __dirname, 'seturl.html')
                   //let win = new BrowserWindow({ width: 705, height: 250,resizable:false,autoHideMenuBar:true,type: 'desktop', icon: './ioc/download2.png' })
                   let win = new BrowserWindow({ 
                    width: 705, 
                    height: 250,
                    autoHideMenuBar:true,
                    type: 'desktop', 
                    icon: __dirname+'\\ioc\\download2.png',
                    resizable:false,
                    maximizable:false,
                     })
                  //win.setApplicationMenu(null);
                  win.on('close', function() { win = null })
                  win.loadURL(modalPath)
                  win.show()

                }},
                { label: '更新缓存', type: 'normal', icon:__dirname+'\\ioc\\clear-2.png',click:function(){
                           let cachepath=app_data+'/Cache'
                           let gpupath=app_data+'/GPUCache'
                           let storagepath=app_data+'/Local Storage'
                         
                          /*var rootFile = app_data;//要删除的文件夹 url
                            //删除所有的文件(将所有文件夹置空)
                            var emptyDir = function(fileUrl){
                                var files = fs.readdirSync(fileUrl);//读取该文件夹
                                files.forEach(function(file){
                                    var stats = fs.statSync(fileUrl+'/'+file);
                                    if(stats.isDirectory()){
                                        emptyDir(fileUrl+'/'+file);
                                    }else{
                                        fs.unlinkSync(fileUrl+'/'+file);
                                        console.log("删除文件"+fileUrl+'/'+file+"成功");
                                    }
                                });
                            }
                            //删除所有的空文件夹
                            var rmEmptyDir = function(fileUrl){
                                var files = fs.readdirSync(fileUrl);
                                if(files.length>0){
                                    var tempFile = 0;
                                    files.forEach(function(fileName)
                                    {
                                        tempFile++;
                                        rmEmptyDir(fileUrl+'/'+fileName);
                                    });
                                    if(tempFile==files.length){//删除母文件夹下的所有字空文件夹后，将母文件夹也删除
                                        fs.rmdirSync(fileUrl);
                                        console.log('删除空文件夹'+fileUrl+'成功');
                                    }
                                }else{
                                    fs.rmdirSync(fileUrl);
                                    console.log('删除空文件夹'+fileUrl+'成功');
                                }
                            }
                            emptyDir(rootFile);
                            rmEmptyDir(rootFile);*/
                         


                           let dir=fs.readdir(cachepath,(err,file)=>{                                                          
                              for(v in file){
                                  console.log('file',v)
                                  let rmnum=shell.moveItemToTrash(path.join(cachepath,file[v]))
                                  console.log('remove',rmnum)
                              }
                              notifly('缓存清理','缓存清理完成！',__dirname+'\\ioc\\ok.png')
                           })

                           let gpuchach=fs.readdir(gpupath,(err,file)=>{                                                          
                              for(v in file){
                                  console.log('file',v)
                                  let rmnum=shell.moveItemToTrash(path.join(gpupath,file[v]))
                                  console.log('remove',rmnum)
                              }
                              notifly('缓存清理','gpuchache缓存清理完成！',__dirname+'\\ioc\\ok.png')
                           })
                      
                         let storchach=fs.readdir(storagepath,(err,file)=>{                                                          
                                                    for(v in file){
                                                        console.log('file',v)
                                                        let rmnum=shell.moveItemToTrash(path.join(storagepath,file[v]))
                                                        console.log('remove',rmnum)
                                                    }
                                                    notifly('缓存清理','storagepath缓存清理完成！',__dirname+'\\ioc\\ok.png')
                                                 })


                }},
              
            ]
        },
        { label: '升级', type: 'normal', icon: __dirname+'\\ioc\\upgrate.png',click:function(){
          updateHandle();
        } },
        { label: '注销', type: 'normal', icon: __dirname+'\\ioc\\zx.png', role: 'close',click:function(){
            
            // console.log('siht',console.log(ses.getUserAgent()))
            // 查询与指定 url 相关的所有 cookies.
            
            /*session.defaultSession.cookies.remove('http://www.linksame.com','sns_shell',function(cookies) {
                          console.log('remove~~~~')
                        });*/
            session.defaultSession.cookies.get({url:domain}, function(error, cookies) {

                       let  domainObj=cookies
                       for (var i in domainObj){
                         console.log(i,':',domainObj[i])
                         session.defaultSession.cookies.remove(domain,domainObj[i].name, function(data) {
                                       console.log('remove',data);
                          });
                         
                       }
                       //console.log('ddd',domainObj)
             });

             let newobj=session.defaultSession.cookies.get({ url : domain }, function(error, cookies) {
                console.log('login out coockie:',newobj)
              });
           
              app.quit();  
              //session.cookies.remove("http://www.linksame.com", name, callback)
                          
        }},
        { label: '退出', type: 'normal', icon:__dirname+'\\ioc\\loginout.png', role: 'close',click:function(){
              const dopt={
                type:'question',
                title:'你确定要退出吗？',
                buttons:['确定','取消'],
                defaultId:1,
                message:'退出后 会关闭收银系统。',
                //icon:'./ioc/ls.ico',
                noLink:true,
              }
              dialog.showMessageBox(dopt,function(e){
                 console.log('e:',e)
                 if(e==0){
                    app.quit();  
                 }else{
                    console.log('nat close')
                 }
                //   
              })
                    
        }},
{ label: '关闭计算机', type: 'normal', icon:__dirname+'\\ioc\\loginout.png', role: 'close',click:function(){
              const dopt={
                type:'question',
                title:'你确定要关闭收银系统吗？',
                buttons:['确定','取消'],
                defaultId:1,
                message:'执行此操作将会关闭电脑 你确定要关闭吗？',
                //icon:'./ioc/ls.ico',
                noLink:true,
              }
              dialog.showMessageBox(dopt,function(e){
                 console.log('e:',e)
                 if(e==0){
                    child_process.exec("shutdown /s /t 0")
                 }else{
                    console.log('nat close')
                 }
                //   
              })
                    
        }},

    ])
    tray.setToolTip(' 你的企业好帮手！')
    tray.setContextMenu(contextMenu)
}
// 禁用缓存
app.commandLine.appendSwitch("--disable-http-cache")
// 创建主窗口
app.on('ready', createWindow)


//监听 退出 
app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

//监听 关机 
app.on('window-shutdown', function() {
    if (process.platform !== 'darwin') {
       child_process.exec("shutdown /s /t 0")
    }
})

app.on('activate', function() {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow()
    }
})


//登录窗口最小化
ipcMain.on('window-min',function(){
  mainWindow.minimize();
})

//重新设置大小
ipcMain.on('window-reset',function(e,data){
  data=eval('(' + data + ')')
  //console.log(initobj.width, initobj.height)
  console.log('window-reset:',data ) 
  console.log('data typeof:',typeof(data),'e typeif: ',typeof(e))
  console.log('widht====:',data['width'])
if(data.method=='WH'){
  let hights=data['height']?data['height']:initobj.height
  let widths=data['width']?data['width']:initobj.width
  mainWindow.setSize(widths, hights)
  mainWindow.center()
}else if(data.method=='unmaximize'){
  
  mainWindow.setSize(initobj.width, initobj.height)
  mainWindow.center()
}else{
  mainWindow.center()
}
  
  //mainWindow.setSize(initobj.width, initobj.height)
  
 
})

//登录窗口最大化
ipcMain.on('window-max',function(data){

  console.log('data',data)

  if(mainWindow.isMaximized()){
      mainWindow.restore();  
  }else{
      mainWindow.maximize(); 
  }
})

ipcMain.on('window-close',function(){
  mainWindow.close();
})

// 检查登陆
ipcMain.on('islogin',function(){
           session.defaultSession.cookies.get({url:domain,name:'sns_username'}, function(error, cookies) {
                 let  domainObj=cookies                             
                 // console.log('ddd',domainObj[0].value)
                 mainWindow.webContents.send('islogin',domainObj)
           });
})
// 检查网络
ipcMain.on('testNetwork',function(){
           request(options, function (err, res, body) {
            if (err) {
              console.log(err)

            }else {
              console.log('testNetwork request 结果',body)
              mainWindow.webContents.send('testNetwork',body)
            }
          })
})
// 注销登陆
ipcMain.on('loginout',function(){
    session.defaultSession.cookies.get({url:domain}, function(error, cookies) {

                       let  domainObj=cookies
                       for (var i in domainObj){
                         console.log(i,':',domainObj[i])
                         session.defaultSession.cookies.remove(domain,domainObj[i].name, function(data) {
                                       console.log('remove',data);
                          });
                         
                       }
                       //console.log('ddd',domainObj)
      });
    //app.quit();
    //mainWindow.loadURL(loginpath)
})





// 消息通知 函数
function notifly(title,body,ico){
  const opt = {
      icon: ico,
      title: title,
      body: body,              
  }
  const m = new Notification(opt);
  m.show()
  
}

// 可点击事件的通知
function notiflyclick(title,body,callback){
   notify(title, { body: body }, () => {
                    console.log('The notification got clicked on!')
                    callback()
    })
}

//自动获取图标
function getico(path){
  let str = path.substring(path.lastIndexOf(".")+1);
  switch (str) {
    case 'doc':
      return __dirname+'\\ioc/format/doc.png';
      break;
    case 'docx':
      return __dirname+'\\ioc/format/doc.png';
      break;
    case 'xls':
      return __dirname+'\\ioc/format/excel.png';
      break;
    case 'xlsx':
      return __dirname+'\\ioc/format/excel.png';
      break;
    case 'csv':
      return __dirname+'\\ioc/format/excel.png';
      break;
    case 'exe':
      return __dirname+'\\ioc/format/exe.png';
      break;
    case 'html':
      return __dirname+'\\ioc/format/file_html.png';
      break;
    case 'htm':
      return __dirname+'\\ioc/format/file_html.png';
      break;
    case 'pptx':
      return __dirname+'\\ioc/format/ppt.png';
      break;
    case 'ppx':
      return __dirname+'\\ioc/format/ppt.png';
      break;
    case 'rar':
      return __dirname+'\\ioc/format/rar.png';
      break;
    case 'zip':
      return __dirname+'\\ioc/format/zip.png';
      break;
    case 'gz':
      return __dirname+'\\ioc/format/zip.png';
      break;
    case 'tar':
      return __dirname+'\\ioc/format/zip.png';
      break;
    case 'pdf':
      return __dirname+'\\ioc/format/pdf.png';
      break;    
     case 'png':
      return __dirname+'\\ioc/format/png.png';
      break;    
     case 'jpg':
      return __dirname+'\\ioc/format/jpg.png';
      break;    
     case 'gif':
      return __dirname+'\\ioc/format/gif.png';
      break;    
    default:
       return __dirname+'\\ioc/format/file.png';
      break;
  }
}
//================  升级 婴贝儿升级地址

autoUpdater.setFeedURL('http://www.linksame.com/yberelease80/');
// 检测更新，在你想要检查更新的时候执行，renderer事件触发后的操作自行编写
function updateHandle(){
    
    
    autoUpdater.on('error', function(error){
      sendUpdateMessage(message.error)
    });
    autoUpdater.on('checking-for-update', function(info) {
      console.log('checking for update:::',info)
      sendUpdateMessage(message.checking)
    });
    autoUpdater.on('update-available', function(info) {
        console.log('update-available:::',info)
        upwin.webContents.send('checkinfo', info)
        sendUpdateMessage(message.updateAva)
    });
    autoUpdater.on('update-not-available', function(info) {
        sendUpdateMessage(message.updateNotAva)
    });
    
    // 更新下载进度事件
    autoUpdater.on('download-progress', function(progressObj) {
        console.log('downloading:',progressObj)
        upwin.webContents.send('downloadProgress', progressObj)
    })
    autoUpdater.on('update-downloaded',  function (event, releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate) {
        ipcMain.on('isUpdateNow', (e, arg) => {
            //some code here to handle event
            autoUpdater.quitAndInstall();
        })
        console.log(releaseNotes, releaseName, releaseDate, updateUrl, quitAndUpdate)
        //upwin.webContents.send('isUpdateNow')
    });
    
    //执行自动更新检查
    //autoUpdater.checkForUpdates();
     ipcMain.on("checkForUpdate",()=>{
          //执行自动更新检查 appUpdater.autoDownload = false
          autoUpdater.checkForUpdates();
          //console.log('checkinfo:',checkinfo)
          
      })
     //执行下载
    ipcMain.on("download",()=>{
          autoUpdater.downloadUpdate()          
      })
     console.log('now check updateing ~~~~')
     // autoUpdater.checkForUpdates();

      //open upgroud dialog
      const modalPath = path.join('file://', __dirname, 'upgroud.html')
      //let win = new BrowserWindow({ width: 705, height: 250,resizable:false,autoHideMenuBar:true,type: 'desktop', icon: './ioc/download2.png' })
      let upwin = new BrowserWindow({ 
        width: 705, 
        height: 250,
        autoHideMenuBar:true,
        type: 'desktop', 
        icon: __dirname+'\\ioc\\upgrate2.png',
        resizable:false,
        maximizable:false,
         })
      //win.setApplicationMenu(null);
      upwin.on('close', function() { 
          
           upwin.webContents.send('close') 
           
           //ipcMain.removeAllListeners(["checkForUpdate", "download", "isUpdateNow"])
           upwin = null
           //ipcRenderer.removeAll(["checkForUpdate", "download", "isUpdateNow"]);
       })
      upwin.loadURL(modalPath)
      upwin.show()
}

// 通过main进程发送事件给renderer进程，提示更新信息
// mainWindow = new BrowserWindow()
function sendUpdateMessage(text){
    console.log('text:',text)
    //mainWindow.webContents.send('message', text)
}

// 第一次运行软件 判断网络
function initview(){
                      
}
// 自动随机检查升级包
function checkUp(){

     let checkinfo=autoUpdater.checkForUpdates();
     //console.log('checkinfo:',checkinfo)
     checkinfo.then(function(data){
        console.log('datav:::',data.versionInfo.version)
        console.log('datav2:::',data)
        if(data.versionInfo.version!=app.getVersion()){
            updateHandle();
            //const UpdateInfo=require('electron-updater').UpdateInfo
            //console.log('UpdateInfo:',)
        }
     })

}
//checkUp();
//随机时间执行检查升级
let randoms=Math.round(Math.random()*9+1)*6000;
console.log('randoms=',randoms)
setTimeout(function(){
  checkUp();
},randoms)
// hi i'm a vision 1.0.2 hahah


// 检查是否自动启动
ipcMain.on('getAutoStartValue', () => {
    startOnBoot.getAutoStartValue(exname, (error, result) => {
        if (error) {
            mainWindow.webContents.send('getAutoStartValue', false)
        } else {
            mainWindow.webContents.send('getAutoStartValue', true)
        }
    })
})


// 转码播放
ipcMain.on('playvideo', (e,param) => {
    console.log('rtsp',param);
    var stream = new Stream({
        name: 'name',
        // streamUrl: 'rtsp://admin:password@192.168.1.100/h264/ch1/av_stream',
        //streamUrl: 'rtsp://admin:abc12345@192.168.1.77:554/Streaming/Channels/101',
        streamUrl: param,
        wsPort: 9999,
        ffmpegOptions: { // options ffmpeg flags
        '-stats': '', // an option with no neccessary value uses a blank string
        '-rtsp_transport' : 'tcp',
        '-force_fps': 30 // options with required values specify the value after the key
      }
    });


     // console.log('playvideo',param);
     const modalPath = "http://localhost:9080/?rtsp_path=" + param;
     let upwin = new BrowserWindow
     ({
         width: 705,
         height: 650,
         // autoHideMenuBar:true,
         type: "desktop",
         // icon: __dirname+'\\ioc\\upgrate2.png',
         // resizable:false,
         maximizable: false
     });
     // win.setApplicationMenu(null);
     upwin.on("closed", function() {
         upwin = null;
         stream = null;
         console.log("closed",stream,upwin);
     });

     upwin.on("close", function() {
        upwin = null;
        stream = null;
        console.log("close",stream,upwin);
    });
     // and load the index.html of the app.
     upwin.loadURL(url.format({
        pathname: path.join(__dirname, 'player.html'),
        protocol: 'file:',
        slashes: true
    }))
     //upwin.loadURL(modalPath);
     upwin.show();
    
})

