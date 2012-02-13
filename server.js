var static = require("node-static"),
	pathlib = require("path")

var file = new(static.Server)(pathlib.join(__dirname, 'static'));

require('http').createServer(function (request, response) {
    request.addListener('end', function () {
        file.serve(request, response);
    });
}).listen(8080);