const express = require('express');
const http = require('http');
const path = require('path');
// 익스프레스 미들웨어 bodyParser
const bodyParser = require('body-parser');
// express-error-handler 사용
const expressErrorHandler = require('express-error-handler');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

// 익스프레스 개체 생성
const app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);
// body-parser를 사용해 application/x=www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));
// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(expressSession({
  secret:'my key',
  resave:true,
  saveUninitialized:true
}));

// 라우터 객체 참조
const router = express.Router();

// 상품정보 라우팅 함수
router.route('/process/product').get( function(req,res){
  console.log('/process/product 호출됨.');

  if (req.session.user) {
    res.redirect('/public/product.html');
  } else {
    res.redirect('/public/login2.html');
  }
});

//로그인 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/login').post( (req,res) => {
  console.log('/process/login 호출됨.');

  paramId = req.body.userid || req.query.userid;
  paramPw = req.body.passWord || req.query.passWord;

  if (req.session.user) {
    //  이미 로그인된 상태
    console.log('이미 로그인되어 상품 페이지로 이동 ');
    res.redirect('public/product.html');
  } else {
    //세션 저장
    req.session.user = {
      id : paramId,
      name : '소녀시대',
      authorized : true
    };
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h1>로그인 성공</h1>');
    res.write('<div><p>Param ID : '+paramId+'</p></div>');
    res.write('<div><p>Param password : '+paramPw+'</p></div>');
    res.write('<br><br><a href="/process/product">상품 페이지로 이동하기</a>');
    res.end()
  }
});

//로그아웃 라우팅 함수 - 로그아웃 후 세션 삭제
router.route('/process/logout').get((req,res) => {
  console.log('/process/logout 호출됨.');

  if (req.session.user) {
    //로그인 된 상태
    console.log('로그아웃');
    req.session.destroy( (err) => {
      if(err) throw err;

      console.log('세션을 삭제하고 로그아웃');
      res.redirect('/public/login2.html');
    });
  } else {
    // 로그인 안된 상태
    console.log('아직 로그인되어 있지 않습니다.');
      res.redirect('/public/login2.html');
  }
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
  console.log('app12 익스프레스 서버를 시작 :', app.get('port'));
});
