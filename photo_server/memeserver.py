from memeify import memeify
import cherrypy
class HelloWorld:
    def index(self, url = None, top = None, bot = None, x = None, y = None, width = None, height = None):
        if not url:
            return file('../html/index.html').read()
        cherrypy.response.headers["Content-Type"] = "image/jpeg"
        return memeify(url, top, bot, x, y, width, height)
    index.exposed = True

cherrypy.quickstart(HelloWorld(), "/", "cherrypy_config.py")

