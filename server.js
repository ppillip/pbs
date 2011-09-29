var msgQueue = [function(){console.log("Hellow World~!!")}];

var t = setInterval(function(){
    if(msgQueue.length!=0){
        try{
            (msgQueue.pop())();
        }catch(err){
            console.log(err.message);
        }
    }else{
        fncCommon();
    }

},200);

var i = 0;
var x = setInterval(function(){
    i++;
    msgQueue.unshift(function(){console.log("\nhi man~!!!!["+i+"]")});
},1000);

function fncCommon(){
   var net = require('net');
   //var socket = net.createConnection(4001,"192.168.0.223");
   var socket = net.createConnection(2000);

   socket.setTimeout(2000,function(){
       socket.end();
       socket.destroy();
   });

   socket.on("error",function(err){
       console.log("에러 : "+err.message);
   });

   socket.on("connect",function(data){
       console.log("connected");


       /*commenMode 전문 날리기*/
       var data1 = [0x10,0x02,0x03,0x00,0x1C,0x54,0x00,0x01,0x0F,0x57];

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

           //전광판 변경
           fncSignPanel(msg,function(){});

           //전체 상태 업데이트 DB or Memory
           fncUpdateStatus(msg,function(){});

           //모니터링 쪽으로 전송
           fncSendToPMS(msg,function(){});


       });
   });

}

var fncSignPanel = function(msg,callback){
    //TODO : 전광판제어
    callback();
}

var fncUpdateStatus = function(msg,callback){
    //TODO : 상태 업데이트
    callback();
}

var fncSendToPMS = function(msg,callback){
    //TODO : PMS 쪽으로 데이터 전송
    callback();
}

