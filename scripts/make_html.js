const fs = require('fs')
var people = JSON.parse(fs.readFileSync("../data/people-ancient-china.json").toString())
if (!Object.fromEntries){Object.fromEntries=(x)=>{var b = {};x.map(a=>b[a[0]]=a[1]);return b}}
var trad_map = Object.fromEntries(fs.readFileSync("../data/trad_map.txt").toString().split("\n").map(x=>x.split("\t")))
var dynasties = fs.readFileSync("../data/dynasty.tsv").toString().split("\n").map(x=>x.split("\t"))
var eras = fs.readFileSync("../data/era.tsv").toString().split("\n").map(x=>x.split("\t"))
var SC2TC = Object.fromEntries(Object.entries(JSON.parse(fs.readFileSync("../data/TC2SC.json").toString())).map(x=>[x[1],x[0]]))
delete SC2TC["于"]

// console.log(SC2TC)
var lines = []

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
		y0 = y1 - 50;
	}
	if (isNaN(y1)){
		y1 = y0 + 50;
	}
	if (y1 < y0){
		if (people[k].born.includes("?")){
			y0 -= 10;
		}else{
			y1 += 10;
		}
	}
	if (y1 - y0 == 0){
		// console.log(k)
		y1 = y0+1
	}
	spans.push([k,y0,Math.max(y1,y0+30),y1])
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


function drawInfo(ctx,W,H,c0,c1,r0,r1,mouseX,mouseY){
	var w = W/(c1-c0);
	var h = (H-HH)/(r1-r0);

	var sel;
	for (var i = 0; i < lines.length; i++){
		var x = i;
		if (x+1 < r0-HH || x > r1){
			continue;
		}
		for (var j = 0; j < lines[i].length; j++){

			var [n,y0,y1,y2] = lines[i][j]
			if (y1+1 < c0 || y0 > c1){
				continue;
			}

			if ((y0-c0)*w < mouseX && mouseX < (y0-c0)*w+(y2-y0)*w && (x-r0)*h+HH < mouseY && mouseY < (x-r0)*h+HH+h){
				sel = n;

				break;
			}
		}
		if (sel){
			break;
		}
	}
	if (sel){
		var fo = 15;


		ctx.fillStyle="rgba(255,255,255,0.8)";
		ctx.fillRect(0,H-200,200,200);

		ctx.strokeStyle="black";
		ctx.strokeRect(0,H-200,200,200);

		ctx.font = fo+"px sans-serif";
		ctx.fillStyle = "black";
		var t = people[sel].summary;
		var r = 0;
		var c = 0;
		if (t.length > 12*11){
			t = t.slice(0,12*11-3)+"..."
		}
		for (var i = 0; i < t.length; i++){
			ctx.fillText(t[i],c*fo+10,r*fo+fo+10+H-200);
			c ++;
			if (c >=12){
				c = 0;
				r ++;
			}
			if (r >= 11){
				break;
			}
		}
		ctx.font = fo*0.8+"px sans-serif";
		ctx.fillText("按 W 鍵前往維基百科",10,H-10);
		
	}
	return sel;
}

