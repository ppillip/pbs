var Mongolian = require("mongolian");
var server = new Mongolian("dbh56.mongolab.com:27567");

var db = server.db("pcc");

db.auth("ppillip", "dnflemf",function(){
    var lnc = db.collection("lnc");

    lnc.find({}).sort({ lncID : 1 }).toArray(function(err,array){
        array.forEach(function(dt){
            console.log(dt.lncID);
        });
    })
});

