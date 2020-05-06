const http = require('http');
const fs = require('fs');

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

  const filename = 'typewriter-1031024_1920.jpg';
  const infile = fs.createReadStream(filename, {flag:'r'});
  // 파이프로 연결
  infile.pipe(res);

});

server.on('close', () => {
  console.log('서버가 종료');
});
