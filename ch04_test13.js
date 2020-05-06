//http 모듈을 사용해 사용자로부터 요청을 받았을 때 파일의 내용을 읽어 응답으로 보내는 코드.
const fs = require('fs');
const http = require('http');
const server = http.createServer((req, res) =>{
  const instream = fs.createReadStream('./output.txt');
  instream.pipe(res);
});
server.listen(7001, '127.0.0.1');
