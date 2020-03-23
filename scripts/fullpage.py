import json
import os

J = json.loads(open("data/people-ancient.json",'r').read())

for k in J:
	cmd = 'curl "https://zh.wikipedia.org'+J[k]['link']+'" > wikipedia/fullpage/'+k+".html"
	os.system(cmd)