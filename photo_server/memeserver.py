from memeify import memeify
import cherrypy
class HelloWorld:
    def index(self, url = None, top = None, bot = None, x = None, y = None, width = None, height = None, img = None):
        if not url:
            return file('../html/index.html').read()
        cherrypy.response.headers["Content-Type"] = "image/jpeg"
        raise cherrypy.HTTPRedirect("https://s3.amazonaws.com/memeyourfriends/" +  memeify(url, top, bot, x, y, width, height))
        return 0
    index.exposed = True

cherrypy.quickstart(HelloWorld(), "/", "cherrypy_config.py")

