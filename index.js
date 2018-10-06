'use strict';

var reg = /[\u4e00-\u9fa5]/g; // 中文区间
var fs = require('fs')
var join = require('path').join;
var iconv = require('iconv-lite'); // 文件编码转化工具

/**
 * 遍历路径底下所有文件，将其中的中文找出，生成一个.html模板，在vue模板项目中曲线救国。
 */
function ZhCharReader(path) {
  if (!path) {console.log('please enter the path');return}
  this.path = path
}

var reader = new ZhCharReader('../../src')
reader.finder()
// reader.filePathArr=reader.finder();
// let length = reader.filePathArr.length
// // 读取所有文件并去重生成一个txt文件beenUsedFonts.txt
// reader.filePathArr.forEach((item,index) => {
//   reader.readFile(item,index,length)
// })

ZhCharReader.prototype = {

  /**
   * 用户输入目录
   */
  path: '',

  /**
   * 从输入目录获取file对应的路径,并储存在这里，用于后面读取文件
   */
  filePathArr: [],

  /**
   * 项目中使用的中文字符
   */
  zhArr:[],

  /**
   * 递归得到该路径下所有文件
   * @param path 输入路径
   * @returns {Array}
   */
  finder:function() {
    var result=[];
    var path = this.path;
    console.log(path)
    var files=fs.readdirSync(path);
    files.forEach((val,index) => {
      var fPath=join(path,val);
      var stats=fs.statSync(fPath);
      if(stats.isDirectory()) this.finder(fPath);
      if(stats.isFile()) result.push(fPath);
    });
    return result
  },

  /**
   * 用于读取文件中的所有中文字符
   * @param {string} file 路径及文件名
   * @param {number} index 与length判断是最后一个时进行文件写入
   * @param {number} length 与index判断是最后一个时进行文件写入
   */
  readFile:function(file,index,length) {
    var that = this
    fs.readFile(file, function(err, data){
      if(err){
        console.log("读取文件fail " + err);
      }
      else{
        // 读取成功时
        // 输出字节数组
        // 把数组转换为中文
        var str = iconv.decode(data, 'utf-8');
        var regResult = str.match(reg);
        //输出前去重,包括当前文件去重及合并时去重
        zhArr = zhArr.concat(that.dedupe(regResult))
        zhArr = that.dedupe(zhArr)
        if (index === length - 1) {
          this.writeFile(zhArr)
        }
      }
    })
  },

  /**
   * Set函数进行数组去重
   */
  dedupe:function(array) {
    return Array.from(new Set(array));
  },

  /**
   * 用于写入文件
   */
  writeFile:function(arr) {
    let str = arr.join('')
    fs.writeFile("./beenUsedFonts.txt", str, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("The file was saved!");
    });
  }
}
