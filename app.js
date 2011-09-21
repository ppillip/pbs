
    var net = require('net');
    var socket = net.createConnection(4001,"192.168.0.223");
    socket.setNoDelay(true);
    socket.on("connect",function(data){
        console.log("connected");

        /*1234 abcd*/
        var data1 = [0X10,0X02,0X03,0X00,0X1C,0X54,0X00,0X01,0X0F,0X57,0X00,0X00,0X80,0X80,0X14,0X3C,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0XC2,0XF7,0XBB,0XA9,0XBC,0XBC,0XBF,0XE4,0X10,0X03];

        /*차빼세요*/
        var data2 = [0X10,0X02,0X03,0X00,0X26,0X54,0X00,0X01,0X0F,0X57,0X00,0X00,0X01,0X01,0XC8,0X3C,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0X01,0X31,0X32
                    ,0X33,0X34,0X32,0X31,0X33,0X31,0X32,0X33,0X31,0X32,0X33,0X10,0X03];
        var buf1 = new Buffer(data1);

        socket.write( buf1,function(){
            console.log("전송완료");
        });
        
        socket.on("data",function(msg){


            console.log("==========================");
            console.log(msg);
            console.log("==========================");
            socket.end();
            socket.destroy();

        });


    });
