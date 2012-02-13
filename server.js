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

// GEARMAN WORKER
var gearman = new Gearman("pangalink.net");
function startWorker(){
	gearman.registerWorker("article", function(payload, worker){
	    if(!payload){
	        worker.error();
	        return;
	    }
	    var url = (payload || "").toString().trim();
	    articleFetch(url, function(err, article){
	    	if(err){
	    		worker.error();
	    	}else{
	    		worker.end(article);
	    	}
	    });
	});
}