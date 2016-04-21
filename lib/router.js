/**
 * Created by sky on 16/4/10.
 * 路由注册
 */
var fs = require("fs");
var path = require("path");
var caller = require('caller');
var logger = require('log4js').getLogger();
module.exports = function (app, options) {

    var dir = options && options.dir || path.resolve(path.dirname(caller()), 'server/controller');
    var len = dir.length;

    var walk = function(dir){
        var dirList = fs.readdirSync(dir);
        dirList.forEach(function(item){
            var filePath = path.join(dir, item);
            if(fs.statSync(filePath).isDirectory()){
                walk(filePath);
            }else{
                var route = filePath.substring(len, filePath.length).replace('.js','');
                var arr = route.split('/');
                // 文件名和目录名相同,只访问目录即可
                if(arr.length>=2 && arr[arr.length-2] == arr[arr.length-1]){
                    arr.pop();
                    route = arr.join('/')
                }
                logger.info('route:' + route);
                app.use(route, require(filePath));
            }
        });
    };

    walk(dir);


    return function (req, res, next) {
        next();
    }
};