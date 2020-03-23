# import os
# for i in range(0,2021):
# 	os.system("curl https://zh.wikipedia.org/wiki/Category:"+str(i)+"年出生 > wikipedia/born/"+str(i).zfill(4)+".html")


import os
import time

for i in range(-999,2021):
	os.system("curl https://zh.wikipedia.org/zh-tw/Category:"+str(i).replace("-","前")+"年出生 > wikipedia/born/"+str(i).zfill(4)+".html")
	time.sleep(1)

for i in range(-999,2021):
	os.system("curl https://zh.wikipedia.org/zh-tw/Category:"+str(i).replace("-","前")+"年逝世 > wikipedia/dead/"+str(i).zfill(4)+".html")
	time.sleep(1)


for i in range(-990,2020,10):
	os.system("curl https://zh.wikipedia.org/zh-tw/Category:"+str(i).replace("-","前")+"年代出生 > wikipedia/born-circa/"+str(i).zfill(4)+".html")
	time.sleep(1)

for i in range(-990,2020,10):
	os.system("curl https://zh.wikipedia.org/zh-tw/Category:"+str(i).replace("-","前")+"年代逝世 > wikipedia/dead-circa/"+str(i).zfill(4)+".html")
	time.sleep(1)