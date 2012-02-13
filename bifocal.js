var page = new WebPage();

var fs = require("fs");

if (phantom.args.length === 0) {
    phantom.exit(1);
}

// USAGE: bifocal.js URL OUTPUT.TXT

page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:8.0.1) Gecko/20100101 Firefox/8.0.1';
//page.settings.javascriptEnabled = false;
//page.settings.loadImages = false; 
//page.settings.loadPlugins = false;

page.onConsoleMessage = function(msg) {
    try{
        var data = JSON.parse(msg);
        if(data.bifocal){
            console.log("Saving output to: " + (phantom.args[1] || "out.txt"));
            fs.write(phantom.args[1] || "out.txt", (msg || "").toString(), "w");
            console.log("SUCCESS");
            phantom.exit();
        }
    }catch(E){}
};

page.onInitialized = function(status){
    //console.log("initialized")
}

page.onLoadFinished = function(status){
    //console.log("Load status: "+status)
}

page.onLoadFinished = function(){
    //console.log("Load started")
}

page.onResourceRequested = function(r){
    //console.log(JSON.stringify(r));
}

page.onResourceReceived = function(r){
    //console.log(JSON.stringify(r));
}

console.log("Opening "+phantom.args[0]+" ...");
page.open(phantom.args[0], function (status) {
    if (status !== "success") {
        console.log("ERROR: Network");
        phantom.exit(2);
    } else {
        console.log("Page opened");

        console.log("Evaluating script 1");
        page.evaluate(function () {
            // delfi
            var list = document.querySelectorAll("font.articleBody");
            if(list && list.length>1){
                list[1].innerHTML = "<p>"+list[0].innerHTML+"</p>"+list[1].innerHTML
            }
            try{
                list[0].parentNode.removeChild(list[0]);
            }catch(e){}
        });
        
        console.log("Injecting script 2");
        page.includeJs("http://127.0.0.1:8080/bifocal/inject.js", function() {
            window.setTimeout(function () {
                phantom.exit(3);
            }, 10000);
        });
         
    }

});