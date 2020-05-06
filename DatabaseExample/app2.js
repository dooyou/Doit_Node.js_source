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
const databaseUrl = 'mongodb://localhost:27017';
const dbName = 'local';
const client = new MongoClient(databaseUrl, {useUnifiedTopology : true});
//데이터베이스 연결
function connectDB(){
  client.connect((err, db) => {
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
router.route('/process/login').post((req,res) => {
  console.log('/process.login POST 호출됨');
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

router.get('/process/adduser', (req, res) => {
  console.log('/process/adduser GET 호출됨');
  res.render('adduser');
});


//사용자를 추가하는 함수
const addUser = function(database, id, password, name, callback){
  console.log('addUser 사용자를 추가하는 함수 호출됨 : '+id+' , '+password+' , '+name);

  //users 컬렉션 참조
  const users = database.collection('users');
  //id, password, username을 사용해 사용자 추가
  users.insertMany([{"id":id, "password":password, "name":name}], function(err,result){
    if(err){ //오류가 발생했을 때 콜백 함수를 호출하면서 오류 객체 전달
      callback(err, null);
      return;
    }

    //오류가 아닌 경우, 콜백 함수를 호출하면서 결과 객체 전달
    if(result.insertedCount > 0){
      console.log('사용자 레코드 추가됨 : '+result.insertedCount );
    } else {
      console.log('추가된 레코드가 없음.');
    }

    callback(null, result);
  });
}

//사용자 추가 라우팅 함수 - 클라이언트에서 보내온 데이터를 이용해 데이터베이스에 추가
router.route('/process/adduser').post((req, res) => {
  console.log('/process/adduser POST 호출됨!!!');

  const paramId = req.body.id || req.query.id;
  const paramPw = req.body.pw || req.query.pw;
  const paramNm = req.body.nm || req.query.nm;

  console.log('POST 요청 파라미터 : '+paramId+' , '+paramPw+' , '+paramNm);

  //데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
  if(database){
    addUser(database, paramId, paramPw, paramNm, (err, result) => {
      if(err) throw err;

      //결과 객체 확인해서 추가된 데이터 있으면 성공 응답 전송
      if(result && result.insertedCount > 0 ) {
        console.dir(result);
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 추가 성공</h1>');
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
});





// addUser함수에는 데이터베이스 객체와 함께 사용자에게 요청받은 id, password, name파라미터 값을 전달합니다. 마지막 파라미터는 콜백 함수로서 이 함수를 호출하는 쪽에 결과 객체를 보내기 위해서 전달받습니다. users 컬렉션을 참조한 후 insertMany()메소드를 호출하여 데이터를 추가합니다.
//
// insertMany()메소드를 호출할 때 전달하는 콜백 함수로 결과가 넘어오면 데이터가 성공적으로 추가되었는지 알 수 있습니다. 결과 객체 안에 있는 insertedCount 속성은 추가된 레코드의 개수를 알려줍니다. 따라서 이 개수가 0보다 크면 정상적으로 추가된 것입니다.


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
