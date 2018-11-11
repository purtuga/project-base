const [ header, footer ] = `
;(function(
    window,
    document,
    location,
    setTimeout,
    setInterval,
    Date,
    String,
    Number,
    Array,
    Object,
    Function,
    atob,
    btoa,
    Math,
    JSON,
    TypeError,
    Error,
    encodeURIComponent,
    decodeURIComponent,
    requestAnimationFrame,
    CustomEvent,
    clearInterval,
    clearTimeout,
    console,
    
    undefined
){
    

//==============================================================

//-CODE-HERE

//==============================================================
}(
    window,
    document,
    location,
    setTimeout,
    setInterval,
    Date,
    String,
    Number,
    Array,
    Object,
    Function,
    atob,
    btoa,
    Math,
    JSON,
    TypeError,
    Error,
    encodeURIComponent,
    decodeURIComponent,
    requestAnimationFrame,
    CustomEvent,
    clearInterval,
    clearTimeout,
    console
    
    // undefined here..
));
`.split(/\/\/-CODE-HERE/);

exports.header = header;
exports.footer = footer;

