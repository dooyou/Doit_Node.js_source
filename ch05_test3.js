const http = require('http');

const server = http.createServer();

const port = 3000;
server.listen(port, () => {
  console.log('Server Running! : %d', port);
});

server.on('connection', (socket) => {
  const addr = socket.address();
  console.log('클라이언트 접속 : %s, %d', addr.address, addr.port);
});

server.on('request', (req, res) => {
  console.log('클라이언트 요청');
  res.writeHead(200, {"Content-Type" : "text/html; charset=utf-8"});
  res.write("<!DOCTYPE html>");
  res.write("<html>");
  res.write("<head>");
  res.write("<title>응답 페이지</title>");
  res.write("</head>");
  res.write("<body>");
  res.write("<h1>노드제이에스로부터의 응답 페이지</h1>");
  res.write("</body>");
  res.write("</html>");
  res.end();
});

server.on('close', () => {
  console.log('서버가 종료');
});
