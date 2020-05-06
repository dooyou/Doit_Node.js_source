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
// mongoose 모듈
const mongoose = require('mongoose');
//crypto 모듈 불러들이기
const crypto = require('crypto');

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

//라우터 객체 참조
const router = express.Router();

const databaseUrl = 'mongodb://localhost:27017/local';
//데이터베이스 연결
function connectDB(){
  //연결
  console.log('데이터베이스 연결을 시도합니다.');
  mongoose.Promise = global.Promise;
  mongoose.set('useCreateIndex', true);
  mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true });
  database = mongoose.connection;

  database.on('error', console.error.bind(console, 'mongoose connection error'));
  database.on('open', function(){
    console.log('데이터베이스에 연결되었습니다. : '+databaseUrl);

    // user 스키마 및 모델 객체 생성
    createUserSchema();
  });

  // 연결 끊어졌을 때 5초 후 재 연결
  database.on('disconnected', function(){
    console.log('연결이 끊어졌습니다. 다시 연결합니다.');
    setInterval(connectDB, 3000);
  });
}
const user = require('./routes/user');

// user 스키마 및 모델 객체 생성
function createUserSchema(){
  //user_schema.js 모듈 불러오기
  UserSchema = require('./database/user_schema').createSchema(mongoose);
  //UserModel 모델 정의
  UserModel = mongoose.model('users2', UserSchema);
  console.log('UserModel 정의함.' );
  //init 호출
  user.init(database, UserSchema, UserModel);
}//END createUserSchema

router.get('/process/login', (req, res) => {
  console.log('/process.login GET 호출됨');
  res.render('login');
});
router.get('/process/adduser', (req, res) => {
  console.log('/process/adduser GET 호출됨');
  res.render('adduser');
});
router.get('/process/listuser', (req,res) =>{
  console.log('/process/listuse GET 호출됨');
  res.render('listuser');
});



//로그인 라우팅 함수 - 데이터베이스의 정보와 비교
router.route('/process/login').post((req,res) => {
  console.log('/process.login POST 호출됨');
  const paramId = req.body.id || req.query.id;
  const paramPw = req.body.password || req.query.password;

  if(database) {
    user.authUser(database, paramId, paramPw, (err, docs) => {
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
}); //END router.route('/process/login')

//사용자 추가 라우팅 함수 - 클라이언트에서 보내온 데이터를 이용해 데이터베이스에 추가
router.route('/process/adduser').post((req, res) => {
  console.log('/process/adduser post 호출됨');

  const paramId = req.body.id || req.query.id;
  const paramPw = req.body.pw || req.query.pw;
  const paramNm = req.body.nm || req.query.nm;

  console.log('요청 파라미터 : '+paramId+' , '+paramPw+' , '+paramNm);

  //데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
  if(database){
    user.addUser(database, paramId, paramPw, paramNm, (err, result) => {
      if(err) throw err;

      //결과 객체 확인해서 추가된 데이터 있으면 성공 응답 전송
      // console.log('!!!!!!!! result : ', result);
      // console.log('!!!!!!!! result[0] : ', result[0] );
      // console.log('!!!!!!!! result.insertedCount : ', result.insertedCount);
      if(result) {
        console.dir(result);
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 추가 성공</h1>');
        res.write('NAME : '+paramNm+', <br>ID : '+paramId+', <br>PW : '+paramPw);

        res.end();
      } else {
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 추가 실패</h1>');
        res.end();
      }

    });
  } else { //데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h1>데이터베이스 연결 실패</h1>');
    res.end();
  }
});//END adduser post


router.route('/process/listuser').post((req, res) => {
  console.log('/process/listuser post호출됨');

  //데이터베이스 객체가 초기화된 경우, findAll 메소드 호출
  if(database){
    //1. 모든 사용자 검색
    UserModel.findAll(function(err, results){
      //오류가 발생했을 때 클라이언트로 오류 전송
      if(err) {
        console.error('사용자 리스트 조회 중 오류 발생'+err.stack);
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 리스트 조회 중 오류 발생</h1>');
        res.write('<p>'+err.stack+'</p>');
        res.end();

        return ;
      }

      if(results){ // 결과 객체 있으면 리스트 전송
        console.log(results);
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 리스트 </h1>');
        res.write('<div><ul>');

        for(let i=0; i<results.length; i++){
          let curId = results[i]._doc.id;
          let curName = results[i]._doc.name;
          res.write('<li>#'+i+' : '+curId+' : '+curName+'</li>');
        }
        res.write('</ul></div>');
        res.end();
      } else { // 결과 객체 없으면 실패 응답 전송
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 리스트 조회 실패</h1>');
        res.end();
      }
    });
  } else { // 데이터베이스 객체가 초기화되지 않았을 때 실패 응답 전송
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h1>데이터베이스 연결 실패 실패</h1>');
    res.end();
  }
});//END list post


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
