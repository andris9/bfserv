var static = require("node-static"),
	pathlib = require("path"),
	Gearman = require("node-gearman"),
	exec = require("child_process").exec;

var tempDir = "F:";

// STATIC SERVER
var file = new(static.Server)(pathlib.join(__dirname, 'static'));

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    });
}).listen(8080);

// GEARMAN WORKER

var gearman = new Gearman("pangalink.net");

gearman.registerWorker("article", function(payload, worker){
    if(!payload){
        worker.error();
        return;
    }
    var reversed = payload.toString("utf-8").split("").reverse().join("");
    worker.end(reversed);
});

function genFName(){
    return genFName.seed+"-"+(genFName.counter++);
}
genFName.seed = "S"+Date.now();
genFName.counter = 0;