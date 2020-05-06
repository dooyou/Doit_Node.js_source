const express = require('express');
const http = require('http');

// 익스프레스 개체 생성
const app = express();

app.use((req,res,next) => {
  console.log('첫 번째 미들웨어에서 요청을 처리');
  res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'})
  res.end('<h1>Express 서버에서 응답한 결과</h1>')
});

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);

// Express 서버 시작
http.createServer(app).listen(app.get('port'), () => {
  console.log('익스프레스 서버를 시작 :', app.get('port'));
});
