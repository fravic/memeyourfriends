import os, sys
import cStringIO
import math
from urllib2 import Request, urlopen, URLError, HTTPError
from PIL import ImageFont
from PIL import Image
from PIL import ImageDraw

def memeify(url, top, bot, x, y, width, height):
    req = Request(url)

    try:
        f = urlopen(req)
        data = cStringIO.StringIO(f.read())        
        img = Image.open(data)

    except HTTPError, e:
        print "HTTP Error:",e.code , url
    except URLError, e:
        print "URL Error:",e.reason , url
    

    #check if only a portion of the cropping variables have been filled out
    if (x or y or width or height) and not (x and y and width and height):
        width1, height1 = img.size
        if not x:
            x = "0" #needs to be a string to be evaluated properly in the next conditional statement (HACK)
        if not y:
            y = "0"
        if not width:
            width = width1
        if not height:
            height = height1
        
    #if all cropping variables are valid crop the image before continuing
    if x and y and width and height and int(width) > 0 and int(height) > 0:
        box = (int(x),int(y), int(x) + int(width), int(y) + int(height))
        img = img.crop(box)

    if top: 
        drawText(img, top, True)
    if bot:
        drawText(img, bot, False)
    
    save_buffer = cStringIO.StringIO()
    img.save(save_buffer, "JPEG")
    output = save_buffer.getvalue()

    data.close()
    save_buffer.close()
    return output


def drawText(img, text, top):
    width, height = img.size
    draw = ImageDraw.Draw(img)
    font = 0

    ratio = 0.8
    while ratio > 0:
        font_size = get_font_size(len(text), width, height, ratio)
        font = ImageFont.truetype("impact.ttf", font_size)
        text_array = wordwrap(text.upper(), font, (19 * width) / 20)
        
        if len(text_array) * font_size < height / 5:
            break;
        ratio -= 0.05

    for i, line in enumerate(text_array):
        fw, fh = font.getsize(line)
        x = (width - fw) / 2
        y = fh * i if top else height - fh * (len(text_array) - i)

        border = fh / 40 + 1
        
        draw.text((x-border, y-border), line, (0,0,0), font=font)
        draw.text((x+border, y-border), line, (0,0,0), font=font)
        draw.text((x-border, y+border), line, (0,0,0), font=font)
        draw.text((x+border, y+border), line, (0,0,0), font=font)

        draw.text((x, y), line, (255,255,255), font=font)    

def get_font_size(length, width, height, ratio):
    font_size = 2 * int(ratio * math.sqrt( (width * height / 5) / (2 * length)))
    if font_size > height / 6:
        font_size = height / 6
    return font_size

# TODO: refactor and give better long word splitting
def wordwrap(s, font, width):
    words = s.split(" ")
    lines = [""]
    width_so_far = 0

    for word in words:
        if lines[-1] is not "":
            word = " " + word

        str_width = font.getsize(word)[0]
        width_so_far += str_width

        if width_so_far > width:
            if str_width > width:
                wlen = len(word)
                wf = word[:wlen/2] + "-"
                word = word[wlen/2:]
                if font.getsize(wf)[0] + width_so_far > width:
                    wf.strip()
                    if lines[-1] is "":
                        lines[-1] = wf
                    else:
                        lines.append(wf)
                else:
                    lines[-1] += wf
            lines.append("")
            word.strip()
            width_so_far = font.getsize(word)[0]

        lines[-1] += word

    return lines            

if __name__ == '__main__':
    import random

    urls = [
        "http://www.wired.com/images_blogs/underwire/images/2009/04/09/random_dannyhajek.jpg",
        "http://sphotos.ak.fbcdn.net/hphotos-ak-snc4/hs1358.snc4/163046_10150380922285181_787795180_16900389_5869434_n.jpg",
        "http://www.storkie.com/blog/wp-content/uploads/2010/09/angry-baby-fist.jpg",
        "http://www.21stcenturymed.org/sad-face.jpg",
        ]

    words = ["penis", "dicksdicksdicks", "boy do I love dicks", "love", "I", "the", "cow", "killed", "scary", "huge", "whhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhat", "crazy", "WOOT!", "Fravichasmanboobs"]
    
    for count, url in enumerate(urls):
        word_length = random.randint(1, 20)
        top = ""
        for i in range(word_length):
            if i is not 0:
                top += " "
            top += words[random.randint(0, len(words) - 1)]

        word_length = random.randint(1, 20)
        bot = ""
        for i in range(word_length):
            if i is not 0:
                bot += " "
            bot += words[random.randint(0, len(words) - 1)]

        raw = memeify(url, top, bot, 100, 100, 300, 700)
        data = cStringIO.StringIO(raw)        
        img = Image.open(data)
        img.save("meme1" + str(count) + ".jpg")
        data.close()


