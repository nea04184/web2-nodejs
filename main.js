var http = require('http');
var fs = require('fs');
var url = require('url');
console.log("Hello 혤로world!");

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(request.url, true).query;
  var title = queryData.id;

  



  
  fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
    var template = `<!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <ol>
        <li><a href="/?id=HTML">HTML</a></li>
        <li><a href="/?id=CSS">CSS</a></li>
        <li><a href="/?id=JavaScript">JavaScript</a></li>
      </ol>
      <h2>${title}</h2>
      <p>${description}</p>
    </body>
    </html>
    `;
    response.writeHead(200);
    response.end(template);
  });
});
app.listen(3000);