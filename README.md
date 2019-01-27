# lks-client
electron 打包的客户端

# 旧的打包方式
      electron-packager 打包
      //"build": "electron-packager . linksame --win --out ../linksamedist --arch=x64 --version=8.0.1 --icon=./ioc/ls.ico",

# 新打包方式
    electron-builder   或者 npm run build

>  electron-builder 打包 可以打包完整的安装包， 用npm run build 打包不能打包安装程序 和版本信息 ，原因未知
