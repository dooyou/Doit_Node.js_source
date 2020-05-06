// Express 기본 모듈 불러오기
const express = require('express');
const http = require('http');
const path = require('path');
// Express 미들웨어 불러오기
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const static = require('serve-static');
const errorHandler = require('errorhandler');
const pug = require('pug');
// 오류 핸들러 모듈 사용
const expressErrorHandler = require('express-error-handler');
// Session 미들웨어 불러오기
const expressSession = require('express-session');

const config = require('./config');
const route_loader = require('./routes/route_loader');
const user = require('./routes/user');
const database = require('./database/database')
//익스프레스 객체 생성
const app = express();

// 서버 변수 설정
console.log('config.server_port : %d', config.server_port);
app.set('port', process.env.PORT  || config.server_port);

//view engine setup
app.set(path.join(__dirname, '/views'));
app.set('view engine', 'pug');
//body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended : false }));
// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());
// public 폴더를 static으로 오픈
app.use(static(path.join(__dirname, '/public')));
// cookie-parser 설정
app.use(cookieParser());
//세션 설정
app.use(expressSession({
  secret:'my key',
  resave:true,
  saveUninitialized:true
}));

//라우팅 정보를 읽어 들여 라우팅 설정
route_loader.init(app, express.Router());

// 404 오류 처리
const errorhandler = expressErrorHandler({
  static : {
    '404' : './public/404.html'
  }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorhandler);

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

// 서버 시작
http.createServer(app).listen(app.get('port'), () => {
  console.log('Running, PORT : ', app.get('port'));

  database.init(app, config);
});
