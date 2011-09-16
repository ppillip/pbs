var net = require('net');
var sys = require('sys');

var conCnt = 0;
var LF = "\r\n";

var server = net.createServer(function (socket) {

    socket.on("connect",function(){
        conCnt++;
        socket.write("hello"+LF);
        sys.print(LF+conCnt);
    });

    socket.on("data",function(data){
        sys.print(LF+data);
       if(data=="exit"+LF){
           socket.write("바이바이 꺼져라"+LF);
           socket.end();
       }else{
           socket.write(data);
       }
    })

});

server.listen(2000, "127.0.0.1");