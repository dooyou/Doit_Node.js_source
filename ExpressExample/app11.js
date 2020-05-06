const express = require('express');
const http = require('http');
const path = require('path');
// 익스프레스 미들웨어 bodyParser
const bodyParser = require('body-parser');
// express-error-handler 사용
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');

// 익스프레스 개체 생성
const app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);
// body-parser를 사용해 application/x=www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));
// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'/public')));
app.use(cookieParser());

// 라우터 객체 참조
const router = express.Router();

// 라우팅 함수 등록
router.route('/process/showCookie').get( function(req,res){
  console.log('/process/showCookie 처리함.');
  res.send(req.cookies);
});

router.route('/process/setUserCookie').get( function(req,res){
  console.log('/process/setUserCookie 호출됨');
  //쿠키 설정
  res.cookie('user', {
    id : 'mike',
    name : '소녀시대',
    authorized : true
  });
  // redirect로 응답
  res.redirect('/process/showCookie');
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
