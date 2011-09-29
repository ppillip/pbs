    var net = require('net');
    var socket = net.createConnection(2000,"localhost");
    socket.setNoDelay(true);
    socket.on("connect",function(data){
        console.log("connected");

        /*1234 abcd*/
        var data1 = [0x10,0x02,0x03,0x00,0x1C,0x54,0x00,0x01,0x0F,0x57,0x00,0x00,0x80,0x80,0x14,0x3C,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0xC2,0xF7,0xBB,0xA9,0xBC,0xBC,0xBF,0xE4,0x10,0x03];

        /*차빼세요*/
        var data2 = [0x10,0x02,0x03,0x00,0x26,0x54,0x00,0x01,0x0F,0x57,0x00,0x00,0x01,0x01,0xC8,0x3C,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x01,0x31,0x32
                    ,0x33,0x34,0x32,0x31,0x33,0x31,0x32,0x33,0x31,0x32,0x33,0x10,0x03];
        var buf1 = new Buffer(data1);

        socket.write( buf1,function(){
            console.log("전송완료");
        });

        socket.setTimeout(300,function(){
            console.log("응답없으므로 종료");
            socket.end();
            socket.destroy();
        })

        socket.on("data",function(msg){


            console.log("==========================");
            console.log(msg);
            console.log("==========================");
            socket.end();
            socket.destroy();

        });


    });
