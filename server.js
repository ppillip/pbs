var msgQueue = [function(){console.log("Hellow World~!!")}];
var netMaster = require('net');
var netForServer = require('net');

/*DB설정*/
var Mongolian = require("mongolian");
var dbServer = new Mongolian; //TODO config 로 설정
var db = dbServer.db("pcc");
var lnc = db.collection("lnc");

var processTimeoutInterval = 2000;
var slaveTimeout = 300; //슬레이브 기다려주는 시간 더 걸리면 짤없음 하드웨어 랑합의 봄
var delay = 100;        //나머지 처리 시간을 감안해서 준다 (일종의 보정치)

var Queue = [];

//발사.
console.log("1. Fire!");

setDefaultQueue(function(){
    processQueue();
});


function setDefaultQueue(callback){
    console.log("========================== setDefaultQueue ===========================");
    getLNCList(function(LNC){

        for(var i=0;i<LNC.length;i++){

            Queue.unshift(
                {
                    'procType' : "slaveScan"
                    ,'proc' : function(callback2){

                        var lncId = LNC.pop();

                        var socket = netMaster.createConnection(2000); //var socket = net.createConnection(4001,"192.168.0.223");

                        socket.setTimeout(slaveTimeout ,function(){
                            socket.end();
                            socket.destroy();
                        });
                        socket.on("error",function(err){
                            socket.end();
                            socket.destroy();
                        });
                        
                        socket.on("connect",function(data){
                           /*commenMode 전문 날리기*/
                           //TODO 전문 정리하기
                           var data = [0x10,0x02,lncId,0x00,0x1C,0x54,0x00,0x01,0x0F,0x57];

                           var buf1 = new Buffer(data);

                           socket.write( buf1,function(){
                               console.log("---------------------- 1. 보내고 ----------------------");
                               console.log(buf1);
                           });

                           socket.on("data",function(data){
                               console.log(data);
                               console.log("---------------------- 2. 받고 ----------------------");
                               callback2(data);
                               socket.end();
                               socket.destroy();

                           });

                        });
                    }
                    ,'timeoutInterval' : processTimeoutInterval
                }
            );

        }
        callback();
    });
}


var x = null;

//무한루프.
function processQueue(){

    console.log("2. processQueue");

    //큐에 있으면 일단 지운다.
    var _obj=null;
    _obj = Queue.pop();
    if(_obj){
        switch(_obj.procType){
            case "slaveScan" :
                _obj.proc(function(data){
                    var buf = new Buffer(data);
                    console.log("======================slaveScan=================lnc : "+buf[2]);
                });
            break;

            case "webPush" :
                _obj.proc(function(param){
                    console.log(param.cmd);
                })
            break;

            default :
                console.log("Proc 형태를 알수가 없습니다.");
            break;
        }

       x = setTimeout(function(){processQueue();},_obj.timeoutInterval + 1);
       //console.log(typeof(_obj.timeoutInterval));
    }
    else
    {
        console.log("큐가비었네요.");
        setDefaultQueue(function(){
           x = setTimeout(function(){processQueue();},1000);
        });
    }

};

function getLNCList(callback){
    console.log("getLNCList()");

    var lncList = [];

    lnc.find({}).sort({ lncID : 1 }).toArray(function(err,array){
        array.forEach(function(dt){
            lncList.unshift(dt.lncID);
        });
        console.log(lncList.length + "개 준다");
        callback(lncList);
    })

};


//사용법 http://localhost:1337/?cmd=1234&data=hiall
var httpFromPMS = require('http');
httpFromPMS.createServer(function (req, res) {

    var obj = require('url').parse(req.url, true);

    //어케리턴하지?
    Queue.unshift(
        {
            'procType':'webPush'
            ,'proc' : function(callback){
                console.log(obj.query.cmd + "=====================" + obj.query.data);

                res.writeHead(200, {'Content-Type': 'text/plain'});
                res.end("11111111111111111111111111");

                callback(obj.query);
            }
            ,'timeoutInterval' : 1000
        }
    );




//  fncCmdFromPMS(obj.query,function(data){
//      res.writeHead(200, {'Content-Type': 'text/plain'});
//      res.end(data);
//  });
}).listen(1337, "127.0.0.1");
console.log('Server running at http://127.0.0.1:1337/');