var pathlib = require("path"),
	exec = require("child_process").exec,
	fs = require("fs");

module.exports = articleFetch;

var tempDir = "F:",
	phscript = pathlib.join("C:", "APP", "bfserv", "bifocal.js");

function articleFetch(url, callback){
	var fname = genFName(),
		fpath = pathlib.join(tempDir, fname);
	
	url = url.replace(/"/g,"\\\"");

	console.log("Cmd: "+"phantomjs "+phscript+" "+url+" "+fpath);
	exec("phantomjs "+phscript+" "+url+" "+fpath, function (err, stdout, stderr) {
            if(err){
                fs.unlink(fpath);
                return callback(err);
            }
            fs.readFile(fpath, function(err, data){
                fs.unlink(fpath);
                var article = {};
                try{
                	article = JSON.parse(decodeURIComponent(data.toString("utf-8").trim()));
                }catch(E){}
                
                callback(null, (article && article.article || "").toString().trim());
            });
        });
}

function genFName(){
    return genFName.seed+"-"+(genFName.counter++);
}
genFName.seed = "S"+Date.now();
genFName.counter = 0;