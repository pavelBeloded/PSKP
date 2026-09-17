import http from 'http'

const server = http.createServer((req, res) => {

  const body = [];

  req.on('data', (chunk) => body.push(chunk));
  req.on('end',()=> {
    const body_str = Buffer.concat(body).toString()

    const html = `
      <html>
        <head><meta charset="utf-8"><title>Информация о запросе</title></head>
        <body>
          <h1>Информация о запросе</h1>
          <p><b>Метод:</b> ${req.method}</p>
          <p><b>URI:</b> ${req.url}</p>
          <p><b>HTTP-версия:</b> ${req.httpVersion}</p>
          <p><b>Заголовки:</b></p>
          <pre>${JSON.stringify(req.headers, null, 2)}</pre>
          <p><b>Тело запроса:</b></p>
          <pre>${body_str}</pre>
        </body>
      </html>
    `;


    res.writeHead(200, {"Content-Type": "text/html"});
    res.end(html);

  })

})


server.listen(3001, ()=> {
  console.log("Server is running on port 3001");
});