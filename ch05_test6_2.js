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
  let filelength = 0;
  let curlength = 0;

  fs.stat(filename, (err, stats) => {
    filelength = stats.size;
  });

  //헤더쓰기
  res.writeHead(200, {'Content-Type' : 'image/jpeg'});

  //파일 내용을 스트림에서 읽어 본문쓰기
  infile.on('readable', () => {
    let chunk;
    while (null !== (chunk = infile.read())) {
      console.log('읽어 들인 데이터 크기 : %d 바이트 ', chunk.length);
      curlength += chunk.length;
      res.write(chunk, 'utf8', (err) => {
        console.log('파일 부분 쓰기 완료 : %d, 파일크기 : %d ', curlength, filelength);
        if (curlength >= filelength) {
          //응답 전송
          res.end();
        }
      });
    }
  });
});

server.on('close', () => {
  console.log('서버가 종료');
});
