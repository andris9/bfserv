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
            Log("Saving output to: " + (phantom.args[1] || "out.txt"));
            data.log = log;
            try{
                fs.write(phantom.args[1] || "out.txt", encodeURIComponent(JSON.stringify(data)), "w");
                Log("Success");
            }catch(E){Log(E.message)};
            phantom.exit();
        }
    }catch(E){}
    Log(msg);
};

page.onInitialized = function(status){
    //Log("initialized")
}

page.onLoadFinished = function(status){
    //Log("Load status: "+status)
}

page.onLoadFinished = function(){
    //Log("Load started")
}

page.onResourceRequested = function(r){
    //Log(JSON.stringify(r));
}

page.onResourceReceived = function(r){
    //Log(JSON.stringify(r));
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
            Log("Applying filter #"+(i+1));
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
    try{
        console.log("Filter 1");
        
        var list = document.querySelectorAll("font.articleBody");
        if(list && list.length > 1){
            list[1].innerHTML = "<p><strong>"+list[0].innerHTML+"</strong></p>"+list[1].innerHTML
        }
        try{
            list[0].parentNode.removeChild(list[0]);
        }catch(e){}
        
        var block = document.querySelector(".articlebody span.articlelead");
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
        
        var block = document.querySelector(".content .art-authors");
        if(block){
            try{
                block.parentNode.removeChild(block);
            }catch(E){}
        }
        
        var block = document.querySelector(".content .artImage");
        if(block){
            try{
                block.parentNode.removeChild(block);
            }catch(E){}
        }
        
        var block = document.querySelector(".content .articleSource");
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
    
    }catch(E){console.log("ERR1: "+E.message)}
});

// postimees
filters.push(function(){
    try{
       console.log("Filter 2");
     
        var sissejuhatus = document.querySelector("#artikli_sissejuhatus"),
            tykid, text;
        
        if(sissejuhatus){
            
            var p = sissejuhatus.querySelectorAll("p");
            for(var i=0, len = p.length; i<len; i++){
                p[i].innerHTML = "<strong>"+p[i].innerHTML+"</strong>";
            }
            
            text = sissejuhatus.innerHTML || "";
            
            try{
                sissejuhatus.parentNode.removeChild(sissejuhatus);
            }catch(e){
                return;
            }
            
            if((tykid =  document.querySelector(".artikkel_tykid"))){
                tykid.innerHTML = text + tykid.innerHTML;
            }
        }
    
    }catch(E){console.log("ERR2: "+E.message)}
});

// err
filters.push(function(){
    try{
        console.log("Filter 3");
        
        var block = document.querySelector(".space .biggerfont"),
            fs = block && block.firstChild;
    
        if(fs && fs.nodeName == "#text"){
            if((fs.nodeValue || "").toString().trim().match(/^[0-9\. :]+$/)){
                try{
                    fs.parentNode.removeChild(fs);
                }catch(E){}
            }
        }
        
        var block = document.querySelector(".box .content .time");
    
        if(block){
            try{
                block.parentNode.removeChild(block);
            }catch(E){}
        }

    }catch(E){console.log("ERR3: "+E.message)}
});

// ap3
filters.push(function(){
    try{
        console.log("Filter 4");
        
        var block = document.querySelector(".publicationpublished");
    
        if(block){
            try{
                block.parentNode.removeChild(block);
            }catch(E){}
        }

    }catch(E){console.log("ERR4: "+E.message)}
});

// õhtuleht
filters.push(function(){
    try{
        console.log("Filter 5");
     
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
    
        if((block = document.querySelectorAll("#article-content .banner"))){
            for(var i=block.length-1; i>=0; i--){
                try{
                    block[i].parentNode.removeChild(block[i]);
                }catch(E){}
            }
        }
    
    }catch(E){console.log("ERR5: "+E.message)}
});

// memokraat
filters.push(function(){
    try{
        console.log("Filter 6");
     
        var block = document.querySelector("#content #content-main .post h5");
    
        if(block){
            try{
                block.parentNode.removeChild(block);
            }catch(E){}
        }
        
        var block = document.querySelector(".sharedaddy");
    
        if(block){
            try{
                block.parentNode.removeChild(block);
            }catch(E){}
        }
    
    }catch(E){console.log("ERR6: "+E.message)}
});

// kes-kus
filters.push(function(){
    try{
       console.log("Filter 7");
     
        var sissejuhatus = document.querySelector("td.koht h5"),
            tykid, text;
        
        if(sissejuhatus){
            
            text = "<p>"+(sissejuhatus.innerHTML || "")+"</p>";
            
            try{
                sissejuhatus.parentNode.removeChild(sissejuhatus);
            }catch(e){
                return;
            }
            
            if((tykid =  document.querySelector("td.tekst"))){
                tykid.innerHTML = text + tykid.innerHTML;
            }
        }
    
    }catch(E){console.log("ERR7: "+E.message)}
});

// õpetajate leht
filters.push(function(){
    try{
        console.log("Filter 8");
     
        var block = document.querySelector(".full_artikel .h1_link_a");
    
        if(block){
            try{
                block.parentNode.removeChild(block);
            }catch(E){}
        }
    
        var block = document.querySelector(".full_artikel .komment_link_a");
    
        if(block){
            try{
                block.parentNode.removeChild(block);
            }catch(E){}
        }
    
    }catch(E){console.log("ERR8: "+E.message)}
});

// remove media
filters.push(function(){
    try{
        console.log("Filter 9");
        
        var block = document.querySelectorAll("video, embed, audio, object");
    
        for(var i = block.length-1; i>=0; i--){
            try{
                block[i].parentNode.removeChild(block[i]);
            }catch(E){}
        }
    }catch(E){console.log("ERR9: "+E.message)}
});

function Log(msg){
    log.push(msg);
    console.log(msg);
}
