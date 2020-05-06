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
// 데이터베이스 객체를 위한 변수 선언
let database;
// DB 스키마 객체 변수 선언
let UserSchema;
// DB 모델 객체 변수 선언
let UserModel;
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

//user 스키마 및 모델 객체 생성
function createUserSchema(){

  UserSchema = mongoose.Schema({
    id:{type:String, required:true, unique:true, 'default' : ' '},
    hashed_password:{type:String, required:true, 'default' : ' '},
    salt:{type:String, required:true,},
    name:{type:String, index:'hashed'},
    age:{type:Number, 'default':-1},
    created_at : {type:Date, index:{unique:false},'default':Date.now },
    updated_at : {type:Date, index:{unique:false},'default':Date.now }
  });
  UserSchema
   .virtual('password')
   .set(function(password){
     this._password = password;
     this.salt = this.makeSalt();
     this.hashed_password = this.encryptPassword(password);
     console.log('virtual password 호출됨 : ', this.hashed_password);
   })
   .get(function(){return this._password});

   UserSchema.method('encryptPassword', function(plainText, inSalt){
     if (inSalt) {
       return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
     } else {
        return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
     }
   });

   //salt 값 만들기 메소드
   UserSchema.method('makeSalt', function(){
     return Math.round((new Date().valueOf() * Math.random())) + '';
   });

   //인증 메소드 입력된 비밀번호와 비교 (true/false 리턴)
   UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
     if (inSalt) {
       console.log('authenticate 호출됨 : %s -> %s : %s'+plainText+
         this.encryptPassword(plainText, inSalt), hashed_password);
       return this.encryptPassword(plainText, inSalt) === hashed_password;
     } else {
       console.log('authenticate 호출됨 : %s -> %s : %s'+plainText+
         this.encryptPassword(plainText), this.hashed_password);
       return this.encryptPassword(plainText, inSalt) === this.hashed_password;
     }
   });

   //필수 속성에 대한 유효성 확인(길이 값 체크)
   UserSchema.path('id').validate(function(id){
     return id.length;
   }, 'id 칼럼의 값이 없습니다.');

   UserSchema.path('name').validate(function(name){
     return name.length;
   }, 'name 칼럼의 값이 없습니다.');

   //
  UserSchema.static('findById', function(id, callback){
    return this.find({id:id}, callback);
  });
  UserSchema.static('findAll', function(callback){
    return this.find({ }, callback);
  });
  //
  console.log('UserSchema 정의함.');

  // 모델 정의
  UserModel = mongoose.model('users4', UserSchema);
  console.log('UserModel 정의함.');
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

  //1. 아이디 사용해 검색
  UserModel.findById(id, (err, results) => {
    if(err){
      callback(err, null);
      return;
    }
    // console.log('아이디 [%s] 사용자 검색 결과', id);
    // console.dir(results);

    if(results.length > 0){
      console.log('아이디 일치하는 사용자 찾음. ');

      //2. 비밀번호 확인 : 모델 인스턴스를 객체를 만들고 authenticate() 메소드 호출.
      const user = new UserModel({id:id});
      const authenticated = user.authenticate(password, results[0].salt,
      results[0].hashed_password);

      if(authenticated){
        console.log('비밀번호 일치함');
        callback(null, results);
      } else {
        console.log('비밀번호  일치하지 않음.');
        callback(null, null);
      }

    } else {
      console.log('아이디와 일치하는 사용자를 찾지 못함.');
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
  console.log('addUser 사용자를 추가하는 함수 호출됨 : ');

  // UserModel의 인스턴스 생성
  const user = new UserModel({"id":id, "password":password, "name":name});

  //save()로 저장
  user.save((err)=>{
    if(err){
      callback(err, null);
      return;
    }
    console.log('사용자 데이터 추가함.');
    callback(null, user);
  });
};


//사용자 추가 라우팅 함수 - 클라이언트에서 보내온 데이터를 이용해 데이터베이스에 추가
router.route('/process/adduser').post((req, res) => {
  console.log('/process/adduser post 호출됨');

  const paramId = req.body.id || req.query.id;
  const paramPw = req.body.pw || req.query.pw;
  const paramNm = req.body.nm || req.query.nm;

  console.log('요청 파라미터 : '+paramId+' , '+paramPw+' , '+paramNm);

  //데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
  if(database){
    addUser(database, paramId, paramPw, paramNm, (err, result) => {
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
});


router.get('/process/listuser', (req,res) =>{
  console.log('/process/listuse GET 호출됨');
  res.render('listuser');
});
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
