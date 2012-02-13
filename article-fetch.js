var pathlib = require("path"),
	exec = require("child_process").exec;

module.exports = articleFetch;

var tempDir = "F:",
	phscript = pathlib.join("C:", "APP", "bfserv", "bifocal.js");

function articleFetch(url, callback){
	var fname = genFName(),
		fpath = pathlib.join(tempDir, fname);
	
	url = url.replace(/"/g,"\\\"");

	exec("phantomjs "+phscript+" "+fpath, function (err, stdout, stderr) {
            if(err){
                fs.unlink(fpath);
                return callback(err);
            }
            fs.readFile(fpath, function(err, data){
                fs.unlink(fpath);
                var article = {};
                try{
                	article = JSON.parse(data.toString("utf-8").trim());
                }catch(E){}
                
                callback(null, (article && article.article || "").toString().trim());
            });
        }););
}

function genFName(){
    return genFName.seed+"-"+(genFName.counter++);
}
genFName.seed = "S"+Date.now();
genFName.counter = 0;