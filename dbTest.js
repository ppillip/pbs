var Mongolian = require("mongolian");
var server = new Mongolian;
//var server = new Mongolian("https://mongolab.com/api/1/databases?apiKey=4e2fa1de5e4cc8b7512977a6");

var db = server.db("pcc");
var lnc = db.collection("lnc");

lnc.insert({"name":"x"},function(err,post){
    console.log("##############"+err.message()+"#############");
});


