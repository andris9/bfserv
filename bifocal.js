var page = new WebPage();

var fs = require("fs");

var log = [];

if (phantom.args.length === 0) {
    phantom.exit(1);
}

// USAGE: bifocal.js URL OUTPUT.TXT

page.settings.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:8.0.1) Gecko/20100101 Firefox/8.0.1';
//page.settings.javascriptEnabled = false;
page.settings.loadImages = false; 
//page.settings.loadPlugins = false;

page.onConsoleMessage = function(msg) {
    try{
        var data = JSON.parse(msg);
        if(data.bifocal){
            Log("Saving output to: " + (phantom.args[1] || "out.txt"));
            data.log = log;
            try{
                fs.write(phantom.args[1] || "out.txt", encodeURIComponent(JSON.stringify(data)), "w");
                console.log("Success");
            }catch(E){console.log(E.message)};
            phantom.exit();
        }
    }catch(E){}
    console.log(msg);
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
            Log("Aplying filter #"+(i+1));
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
        list[1].innerHTML = "<p><strong>"+list[0].innerHTML+"</strong></p>"+list[1].innerHTML
    }
    try{
        list[0].parentNode.removeChild(list[0]);
    }catch(e){}
    
    var block = document.querySelector(".articlebody .articlelead");
    if(block){
        try{
            var elm = document.createElement("p");
            elm.innerHTML = "<strong>"+block.innerHTML+"</strong>";
            
            block.parentNode.insertBefore(elm, block);
            block.parentNode.removeChild(block);
        }catch(E){}
    }
    
    var block = document.querySelector(".articlebody .paidcontent");
    if(block){
        try{
            block.parentNode.removeChild(block);
        }catch(E){}
    }
    
    var block = document.querySelector(".articlebody_holder .articleimage");
    if(block){
        try{
            block.parentNode.removeChild(block);
        }catch(E){}
    }
});

// postimees
filters.push(function(){
    var sissejuhatus = document.querySelector("#artikli_sissejuhatus"),
        tykid, text;
    
    if(sissejuhatus){
        
        var p = sissejuhatus.querySelectorAll("p");
        for(var i=0, len = p.length; i<len; i++){
            p[i].innerHTML = "<strong>"+p[i].innerHTML+"</strong>";
        }
        
        text = sissejuhatus.innerHTML || "";
        
        try{
            sissejuhatus.parentNode.removeChild(sissejuhatus);
        }catch(e){
            return;
        }
        
        if((tykid =  document.querySelector(".artikkel_tykid"))){
            tykid.innerHTML = text + tykid.innerHTML;
        }
    }
    
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

// ap3
filters.push(function(){
    var block = document.querySelector(".publicationpublished");

    if(block){
        try{
            block.parentNode.removeChild(block);
        }catch(E){}
    }

});

// õhtuleht
filters.push(function(){
    var block;
    
    if((block = document.querySelector("#article-info.cfx"))){
        try{
            block.parentNode.removeChild(block);
        }catch(E){}
    }

    if((block = document.querySelector("#article-content #gallery"))){
        try{
            block.parentNode.removeChild(block);
        }catch(E){}
    }

    /*
    if((block = document.querySelector("#article-content .gallery-action-bar"))){
        try{
            block.parentNode.removeChild(block);
        }catch(E){}
    }
    
    if((block = document.querySelector("#article-content #gallery-slideshow-container"))){
        try{
            block.parentNode.removeChild(block);
        }catch(E){}
    }
    */
    
    if((block = document.querySelectorAll("#article-content .banner"))){
        for(var i=block.length-1; i>=0; i--){
            try{
                block[i].parentNode.removeChild(block[i]);
            }catch(E){}
        }
    }
});

// memokraat
filters.push(function(){
    var block = document.querySelector("#content #content-main .post h5");

    if(block){
        try{
            block.parentNode.removeChild(block);
        }catch(E){}
    }

});

// remove hidden
filters.push(function(){
    var block = document.querySelector("#content #content-main .post h5");

    if(block){
        try{
            block.parentNode.removeChild(block);
        }catch(E){}
    }

});

function Log(msg){
    log.push(msg);
    console.log(msg);
}
