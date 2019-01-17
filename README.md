# lks-client
electron 打包的客户端

# 旧的打包方式
      electron-packager 打包
      //"build": "electron-packager . linksame --win --out ../linksamedist --arch=x64 --version=8.0.1 --icon=./ioc/ls.ico",

# 新打包方式
    electron-builder   或者 npm run build

## 20190117 说明

   1 客户端中内置了flash 播放组件，但是要求打包完成后拷贝这个文件夹（./dll/）到打包后的 ”\resources”目录下；
   2 由于打包后找不到 ffmpeg.exe 文件 要求打包后 拷贝这个文件到打包后的根目录下 “dist\win-ia32-unpacked\”;

   拷贝地址 https://github.com/ranmufei/electron_flash_dll