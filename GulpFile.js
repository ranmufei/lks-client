const gulp = require('gulp');
const fs = require("fs")
const platform = 'win32';
const arch = 'x64';
const appPath = './';
const packageOutPath = '../linksamedist';
const iconPath = 'ioc/ls.ico';

const outName = 'linksame-win32-' + arch;
const installerOutPath = '../linksamedist/installer'; // 安装文件生成路劲
var packagePath = `${packageOutPath}/${outName}`;
var installerPath = `${installerOutPath}/${outName}`;
const gifPath='ioc/loading.gif'

gulp.task('generate-package', () => {
    generatePackage();
});

gulp.task('generate-installer', () => {
    isDirExist(packagePath, (exist) => {
        if (exist) {
            generateInstaller();
        } else {
            generatePackage(() => {
                generateInstaller();
            });
        }
    });
});

function isDirExist(path, callback) {
    fs.readdir(path, (err) => {
        callback && callback(!err);
    });
}

function generatePackage(callback) {
    const packager = require('electron-packager')
    packager({
        dir: appPath,
        platform: platform,
        arch: arch,
        out: packageOutPath,
        icon: iconPath,
        /*桌面快捷方式名称以及开始菜单文件夹名称*/
        'version-string': {
            CompanyName: '邻盛智能设备有限公司',
            ProductName: '邻盛企业管家'
        }
    }, function (err) {
        if (err) {
            console.log(err);
        } else {
            callback && callback();
        }
    });
}


function generateInstaller() {
    const electronInstaller = require('electron-winstaller');
    electronInstaller.createWindowsInstaller({
        appDirectory: packagePath,
        outputDirectory: installerPath,
        loadingGif: gifPath,
        authors: '冉慕飞',
        //exe: 'linksame.exe',
        title: '邻盛企业管家安装包',
        iconUrl: `${__dirname}/${iconPath}`,
        setupIcon: iconPath,
        setupExe: 'Setup.exe',
        noMsi: true
    }).then(() => console.log("It worked!"), (e) => console.log(`No dice: ${e.message}`));
}

