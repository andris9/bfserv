<a href="javascript: (function() {
    readConvertLinksToFootnotes = true;
    readStyle = 'style-newspaper';
    readSize = 'size-medium';
    readMargin = 'margin-medium';
    
    bifocalScript = document.createElement('SCRIPT');
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
})();">bifocal</a>