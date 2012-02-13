var page = new WebPage();

var fs = require("fs");

var log = [];

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
            Log("Saving output to: " + (phantom.args[1] || "out.txt"));
            data.log = log;
            fs.write(phantom.args[1] || "out.txt", JSON.stringify(data), "w");
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

var filters = [];

Log("Opening "+phantom.args[0]+" ...");
page.open(phantom.args[0], function (status) {
    if (status !== "success") {
        Log("ERROR: Network");
        phantom.exit(2);
    } else {
        Log("Page opened");

        for(var i=0, len=filters.length; i<len; i++){
            Log("Apllying filter #"+(i+1));
            page.evaluate(filters[i]);
        }
        
        Log("Injecting main script");
        page.includeJs("http://127.0.0.1:8080/bifocal/inject.js", function() {
            window.setTimeout(function () {
                phantom.exit(3);
            }, 10000);
        });
         
    }

});

// delfi
filters.push(function(){
    var list = document.querySelectorAll("font.articleBody");
    if(list && list.length>1){
        list[1].innerHTML = "<p>"+list[0].innerHTML+"</p>"+list[1].innerHTML
    }
    try{
        list[0].parentNode.removeChild(list[0]);
    }catch(e){}
});

// err
filters.push(function(){
    var block = document.querySelector(".space .biggerfont"),
        fs = block && block.firstChild;

    if(fs && fs.nodeName == "#text"){
        if((fs.nodeValue || "").toString().trim().match(/^[0-9\. :]+$/)){
            try{
                fs.parentNode.removeChild(fs);
            }catch(E){}
        }
    }

});

function Log(msg){
    log.push(msg);
    console.log(msg);
}
