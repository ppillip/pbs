
var net = require('net');

var conCnt = 0;
var LF = "\r\n";

var server = net.createServer(function (socket) {

    socket.on("connect",function(){
        conCnt++;
        console.log(conCnt);
    });
    socket.on("close",function(){
        conCnt--;
        console.log("closed");
    });

    socket.on("data",function(data){
       console.log("reponse:"+data);
       if(data=="exit"+LF){
           socket.write("바이바이 꺼져라"+LF);
           socket.end();
       }else{
           socket.write(data);
       }
    })

});

server.listen(2000, "127.0.0.1");


function wait(msecs)
{
    var start = new Date().getTime();
    var cur = start
    while(cur - start < msecs)
    {
        cur = new Date().getTime();
    }
}
