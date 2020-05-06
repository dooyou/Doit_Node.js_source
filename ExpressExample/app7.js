const express = require('express');
const http = require('http');
const path = require('path');
// 익스프레스 미들웨어 bodyParser
const bodyParser = require('body-parser');


// 익스프레스 개체 생성
const app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 사용해 application/x=www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'public')));

//미들웨어에서 파라미터 확인
app.use((req,res,next) => {
  console.log('첫 번째 미들웨어에서 요청을 처리');

  const paramId = req.body.userid || req.query.userid;
  const paramPw = req.body.passWord || req.query.passWord;

  res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
  res.write('<h1>Express 서버에서 응답한 결과</h1>');
  res.write('<div><p>Param ID : '+paramId+'</p></div>');
  res.write('<div><p>Param password : '+paramPw+'</p></div>');
  res.end()
});



// Express 서버 시작
http.createServer(app).listen(app.get('port'), () => {
  console.log('익스프레스 서버를 시작 :', app.get('port'));
});
