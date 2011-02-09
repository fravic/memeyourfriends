from poster.encode import multipart_encode
from poster.streaminghttp import register_openers
import urllib2

GRAPH_PHOTO_URL = "https://graph.facebook.com/me/photos"


def upload(img, message, access_token):
    register_openers()
    params = {   
                "access_token": access_token,
                 "message": message,
              "source": img
            }
        
    datagen, headers = multipart_encode(params)
    request = urllib2.Request(GRAPH_PHOTO_URL, datagen, headers)
    print urllib2.urlopen(request).read()

if __name__ == "__main__":
    #test code
    img_src =   open("fravic_motorcycle.jpg", "rb")
    msg = 'Uploaded By Meme Your Friends'
    token = '2227470867|2.b3a_XsrEosBZxoBtpnIdIA__.3600.1296111600-701578908|WVwf-tfHX4KkUcJcpma1v7K7FU4'
    upload(img_src, msg, token)
