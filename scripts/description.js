const fs = require("fs")

var _people = JSON.parse(fs.readFileSync("data/people-ancient.json").toString())
var people = {};
var d = "wikipedia/fullpage/"
var files = fs.readdirSync(d).filter(x=>x.endsWith(".html")).map(x=>d+x)

var filt_hints = [
/英語/g,
/希臘/g,
/拉丁/g,
/羅馬/g,
/法語/g,
/马其顿/g,
/埃及/g,
/·/g,
/意大利/g,
/英语/g,
/希腊/g,
/罗马/g,
/拉丁/g,
/法语/g,
/義大利/g,
/日语/g,
/日語/g,
/Caesar/g,
/孟加拉語/g,
/日本..时代/g,
/日本..時代/g,
/江.時代/g,
/朝鮮語/g,
/朝鲜语/g,
/德语/g,
/德語/g,
/越南语/g,
/越南語/g,
/鎌倉/g,
/高棉語/g,
/高棉语/g,
/明治/g,
/德川/g,
/大名/g,
/豐臣/g,
/韓語/g,
/韩语/g,
/緬甸語/g,
/缅甸语/g,
/室町/g,
/安土桃山/g,
/希伯來語/g,
/希伯来语/g,
/一世/g,
/三世/g,
/四世/g,
/五世/g,
/六世/g,
/七世/g,
/八世/g,
/九世/g,
/天皇/g,
/[αβγδεζηθικλμνξοπρσςτυφχψω]/g,
/[ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖゟ]/g,
/[가갸거겨고교구규그기ㄴ나냐너녀노뇨누뉴느니ㄷ다댜더뎌도됴두듀드디ㄹ라랴러려로료루류르리ㅁ마먀머며모묘무뮤므미ㅂ바뱌버벼보뵤부뷰브비ㅅ사샤서셔소쇼수슈스시ㅇ아야어여오요우유으이ㅈ자쟈저져조죠주쥬즈지ㅊ차챠처쳐초쵸추츄츠치ㅋ카캬커켜코쿄쿠큐크키ㅌ타탸터텨토툐투튜트티ㅍ파퍄퍼펴포표푸퓨프피ㅎ하햐허혀호효후휴흐히ㄲ까꺄꺼껴꼬꾜꾸뀨끄끼ㄸ따땨떠뗘또뚀뚜뜌뜨띠ㅃ빠뺘뻐뼈뽀뾰뿌쀼쁘삐ㅆ싸쌰써쎠쏘쑈쑤쓔쓰씨ㅉ짜쨔쩌쪄쪼쬬쭈쮸쯔찌]/g,
]
var keep_hints = [
/字..[，。]/g

]

for (var i = 0; i < files.length; i++){
	var html = fs.readFileSync(files[i]).toString();
	html.replace(/mw-parser-output[^]*?<p>([^]*?)<\/p>[^]*?<p>([^]*?)<\/p>/,function(x,y,w){
		var u = y.replace(/<\/?(a|b|s|i|l|r|m|f).*?>/g,"").replace(/&#91;註? ?.&#93;/g,'').replace(/&#.*?;/g,'').replace(/\n/g,'').replace(/\.mw-parser-output.*}/g,'')
		var v = w.replace(/<\/?(a|b|s|i|l|r|m|f).*?>/g,"").replace(/&#91;註? ?.&#93;/g,'').replace(/&#.*?;/g,'').replace(/\n/g,'').replace(/\.mw-parser-output.*}/g,'')
		var z = u+v;

		var n = files[i].split(".")[0].split("/").pop()
		var ok = true;
		for (var j = 0; j < filt_hints.length; j++){
			z.replace(filt_hints[j],function(){
				ok = false;
			})
		}
		if (n.length >= 4 && z.includes("日本")){
			ok = false;
		}
		if (n.includes("天皇")){
			ok = false;
		}
		for (var j = 0; j < keep_hints.length; j++){
			u.replace(keep_hints[j],function(){
				ok = true;
			})
		}
		if (u.length < 12){
			u += v;
		}
		if (ok){

			_people[n].summary = u;
			people[n] = _people[n]
		
		}
	})
}

people["郤縠"].born="-682";

var jstr = "{\n"
for (var k in people){
	jstr += `"${k}":${JSON.stringify(people[k])},\n`
}
jstr = jstr.slice(0,-2) + "\n}"
fs.writeFileSync("data/people-ancient-china.json",jstr)

