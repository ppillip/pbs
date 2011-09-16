
var sys = require('sys');
var net = require('net');
var client = new net.Socket();

client.connect(2000,"localhost");

console.log("@@@@ start @@@@");

client.write("hi",'utf8',function(data){
 console.log(data);
});



client.end();

console.log("@@@@ end @@@@");