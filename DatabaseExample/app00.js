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
// 몽고디비 모듈 사용
const MongoClient = require('mongodb').MongoClient;
//익스프레스 객체 생성
const app = express();

//기본 속성 설정
app.set('port', process.env.PORT  || 3000);
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

// 데이터베이스 객체를 위한 변수 선언
let database;
// Connection URL
const databaseUrl = 'mongodb://localhost:27017';
// Database Name
const dbName = 'local';
//몽고디비 모듈 사용
const client = new MongoClient(databaseUrl, {useUnifiedTopology : true});
//데이터베이스 연결
function connectDB(){
  //연결
  client.connect( (err, db) => {
    if(err) throw err;
    console.log('DB연결 성공 : ', databaseUrl);
    database = client.db(dbName);//변수 할당
  })
}
//라우터 객체 참조
const router = express.Router();

router.get('/process/login', (req, res) => {
  console.log('/process.login GET 호출됨');
  res.render('login');
});


//사용자 인증 함수
const authUser = (database, id, password, callback) => {
  console.log('authUser 호출');
  //users 컬렉션 참조
  const users = database.collection('users');
  // 아디와 비밀번호를 사용해 검새
  users.find({"id" : id, "password" : password}).toArray((err, docs) => {
    if(err){
      callback(err, null);
      return;
    }

    if(docs.length > 0){
      console.log('아이디 [%s], 비밀번호 [%s]가 일치하는 사용자 찾음', id, password);
      callback(err, docs);
    } else {
      console.log('일치하는 사용자를 찾지 못함.');
      callback(null, null);
    }
  });
}


//로그인 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/process/login').post((req, res) => {
  console.log('/process/login POST 호출됨');

  const paramId = req.body.id || req.query.id;
  const paramPw = req.body.password || req.query.password;

  if(database) {
    authUser(database, paramId, paramPw, (err,docs) => {
      if(err) throw err;

      if(docs){
        console.dir(docs);
        const username = docs[0].name;
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>사용자 아이디 : '+paramId+'</p></div>');
        res.write('<div><p>사용자 이름 : '+username+'</p></div>');
        res.write('<br><br><a href="/process/login">다시 로그인하기</a>');
        res.end();
      } else {
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>로그인 실패</h1>');
        res.write('<div><p>아이디와 비밀번호를 다시 확인하십시오.</p></div>');
        res.write('<br><br><a href="/process/login">다시 로그인하기</a>');
        res.end();
      }
    });
  } else {
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h1>데이터베이스 연결 실패</h1>');
    res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
    res.end();
  }
});

//라우터 객체 등록
app.use('/', router);

// 404 오류 처리
const errorhandler = expressErrorHandler({
  static : {
    '404' : './public/404.html'
  }
});
app.use(expressErrorHandler.httpError(404));
app.use(errorhandler);


// 서버 시작
http.createServer(app).listen(app.get('port'), () => {
  console.log('Running, PORT : ', app.get('port'));

  connectDB();
});
