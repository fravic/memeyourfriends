[global]
server.socket_host = "0.0.0.0"

[/]
tools.staticdir.root = "/var/www2/facebook/html/"

[/client]
tools.staticfile.on = True
tools.staticfile.filename = "/var/www2/facebook/html/index.html"

[/lol.html]
tools.staticfile.on = True
tools.staticfile.filename = "/var/www2/facebook/html/lol.html"

[/img/bg.jpg]
tools.staticfile.on = True
tools.staticfile.filename = "/var/www2/facebook/html/img/bg.jpg"

[/js/main.js]
tools.staticfile.on = True
tools.staticfile.filename = "/var/www2/facebook/html/js/main.js"

[/css/main.css]
tools.staticfile.on = True
tools.staticfile.filename = "/var/www2/facebook/html/css/main.css"
