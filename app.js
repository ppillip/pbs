setInterval(function(){

    var net = require('net');
    var client = new net.Socket();


    client.on("connect",function(){
        console.log("붙었다");
        client.write("hi",function(data){
            // TODO 처리구문
            console.log("return:"+data);
        });

        client.on("data",function(data){
            console.log("returned:["+data+"]");
            client.end();
        });

        client.on("disconnect",function(){
            console.log("끊겼다");
        })

    });
    client.connect(2000,"localhost");

},500);

process.addListener("SIGINT",function(){
    console.log("bye bye");
    process.exit(0);
});

