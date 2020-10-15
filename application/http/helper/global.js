var global = (1,eval)("this"); 
global.pr = (data) => {
    if(process.SC.cancelR){
        process.SC.cancelR=false;
        return;
    }
    process.SC.app.res.writeHead(200, { "Content-Type": "text/html" });
    process.SC.app.res.end("<pre>"+JSON.stringify(data,null,4)+"</pre>");
    process.SC.cancelR=true;
};
