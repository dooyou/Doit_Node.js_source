const express = require('express');
const http = require('http');
const path = require('path');
// 익스프레스 미들웨어 bodyParser
const bodyParser = require('body-parser');
// express-error-handler 사용
const expressErrorHandler = require('express-error-handler');


// 익스프레스 개체 생성
const app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);

// body-parser를 사용해 application/x=www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));

// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname,'/public')));


// 라우터 객체 참조
const router = express.Router();


// 라우팅 함수 등록
router.route('/process/users/:id').get( function(req,res){
  console.log('/process/users/:id 처리함.');

  const paramId = req.params.id;

  console.log('/process/users와 토큰 %s를 이용해 처리함.', paramId);

  res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
  res.write('<h1>Express 서버에서 응답한 결과</h1>');
  res.write('<div><p>Param ID : '+paramId+'</p></div>');
  res.end()
});

// 라우터 객체를 app 객체에 등록
app.use('/', router);

// 모든 router 처리 끝난 후 404 오류 페이지 처리.
const errorHandler = expressErrorHandler({
  static : {
    '404' : './public/404.html'
  }
});
app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


// Express 서버 시작
http.createServer(app).listen(app.get('port'), () => {
  console.log('익스프레스 서버를 시작 :', app.get('port'));
});
