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
        console.log('stdout: ' + (data || "").toString().trim());
    });
    
    cmd.stderr.on('data', function (data) {
        console.log('stderr: ' + (data || "").toString().trim());
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
            
            callback(null, sanitizeHTML((article && article.article || "").toString().trim()));
        });
    });

}

function genFName(){
    return genFName.seed+"-"+(genFName.counter++);
}
genFName.seed = "S"+Date.now();
genFName.counter = 0;


function sanitizeHTML(html){
    html = html.trim().
        replace(/\r?\n|\r/g, "\u0000").
        replace(/<(div|p|ul|li|h1|h2|h3|h4|h5)>[\s\u0000]*(<br>[\s\u0000]*)*/g, "<$1>").
        replace(/(?:[\s\u0000]*<br>)*[\s\u0000]*<\/(div|p|ul|li|h1|h2|h3|h4|h5)>/g, "<$1>").
        replace(/<\!\-\-.*\-\->/g, ""). //comments
        replace(/<p>[\s\u0000]*(?=<p>)/g, ""). // empty P
        replace(/<([A-Za-z][^> ]*)[^>]*>[\s\u0000]*<\/([A-Za-z][^> ]*)[^>]*>/g,function(original, startTag, endTag){
            startTag = (startTag || "").toLowerCase();
            endTag = (endTag || "").toLowerCase();
            if(startTag == endTag){
                return "";
            }else{
                return original;
            }
        }). //empty nodes
        replace(/\u0000/g, "\n").
        trim();
    
    return html;
}