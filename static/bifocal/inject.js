(function() {
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
})();

function __PHANTOM_RESPONSE(){
    console.log("Response from Bifocal");
    
    var article = document.querySelector('#bifocal-content .page'),
        title =  document.querySelector('#readInner h1'),
        warning =  document.querySelector('#bifocal-warning'),
        response = {bifocal:true};
        
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
        var elements = element.querySelectorAll("*"),
            attr, href,
            removeList = [];
            
        for(var i=0, len = elements.length; i<len; i++){
            
            for(j = elements[i].attributes.length-1; j>=0; j--){
                attr = (elements[i].attributes.item(j).nodeName || "").toString();
                if(attr){
                    
                    // lingid
                    if(elements[i].tagName == "A" && attr.toLowerCase() == "href"){
                        href = (elements[i].href || "").toString().trim();
                        if(href.match(/^(javascript|about)\s*\:/)){
                            elements[i].href = "#";
                        }else if(href.match(/^https?\:\/\/[a-z\.\-]+\/teemalehed\//i)){
                            // delfi teemalehed
                            elements[i].removeAttribute(attr);
                        }
                    
                    // pildid
                    }else if(elements[i].tagName == "IMG"){
                        if(attr.toLowerCase() == "alt"){
                            // keep
                        }else if(attr.toLowerCase() == "src"){
                            if((elements[i].src || "").toString().trim().match(/^(javascript|about)\s*\:/)){
                                elements[i].removeAttribute(attr);
                            };
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
        
        // remove hidden elements
        for(var i = removeList.length - 1; i>=0; i--){
            try{
                removeList[i].parentNode.removeChild(removeList[i]);
            }catch(E){}
        }
    }
}
