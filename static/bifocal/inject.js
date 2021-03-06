console.log("Injected Main");

(function() {
    try{
        console.log("FINAL URL: " + window.location.href);
        
        console.log("Run Main script");
        
        readConvertLinksToFootnotes = false;
        readStyle = 'style-newspaper';
        readSize = 'size-medium';
        readMargin = 'margin-medium';
        
        bifocalScript = document.createElement('script');
        bifocalScript.type = 'text/javascript';
        bifocalScript.src = 'http://127.0.0.1:8080/bifocal/js/bifocal.js?x='+ (Math.random());
        document.getElementsByTagName('head')[0].appendChild(bifocalScript);
    
        bifocalCss = document.createElement('LINK');
        bifocalCss.rel = 'stylesheet';
        bifocalCss.href = 'http://127.0.0.1:8080/bifocal/css/bifocal.css';
        bifocalCss.type = 'text/css';
        bifocalCss.media = 'all';
        document.getElementsByTagName('head')[0].appendChild(bifocalCss);
    
        bifocalPrintCss = document.createElement('LINK');
        bifocalPrintCss.rel = 'stylesheet';
        bifocalPrintCss.href = 'http://127.0.0.1:8080/bifocal/css/bifocal-print.css';
        bifocalPrintCss.media = 'print';
        bifocalPrintCss.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(bifocalPrintCss);
    }catch(E){
        console.log("MAIN ERR: "+E.message);
    }
})();

function __PHANTOM_RESPONSE(){
    console.log("Response from Bifocal");
    
    var article = document.querySelector('#bifocal-content .page'),
        title =  document.querySelector('#readInner h1'),
        warning =  document.querySelector('#bifocal-warning'),
        response = {bifocal:true, url: window.location.href};
        
    if(!warning){
        
        if(article){
            sanitizeDOM(article);
            response.article = article.innerHTML.trim();
        }
        
        if(title){
            sanitizeDOM(title);
            response.title = title.innerHTML.trim();
        }
        
        
    }
    console.log(JSON.stringify(response));
    
    function sanitizeDOM(element){
        
        /*
        // should replace bold spans with strongs.... but does not :S
        var elements = Array.prototype.slice.call(element.querySelectorAll("span")),
            attr, href, style, fontWeight, elm;
        
        for(var i = elements.length - 1; i>=0; i--){
            if(elements[i].tagName == "SPAN"){
                style = window.getComputedStyle(elements[i]);
                
                fontWeight = (style.getPropertyValue("font-weight")).toString().toLowerCase();
                if(fontWeight == "bold" || fontWeight == "700"){
                    elm = document.createElement("strong");
                    elm.innerHTML = elements[i].innerHTML;
                    try{
                        elements[i].parentNode.insertBefore(elm, elements[i]);
                        elements[i].parentNode.removeChild(elements[i]);
                        elements[i] = elm;
                    }catch(E){}
                }
            }
        }
        */
        
        //remove script tags
        var elements = element.getElementsByTagName("script");
        for(var i=elements.length-1; i>=0; i--){
            try{
                elements[i].parentNode.removeChild(elements[i]);
            }catch(E){}
        }
        
        //remove style tags
        var elements = element.getElementsByTagName("style");
        for(var i=elements.length-1; i>=0; i--){
            try{
                elements[i].parentNode.removeChild(elements[i]);
            }catch(E){}
        }
        
        //remove meta tags
        var elements = element.getElementsByTagName("meta");
        for(var i=elements.length-1; i>=0; i--){
            try{
                elements[i].parentNode.removeChild(elements[i]);
            }catch(E){}
        }
        
        // sanitize nodes by removing all attributes except for href
        var elements = Array.prototype.slice.call(element.querySelectorAll("*")),
            attr, href,
            removeList = [];
            
        for(var i=0, len = elements.length; i<len; i++){
            
            for(j = elements[i].attributes.length-1; j>=0; j--){
                attr = (elements[i].attributes.item(j).nodeName || "").toString();
                if(attr){
                    
                    // lingid
                    if(elements[i].tagName == "A" && attr.toLowerCase() == "href"){
                        href = (elements[i].href || "").toString().trim();
                        if(href.match(/^(javascript|about)\s*\:/)){
                            elements[i].href = "#";
                        }else if(href.match(/^https?\:\/\/[a-z\.\-]+\/teemalehed\//i)){
                            // delfi teemalehed
                            elements[i].removeAttribute(attr);
                        }else{
                            elements[i].href = href;
                        }
                    
                    // pildid
                    }else if(elements[i].tagName == "IMG"){
                        if(attr.toLowerCase() == "alt"){
                            // keep
                        }else if(attr.toLowerCase() == "src"){
                            var src = (elements[i].src || "").toString().trim();
                            if(src.match(/^(javascript|about)\s*\:/)){
                                elements[i].removeAttribute(attr);
                            }else{
                                elements[i].src = src;
                            }
                        }else{
                            elements[i].removeAttribute(attr);
                        }
                    
                    // eemalda vaikimisi
                    }else{
                        elements[i].removeAttribute(attr);
                    }
                }
            }
        }
    }
}
