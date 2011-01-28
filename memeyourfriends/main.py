from google.appengine.ext import webapp
from google.appengine.ext.webapp import util
from google.appengine.ext.webapp import template
from google.appengine.api.urlfetch import fetch
from poster.encode import multipart_encode
from poster.streaminghttp import register_openers
import facebook as fb
import os
import urllib
import urllib2
import logging
import utils
import StringIO
import settings
APP_KEY = settings.app_key
APP_SECRET = settings.secret_key
GRAPH_PHOTO_URL = "https://graph.facebook.com/me/photos"
MEME_URL = "http://www.willhughes.ca:8080/"


class MainHandler(webapp.RequestHandler):
    def post(self):        
        template_values = {}
        path = os.path.join(os.path.dirname(__file__),
                            'templates', 'index.html')
        self.response.out.write(template.render(path, template_values))


class MemeHandler(webapp.RequestHandler):
    def post(self):

        user = fb.get_user_from_cookie(self.request.cookies, APP_KEY, APP_SECRET)
        access_token = user["access_token"]

        url = self.request.get('url')
        top = self.request.get('top')
        bot = self.request.get('bot')
 
        # Retrieve meme photo from meme server
        meme_params = urllib.urlencode({'url':url,
                                        'top':top,
                                        'bot':bot})
        logging.info(MEME_URL + '?' + meme_params)
        meme_data = fetch(MEME_URL + '?' + meme_params)
        
        if (len(meme_data.content) < 100):
            logging.info(meme_data.content)
        logging.info("version 4 baby!")
        # Post photo and message to user's album
        msg = top + " " + bot

        logging.info(access_token)

        imgData = StringIO.StringIO(meme_data.content)
        imgData.name = "image.jpg"
        register_openers()
        params = {   
                    "access_token": access_token,
                     "message": msg,
                  "source": imgData
                }
                
        datagen, headers = multipart_encode(params)
        request = urllib2.Request(GRAPH_PHOTO_URL, datagen, headers)
        print urllib2.urlopen(request).read()
        
def main():
    routes = [('/', MainHandler),
              ('/meme', MemeHandler)]
    application = webapp.WSGIApplication(routes,
                                         debug=True)
    util.run_wsgi_app(application)


if __name__ == '__main__':
    main()
