var msgQueue = [function(){console.log("Hellow World~!!")}];
var netMaster = require('net');
var netForServer = require('net');

/*DB설정*/
var Mongolian = require("mongolian");
var dbServer = new Mongolian; //TODO config 로 설정
var db = dbServer.db("pcc");
var lnc = db.collection("lnc");

var slaveTimeout = 300; //슬레이브 기다려주는 시간 더 걸리면 짤없음
var delay = 100;        //나머지 처리 시간을 감안해서 준다 (일종의 보정치)

var Queue = [];

//발사.
console.log("1. Fire!");

setDefaultQueue(function(){
    processQueue();
});


function setDefaultQueue(callback){
    console.log("3. setDefaultQueue()");
    getLNCList(function(LNC){

        for(var i=0;i<LNC.length;i++){

            Queue.unshift(
                {
                    'proc' : function(){
                        console.log("머가하고싶은데. " + LNC.pop());
                    }
                    ,'timeoutInterval' : 1000
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

    //큐에 있으면 일단 지운다.다
    var _obj=null;
    _obj = Queue.pop();
    if(_obj){
        console.log("큐사이즈." + Queue.length);
        _obj.proc();
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
