var static = require("node-static"),
	pathlib = require("path"),
	Gearman = require("node-gearman"),
	articleFetch = require("./article-fetch");

// STATIC SERVER
var file = new(static.Server)(pathlib.join(__dirname, 'static'));

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    });
}).listen(8080);

var counter = 0;

// GEARMAN WORKER
var gearman = new Gearman("pangalink.net");
gearman.registerWorker("article", function(payload, worker){
	console.log("Received JOB #"+(++counter));
    if(!payload){
        worker.error();
        return;
    }
    var url = (payload || "").toString().trim();
    console.log("URL: "+url);
    articleFetch(url, function(err, article){
    	if(err){
    		console.log("ERROR: "+err.message);
    		worker.error();
    	}else{
    		console.log("SUCCESS");
    		worker.end(article);
    	}
    });
});
