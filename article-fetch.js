var pathlib = require("path"),
	spawn = require("child_process").spawn,
	fs = require("fs");

module.exports = articleFetch;

var tempDir = "F:",
	phscript = pathlib.join("C:", "APP", "bfserv", "bifocal.js");

function articleFetch(url, callback){
	var fname = genFName(),
		fpath = pathlib.join(tempDir, fname);
	
	console.log("Cmd: "+"phantomjs "+phscript+" "+url+" "+fpath);
	
	var cmd = spawn("phantomjs", [phscript, url, fpath]);
	
	cmd.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
    });
    
    cmd.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
    });
    
    cmd.on('exit', function (code) {
        console.log("Child exited with "+code);
        if(code){
            fs.unlink(fpath);
            return callback(new Error("Child exited with "+code));
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