function render(ctx,W,H,c0,c1,r0,r1,hl){
	if (W != ctx.canvas.width){
		ctx.canvas.width=W;
	}
	if (H != ctx.canvas.height){
		ctx.canvas.height=H;
	}
	ctx.fillStyle="darkgray"
	ctx.fillRect(0,0,W,H);
	var w = W/(c1-c0);
	var h = (H-HH)/(r1-r0);

	function fmt(a){
		return a.replace(/-0*/,'-').replace(/^0*/,'')
	}


	for (var i = 0; i < lines.length; i++){
		var x = i;
		if (x+1 < r0-HH || x > r1){
			continue;
		}
		for (var j = 0; j < lines[i].length; j++){

			var [n,y0,y1,y2] = lines[i][j]
			if (y1+1 < c0 || y0 > c1){
				continue;
			}
			
			var t = "";
			if (h > 8){
				t = `${trad_map[n]} (${fmt(people[n].born)} ~ ${fmt(people[n].died)})`	
				ctx.fillStyle="whitesmoke"
				if (hl == n){
					ctx.fillStyle="yellow"
				}
				ctx.fillRect((y0-c0)*w,(x-r0)*h+HH,(y2-y0)*w,h);
				
			}


			ctx.strokeStyle="black"
			ctx.strokeRect((y0-c0)*w,(x-r0)*h+HH,(y2-y0)*w,h)
	

			if (t.length){
				ctx.fillStyle="black"
				var fo =  Math.round(Math.min(h*0.9,24));
				ctx.font = fo+"px sans-serif";
				ctx.fillText(t,(y0-c0)*w,(x-r0)*h+h*0.4+fo/2+HH);
			}
		}
	}

	for (var i = 0; i < eras.length; i++){
		var [y0,s,t] = eras[i]
		y0 = parseInt(y0)
		s = parseInt(s)
		var y1 = y0+s;
		y2 = y1

		if (y1+1 < c0 || y0 > c1){
			continue;
		}
	
		ctx.fillStyle="rgba(255,255,255,0.5)"
		ctx.fillRect((y0-c0)*w,HH/2,(y2-y0)*w,HH/2);
		
		ctx.strokeStyle="black"
		ctx.strokeRect((y0-c0)*w,HH/2,(y2-y0)*w,HH/2)
		ctx.fillStyle="black"

		var fo = HH/8;
		ctx.font = fo+"px sans-serif";
		for (var j = 0; j < t.length; j++){
			ctx.fillText(t[j],(y0-c0)*w,HH/2+fo+j*fo);
		}
	}

	for (var i = 0; i < dynasties.length; i++){
		var [t,y0] = dynasties[i]
		y0 = parseInt(y0)
		var y1 = parseInt((dynasties[i+1] || [0,2000])[1])
		y2 = y1

		if (y1+1 < c0 || y0 > c1){
			continue;
		}
	
		ctx.fillStyle="rgba(255,255,255,0.5)"
		ctx.fillRect((y0-c0)*w,0,(y2-y0)*w,HH/2);
		
		ctx.strokeStyle="black"
		ctx.strokeRect((y0-c0)*w,0,(y2-y0)*w,HH/2)
		ctx.fillStyle="black"

		var fo = HH/4;
		ctx.font = fo+"px sans-serif";

		ctx.fillText(t,Math.max(0,(y0-c0)*w),fo);
		
	}

	for (var i = Math.floor(c0/50)*50; i < Math.floor(c1/50)*50+50; i+= 50){
		var fo = HH/8;
		ctx.font = fo+"px sans-serif";
		ctx.fillStyle="black"//"#1668E3";
		ctx.fillText(i,(i-c0)*w,HH/2-5);

		ctx.fillRect((i-c0)*w,HH/2,1,H);

	}

	ctx.fillStyle="rgba(255,255,255,0.8)"
	ctx.fillRect(W-390,H-22,390,22)
	ctx.strokeStyle="black"
	ctx.strokeRect(W-390,H-22,390,22)

	ctx.fillStyle="black"
	ctx.font = 12+"px sans-serif";
	ctx.fillText("鼠標拖拽以瀏覽，滾輪以縮放，按 P 鍵以檢索人名，H 鍵以查看說明",W-375,H-7);
	return;
}

