const fs = require('fs')

var html = fs.readFileSync("eraname.html").toString();

html.replace(/<TD[^>]*?>([^<TD>-]*?)<TD>(\d*?)<TD>.*?<TD>.*?月<TD>(.*?)年<TD>/g,function(_,name,span,start){
	console.log(start.replace("前","-")+'\t'+span+'\t'+name)
})