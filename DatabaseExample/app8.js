const express = require('express');
const http = require('http');
const path = require('path');

const bodyParser = require('body-parser');
const static = require('serve-static');
const pug = require('pug');
const mysql = require('mysql');

const app = express();
const router = express.Router();
//body-parser를 사용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({extended : false }));
// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

// DB연결정보
const pool = mysql.createPool({
  connectionLimit : 10,
  host: '.cafe24.com',
  user: '',
  password: '',
  database: '',
  port: '3306',
  debug : false
});

app.set('port', process.env.PORT || 3000);
app.set(path.join( __dirname, '/views'));
app.set('view engine', 'pug' );
app.use(static(path.join(__dirname, '/public')));

//사용자 인증
const authUser = (id, passwd, callback) =>{
  console.log('authUser Call!!');

  //커넥션 풀에서 연결 객체 가져오기
  pool.getConnection((err, conn) => {
    if(err) {
      if(conn) {
        conn.release(); //반드시 해제해야 합니다.
      }
      callback(err, null);
      return;
    }
    console.log('데이터베이스 연결 스레드 아이디 : ', conn.threadId);

    const columns = ['id', 'name', 'age'];
    const tablename = 'users';

    //sql
    const exec = conn.query('select ?? from ?? where id = ? and pw = ?',
    [columns, tablename, id, passwd], (err, rows) => {
      conn.release(); // 반드시 해제해야 합니다.
      console.log('실행 대상 SQL : ', exec.sql);

      if(rows.length > 0){
        console.log('아이디 [%s], 패스워드 [%s]가 일치하는 사용자 찾음.', id, passwd);
        callback(null, rows);
      } else {
        console.log('일치하는 사용자를 찾지 못함.');
        callback(null, null);
      }
    });
  });
}

router.get('/process/login', (req,res) => {
  res.render('login2')
});

//사용자 인증 라우팅 함수
router.route('/process/login').post((req,res) => {
  console.log('/process/login Call!!!');
  const paramId = req.body.id || req.query.id;
  const paramPw = req.body.pw || req.query.pw;
  console.log('요청 param : '+paramId+' , '+paramPw);
  //pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
  if(pool){
    authUser(paramId, paramPw, (err, rows) => {
      //오류 발생했을 때 클라이언트로 오류 전송
      if(err){
        console.log('사용자 로그인 중 오류 발생 : '+err.stack);
        res.writeHead( '200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 로그인 중 오류 발생</h1>');
        res.write('<p>'+ err.stack +'</p>');
        res.end();
        return;
      }
      if(rows){
        console.dir(rows);
        const username = rows[0].name;
        res.writeHead( '200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 Login 성공</h1>');
        res.write('<p>사용자 아이디 : '+paramId+'</p>');
        res.write('<p>사용자 이름 : '+username+'</p>');
        res.write('<a href="/process/login">다시 로그인</a>');
        res.end();
      }
    });
  }
});


// 사용자 추가 라우팅 GET
router.get('/process/adduser', (req,res) => {
  res.render('adduser2');
});

//사용자 추가 함수
const addUser = (id, name, age, passwd, callback) => {
  console.log('addUser call!');
  //커넥션 풀에서 연결 객체를 가져옵니다.
  pool.getConnection((err, conn) => {
    if(err){
      if(conn){
        conn.release(); // 반드시 해체해야 합니다.
      }
      callback(err,null);
      return;
    }
    console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);

    //데이터를 객체로 만듭니다.
    const data = {id:id, name:name, age:age, pw:passwd};
    //sql
    const exec = conn.query('insert into users set ?', data, (err, result) => {
      conn.release(); //반드시 해제해야 합니다.
      console.log('실행 대상 sql: ' + exec.sql);

      if(err) {
        console.log('SQL 실행 시 오류 발생함.');
        console.dir(err);
        callback(err, null);
        return;
      }
      callback(null, result);
    })
  });
}

//사용자 추가 라우팅 함수
router.route('/process/adduser').post((req,res) => {
  console.log('/process/adduser Call!!!');

  const paramId = req.body.id || req.query.id;
  const paramPw = req.body.pw || req.query.pw;
  const paramName = req.body.name || req.query.name;
  const paramAge = req.body.age || req.query.age;

  console.log('요청 파라미터 : '+paramId+' , '+paramPw+' , '+paramName+' , '+paramAge);

  //pool 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
  if(pool){
    addUser(paramId, paramName, paramAge, paramPw, (err, result) => {
      if (err) {//동일한 id로 추가할 때 오류 발생- 클라이언트로 오류 전송
        console.log('사용자 추가 중 오류 발생 : ', err.stack);
        res.writeHead( '200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 추가 중 오류 발생</h1>');
        res.write('<a href="/process/adduser">회원가입</a><br>');
        res.write('<a href="/process/login">로그인</a>');
        res.write('<p>'+ err.stack +'</p>');
        res.end();
        return;
      }

      if(result) {
        console.dir(result);
        console.log('inserted '+result.affectedRows+' rows');
        const insertId = result.insertId;
        console.log('추가한 레코드의 아이디 : ', insertId);

        res.writeHead( '200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 추가 성공</h1>');
        res.write('<a href="/process/adduser">회원가입</a><br>');
        res.write('<a href="/process/login">로그인</a>');
        res.end();
      } else {
        res.writeHead( '200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 추가 실패</h1>');
        res.write('<a href="/process/adduser">회원가입</a><br>');
        res.write('<a href="/process/login">로그인</a>');
        res.end();
      }
    });
  } else {
    res.writeHead( '200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h1>데이터베이스 연결 실패</h1>');
    res.end();
  }
});

app.use('/', router);

http.createServer(app).listen(app.get('port'), () => {
  console.log('Running!!', app.get('port'));
})
