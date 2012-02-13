(function() {
    readConvertLinksToFootnotes = false;
    readStyle = 'style-newspaper';
    readSize = 'size-medium';
    readMargin = 'margin-medium';
    
    bifocalScript = document.createElement('script');
    bifocalScript.type = 'text/javascript';
    bifocalScript.src = 'http://tahvel.info/bifocal/js/bifocal.js?x='+ (Math.random());
    document.getElementsByTagName('head')[0].appendChild(bifocalScript);
    
    bifocalCss = document.createElement('LINK');
    bifocalCss.rel = 'stylesheet';
    bifocalCss.href = 'http://tahvel.info/bifocal/css/bifocal.css';
    bifocalCss.type = 'text/css';
    bifocalCss.media = 'all';
    document.getElementsByTagName('head')[0].appendChild(bifocalCss);
    
    bifocalPrintCss = document.createElement('LINK');
    bifocalPrintCss.rel = 'stylesheet';
    bifocalPrintCss.href = 'http://tahvel.info/bifocal/css/bifocal-print.css';
    bifocalPrintCss.media = 'print';
    bifocalPrintCss.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(bifocalPrintCss);
})();

function __PHANTOM_RESPONSE(){
    var article = document.querySelector('#bifocal-content .page'),
        title =  document.querySelector('#readInner h1'),
        warning =  document.querySelector('#bifocal-warning'),
        response = {bifocal:true};
        
    if(!warning){
        
        if(article){
            
            //remove script tags
            var elements = article.getElementsByTagName("script");
            for(var i=elements.length-1; i>=0; i--){
                try{
                    elements[i].parentNode.removeChild(elements[i]);
                }catch(E){}
            }
            
            //remove style tags
            var elements = article.getElementsByTagName("style");
            for(var i=elements.length-1; i>=0; i--){
                try{
                    elements[i].parentNode.removeChild(elements[i]);
                }catch(E){}
            }
            
            //remove meta tags
            var elements = article.getElementsByTagName("meta");
            for(var i=elements.length-1; i>=0; i--){
                try{
                    elements[i].parentNode.removeChild(elements[i]);
                }catch(E){}
            }
            
            // sanitize nodes by removing all attributes except for href
            var elements = article.getElementsByTagName("*"),
                attr;
                
            for(var i=0, len = elements.length; i<len; i++){
                for(j = elements[i].attributes.length-1; j>=0; j--){
                    attr = (elements[i].attributes.item(j).nodeName || "").toString();
                    if(attr){
                        if(elements[i].tagName == "A" && attr.toLowerCase() == "href"){
                            if((elements[i].href || "").toString().trim().match(/^(javascript|about)\s*\:/)){
                                elements[i].href = "#";
                            }
                        }else{
                            elements[i].removeAttribute(attr);
                        }
                    }
                }
            }
        
            response.article = article.innerHTML.trim();
        }
        
        if(title){
            
            //remove script tags
            var elements = title.getElementsByTagName("script");
            for(var i=elements.length-1; i>=0; i--){
                try{
                    elements[i].parentNode.removeChild(elements[i]);
                }catch(E){}
            }
            
            //remove style tags
            var elements = title.getElementsByTagName("style");
            for(var i=elements.length-1; i>=0; i--){
                try{
                    elements[i].parentNode.removeChild(elements[i]);
                }catch(E){}
            }
            
            //remove meta tags
            var elements = title.getElementsByTagName("meta");
            for(var i=elements.length-1; i>=0; i--){
                try{
                    elements[i].parentNode.removeChild(elements[i]);
                }catch(E){}
            }
            
            // sanitize nodes by removing all attributes except for href
            var elements = title.getElementsByTagName("*"),
                attr;
                
            for(var i=0, len = elements.length; i<len; i++){
                for(j = elements[i].attributes.length-1; j>=0; j--){
                    attr = (elements[i].attributes.item(j).nodeName || "").toString();
                    if(attr){
                        if(elements[i].tagName == "A" && attr.toLowerCase() == "href"){
                            if((elements[i].href || "").toString().trim().match(/^(javascript|about)\s*\:/)){
                                elements[i].href = "#";
                            }
                        }else{
                            elements[i].removeAttribute(attr);
                        }
                    }
                }
            }
            
            response.title = title.innerHTML.trim();
        }
        
        
    }
    console.log(JSON.stringify(response));
}