function main(){
	var w = 2;
	var h = 12;
	var c0 = -1050
	var c1 = c0 + window.innerWidth/w;
	var r0 = 0;
	var r1 = r0 + window.innerHeight/h;
	var canv = document.createElement("canvas");
	var ctx = canv.getContext('2d');
	canv.width = window.innerWidth;
	canv.height = window.innerHeight;
	canv.style.padding="0px";
	canv.style.margin="0px";
	canv.style.position = "absolute";
	canv.style.left = "0px";
	canv.style.top="0px";
	document.body.appendChild(canv);
	var rcache;
	var sel;

	render(ctx,window.innerWidth,window.innerHeight,c0,c1,r0,r1);
	cacheR();

	window.mouseX = -1;
	window.mouseY = -1;
	window.hasMouse = false;
	window.mouseIsDown = false;
	function mousedown(event){
		hasMouse = true;
		mouseX = event.pageX;
		mouseY = event.pageY;
		mouseIsDown = true;
		event.preventDefault();
	}
	function bound(){
		var ww = c1-c0;
		var hh = r1-r0;

		r0 = Math.max(0,r0)
		r1 = r0 + hh;
		c0 = Math.max(-1070,c0);
		c1 = c0 + ww;
		r1 = Math.min(lines.length,r1);
		r0 = r1 - hh;
		c1 = Math.min(2020,c1);
		c0 = c1 - ww;
	}
	function cacheR(){
		rcache = ctx.getImageData(0,0,window.innerWidth,window.innerHeight);
	}
	function mousemove(event){
		hasMouse = true;
		if (mouseIsDown){

			var _w = window.innerWidth/(c1-c0);
			var _h = window.innerHeight/(r1-r0);
			var dx = event.pageX - mouseX;
			var dy = event.pageY - mouseY;

			c0 -= dx/_w*2;
			c1 -= dx/_w*2;
			r0 -= dy/_h*5;
			r1 -= dy/_h*5;

			bound()

			render(ctx,window.innerWidth,window.innerHeight,c0,c1,r0,r1);
			cacheR();
		}
		mouseX = event.pageX;
		mouseY = event.pageY;

		if (rcache){
			ctx.putImageData(rcache,0,0);
		}
		sel = drawInfo(ctx,window.innerWidth,window.innerHeight,c0,c1,r0,r1,mouseX,mouseY)

		event.preventDefault();


	}
	function mouseup(event){
		mouseIsDown = false;
		event.preventDefault();
	}
	function getMouseCoord(){

		var _w = window.innerWidth/(c1-c0);
		var _h = (window.innerHeight-HH)/(r1-r0);

		var c = mouseX/_w+c0;
		var r = (mouseY-HH)/_h+r0;

		return [c,r]
	}
	function onscroll(event){
		if (!hasMouse){
			return;
		}
		var [__c0,__c1,__r0,__r1] = [c0,c1,r0,r1]
		var dy = event.deltaY;

		var asp = (r1-r0)/(c1-c0)

		var [c,r] = getMouseCoord();

		var _0 = mouseX/window.innerWidth;
		var _1 = (mouseY-HH)/(window.innerHeight-HH);

		var _c0 = c - 1*_0;
		var _c1 = c + 1*(1-_0)
		var _r0 = r - (1*_1) * asp;
		var _r1 = r + (1*_1) * asp;
		var t = -dy*0.1;


		c0 = _c0 * t + c0 * (1-t);
		c1 = _c1 * t + c1 * (1-t);
		r0 = _r0 * t + r0 * (1-t);
		r1 = _r1 * t + r1 * (1-t);


		bound();

		if (c1 - c0 < 100 || c1-c0 > 3000){
			[c0,c1,r0,r1] = [__c0,__c1,__r0,__r1]
			return;
		}

		render(ctx,window.innerWidth,window.innerHeight,c0,c1,r0,r1);
		cacheR();
		event.preventDefault();
	}
	function onkey(event){
		if (event.key == "w" || event.key == "W"){
			if (sel){
				window.open("https://zh.wikipedia.org"+people[sel].link);
			}
		}
		if (event.key == "h" || event.key == "H"){
			window.open("https://github.com/LingDong-/grand-timeline");
		}
		if (event.key == "p" || event.key == "P"){
			var s = prompt("人名檢索：");
			if (!s || !s.length){
				return;
			}
			function searchfor(s){
				for (var i = 0; i < lines.length; i++){
					for (var j = 0; j < lines[i].length; j++){
						var [n,y0,y1,y2] = lines[i][j]
						if (n == s || trad_map[n] == s){
							
							var asp = (r1-r0)/(c1-c0)

							var [c,r] = [(y0+y1)/2,i+1];

							var _0 = 0.5;
							var _1 = 0.5;

							c0 = c - 200*_0;
							c1 = c + 200*(1-_0)
							r0 = r - (200*_1) * asp;
							r1 = r + (200*_1) * asp;
							bound();
							render(ctx,window.innerWidth,window.innerHeight,c0,c1,r0,r1,n);
							cacheR();

							return true;
						}
					}
				}
				return false;
			}
			var ret = searchfor(s);
			if (!ret){
				var ns = Array.from(s).map(x=>((x in SC2TC)?SC2TC[x]:x)).join("")
				console.log(ns);
				ret = searchfor(ns)
				if (!ret){
					alert("查無此人！非生卒年不詳也歟？")
				}
			}
			
		}
		// event.preventDefault();
	}

	canv.addEventListener('mousedown',mousedown,true)
	canv.addEventListener('mousemove',mousemove,true)
	canv.addEventListener('mouseup',mouseup,true)
	canv.addEventListener('wheel',onscroll,true)
	window.addEventListener('resize',function(){
		render(ctx,window.innerWidth,window.innerHeight,c0,c1,r0,r1);
		cacheR();
		event.preventDefault();
	},true)
	window.addEventListener('keypress',onkey,true)

}

var html = `<!--GENERATED FILE DO NOT EDIT-->
<html>
	<head>
	  <title>古人全表</title>
	  <meta charset="UTF-8">
	</head>
	<style>
		body{
			font-family:sans-serif;
			overflow:hidden;
		}
	</style>
	<body>

	</body>
	<script>
	 	var SC2TC = ${JSON.stringify(SC2TC)}
		var HH = 100;
		var dynasties = ${JSON.stringify(dynasties)}
		var eras = ${JSON.stringify(eras)}
		var trad_map = ${JSON.stringify(trad_map)}
		var lines = ${JSON.stringify(lines)}
		var people = ${JSON.stringify(people)}
		var render = ${render.toString()}
		var drawInfo = ${drawInfo.toString()}
		var main = ${main.toString()}
		main();
	</script>
</html>`

fs.writeFileSync("../dist/index.html",html)

