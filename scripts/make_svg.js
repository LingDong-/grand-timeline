const fs = require('fs')
var people = JSON.parse(fs.readFileSync("data/people-ancient-china.json").toString())
var trad_map = Object.fromEntries(fs.readFileSync("trad_map.txt").toString().split("\n").map(x=>x.split("\t")))
var lines = []
// console.log(Object.keys(people).join("\n"))
// process.exit()
function fits(line,y0,y1){
	for (var i = 0; i < line.length; i++){
		if (y1 > line[i][1] && y0 < line[i][2]){
			return false;
		}
	}
	return true;
}

var spans = []
for (var k in people){
	var y0 = parseInt(people[k].born)
	var y1 = parseInt(people[k].died)
	if (isNaN(y0)){
		y0 = y1 - 60;
	}
	if (isNaN(y1)){
		y1 = y0 + 60;
	}
	if (y1 - y0 == 0){
		console.log(k)
		y1 = y0+1
	}
	spans.push([k,y0,Math.max(y1,y0+25),y1])
}

spans.sort((a,b)=>(a[1]-b[1]))
// spans.sort((a,b)=>((b[2]-b[1])-(a[2]-a[1])))

for (var i = 0; i < spans.length; i++){
	var [k,y0,y1,y2] = spans[i];
	var ok = false;
	for (var j = 0; j < lines.length; j++){
		if (fits(lines[j],y0,y1)){
			lines[j].push([k,y0,y1,y2])
			ok = true;
			break;
		}
	}
	if (!ok){
		lines.push([[k,y0,y1,y2]])
	}
}
console.log(lines.length)

var w = 4;
var h = 10;
var svg = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="${3060*w}" height="${lines.length*h}" viewBox="${-1060*w} 0 ${3060*w} ${lines.length*h}">`
for (var i = 0; i < lines.length; i++){
	for (var j = 0; j < lines[i].length; j++){
		function fmt(a){
			return a.replace(/-0*/,'-').replace(/^0*/,'')
		}
		var [n,y0,y1,y2] = lines[i][j]
		var x = i;
		svg += `<rect x="${y0*w}" y="${x*h}" width="${(y2-y0)*w}" height="${h}" fill="gainsboro" stroke="black"></rect>`
		svg += `<text x="${y0*w}" y="${x*h+h*0.8}" font-size="${h*0.9}">${trad_map[n]} (${fmt(people[n].born)} ~ ${fmt(people[n].died)})</text>`
	}
}
svg += "</svg>"
fs.writeFileSync("test.svg",svg)

