from glob import glob
import re
import os


bod = "born"


def scrape_p2():
	files = sorted(glob("wikipedia/"+bod+"/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('<a href="(\/w\/index.php\?title=Category:.*?)" title=.*?>下一頁<\/a>', html)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod,bod+"-p2")
			print(cmd)
			os.system(cmd)


def scrape_p3():

	files = sorted(glob("wikipedia/"+bod+"-p2/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('上一頁.*?<a href="(\/w\/index.php\?title=Category:.*?)" title=".*?>下一頁<\/a>', html)
		print(m)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod+"-p2",bod+"-p3")
			print(cmd)
			os.system(cmd)

def scrape_p4():

	files = sorted(glob("wikipedia/"+bod+"-p3/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('上一頁.*?<a href="(\/w\/index.php\?title=Category:.*?)" title=".*?>下一頁<\/a>', html)
		print(m)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod+"-p3",bod+"-p4")
			print(cmd)
			os.system(cmd)

def scrape_p5():

	files = sorted(glob("wikipedia/"+bod+"-p4/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('上一頁.*?<a href="(\/w\/index.php\?title=Category:.*?)" title=".*?>下一頁<\/a>', html)
		print(m)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod+"-p4",bod+"-p5")
			print(cmd)
			os.system(cmd)


def scrape_p6():

	files = sorted(glob("wikipedia/"+bod+"-p5/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('上一頁.*?<a href="(\/w\/index.php\?title=Category:.*?)" title=".*?>下一頁<\/a>', html)
		print(m)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod+"-p5",bod+"-p6")
			print(cmd)
			os.system(cmd)

def scrape_p7():

	files = sorted(glob("wikipedia/"+bod+"-p6/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('上一頁.*?<a href="(\/w\/index.php\?title=Category:.*?)" title=".*?>下一頁<\/a>', html)
		print(m)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod+"-p6",bod+"-p7")
			print(cmd)
			os.system(cmd)


def scrape_p8():

	files = sorted(glob("wikipedia/"+bod+"-p7/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('上一頁.*?<a href="(\/w\/index.php\?title=Category:.*?)" title=".*?>下一頁<\/a>', html)
		print(m)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod+"-p7",bod+"-p8")
			print(cmd)
			os.system(cmd)


def scrape_p9():

	files = sorted(glob("wikipedia/"+bod+"-p8/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('上一頁.*?<a href="(\/w\/index.php\?title=Category:.*?)" title=".*?>下一頁<\/a>', html)
		print(m)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod+"-p8",bod+"-p9")
			print(cmd)
			os.system(cmd)


def scrape_pA():

	files = sorted(glob("wikipedia/"+bod+"-p9/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('上一頁.*?<a href="(\/w\/index.php\?title=Category:.*?)" title=".*?>下一頁<\/a>', html)
		print(m)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod+"-p9",bod+"-pA")
			print(cmd)
			os.system(cmd)


def scrape_pB():

	files = sorted(glob("wikipedia/"+bod+"-pA/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('上一頁.*?<a href="(\/w\/index.php\?title=Category:.*?)" title=".*?>下一頁<\/a>', html)
		print(m)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod+"-pA",bod+"-pB")
			print(cmd)
			os.system(cmd)

def scrape_pC():

	files = sorted(glob("wikipedia/"+bod+"-pB/*.html"))
	for f in files:
		html = open(f,'r').read()
		m = re.findall('上一頁.*?<a href="(\/w\/index.php\?title=Category:.*?)" title=".*?>下一頁<\/a>', html)
		print(m)
		if len(m):
			url = "https://zh.wikipedia.org/" + m[0].replace("&amp;","&")
			cmd = "curl \""+url+"\" > "+f.replace(bod+"-pB",bod+"-pC")
			print(cmd)
			os.system(cmd)

scrape_pC()