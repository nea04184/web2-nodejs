var http = require("http");
var fs = require("fs");
var url = require("url");
var qs = require("querystring");

//template는 재사용할 수 있는 껍데기 같은..?
function templateHTML(title, list, body, control) {
  return `<!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) {
  var list = "<ul>";
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + "</ul>";
  return list;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(request.url, true).query;
  var title = queryData.id;
  var pathname = url.parse(request.url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      fs.readdir("./data", function (error, filelist) {
        var title = "Welcome";
        var description = "Hello, Node.js";
        var template = templateHTML(
          title,
          templateList(filelist),
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir("./data", function (error, filelist) {
        fs.readFile(
          `data/${queryData.id}`,
          "utf8",
          function (err, description) {
            var template = templateHTML(
              title,
              templateList(filelist),
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );
            response.writeHead(200);
            response.end(template);
          }
        );
      });
    }
  } else if (pathname === "/create") {
    fs.readdir("./data", function (error, filelist) {
      var title = "WEB - create";
      var template = templateHTML(
        title,
        templateList(filelist),
        `
        <form action="/create_process" method="post">
        <p></p><input type="text" name="title" placeholder="title"></p>
        <p>
        <textarea name="description" placeholder="description"></textarea>
        </p>
        <p><input type ="submit">
        </p>
         </form>
        `,
        ""
      );
      response.writeHead(200);
      response.end(template);
    });
  } else if (pathname === "/create_process") {
    var body = "";
    request.on("data", function (data) {
      body += data; // body데이터에 data의 값을 추가해준다.
    });
    request.on("end", function () {
      var post = qs.parse(body);
      // console.log(post);  //event를 이용하여 post 방식으로 전송된 데이터를 가지고 올 수 있다. 객체화할수 있다.
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, "utf8", function (err) {
        response.writeHead(302, { location: `/?id=${title}` });
        response.end();
      });
    });
  } else if (pathname === "/update") {
    fs.readdir("./data", function (error, filelist) {
      fs.readFile(`data/${queryData.id}`, "utf8", function (err, description) {
        var template = templateHTML(
          title,
          templateList(filelist),
          `
          <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p></p><input type="text" name="title" placeholder="title" value=${title}></p>
          <p>
          <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p><input type ="submit">
          </p>
           </form>
          `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    });
  } else {
    response.writeHead(404);
    response.end("Not found");
  }
});

app.listen(3000);
