const fs = require('fs');


function parseHTML(bod,np){
	var out = []
	var files = []
	for (var i = 0; i < np; i++){
		var d = "wikipedia/"+bod+"-p"+(i+1).toString(16)+"/";
		files = files.concat(fs.readdirSync(d).filter(x=>x.endsWith(".html")).map(x=>d+x))
	}
	var d = "wikipedia/"+bod+"-circa/";
	files = files.concat(fs.readdirSync(d).filter(x=>x.endsWith(".html")).map(x=>d+x))

	for (var i = 0; i < files.length; i++){
		var html = fs.readFileSync(files[i]).toString();
		html.replace(/<li><a href="(\/wiki\/%.*?)".*?>(.*?)<\/a>/g,function(x,y,z){
			if (z.includes("·")){
				return;
			}
			if (z.split("（")[0].length > 5){
				return;
			}

			var year = files[i].split(".")[0].split("/").pop()
			var name = z
			var link = y
			if (files[i].includes("circa")){
				year += "?"
			}
			out.push([year,link,name])
		})
	}
	return out
}

var births = parseHTML("born",12)
var deaths = parseHTML("died",6)

var people = {}
for (var i = 0; i < births.length; i++){
	people[births[i][2]] = {
		born:births[i][0],
		died:"?",
		link:births[i][1],
	}
}
for (var i = 0; i < deaths.length; i++){
	if (people[deaths[i][2]]){
		people[deaths[i][2]].died = deaths[i][0]
	}else{
		people[deaths[i][2]] = {
			born:"?",
			died:deaths[i][0],
			link:deaths[i][1],
		}
	}
}

var jstr = "{\n"
for (var k in people){
	if ((parseInt(people[k].born) < 1920 || people[k].born == "?") && (parseInt(people[k].died) < 2000 || people[k].died == "?")){
		jstr += `"${k}":${JSON.stringify(people[k])},\n`
	}
}
jstr = jstr.slice(0,-2) + "\n}"
fs.writeFileSync("ancient-people.json",jstr)

