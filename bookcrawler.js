var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/', function(req, res ){

     //用法：http://localhost:8081/?isbn=12345

     var parameter = req.query.isbn;

     if (parameter == undefined ) {
         console.log("ERROR!");
         res.send("ERRROR!無參數!!<br />用法：http://localhost:8081/?isbn=");
         return false; 
     }

     console.log(parameter);
     var url = "http://ip/" + parameter;

     request(url, function(error, response, html){

         if(!error){
             var $ = cheerio.load(html);
             var title,imgurl;
             var json = { title:"",imgurl:""};

             //取書目圖片網址             
             $('img.itemcov').filter(function(){
                 var data = $(this);
                 imgurl = data.attr("data-original");
                 json.imgurl = imgurl;
             
             })
                //取書目資料網址
             $('a[rel=mid_image]').filter(function(){
                 var data = $(this);
                 title = data.attr("href");
                 json.title = title;
             })

         }

fs.writeFile( parameter + '.txt', JSON.stringify(json), function(err){  //回寫一個TXT檔

    console.log('File successfully written!');

})

res.send(JSON.stringify(json))


    }) ;
})


app.listen('8081')
console.log('listen at 8081');
exports = module.exports = app;  


