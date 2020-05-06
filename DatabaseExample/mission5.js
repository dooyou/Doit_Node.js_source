const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const pug = require('pug');
const mysql = require('mysql');

const app = express();
app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

const router = express.Router();
// DB연결 정보
const pool = mysql.createPool({
  host:'.cafe24.com',
  user:'',
  password:'',
  database : '',
  port:'3306',
  debug : false
});

router.get('/mission/memo', (req,res) => {
  res.render('memo5');
});

// 메모 추가 함수
const addMemo  = (author, rdate, contents, callback) => {
  console.log('addMemo 메모 추가 함수!!');
  pool.getConnection((err, conn) =>{
    if(err){
      if(conn){
        conn.release(); //반드시 해제
      }
      callback(err, null);
      return;
    }
    console.log('데이터베이스 연결 스레드 아이디 : ', conn.threadId);

    //데이터를 객체로
    const data = {author:author, rdate:rdate, contents:contents};

    //sql
    const exec = conn.query('insert into memo set ?', data, (err, result) => {
      conn.release(); //반드시 해제
      console.log('실행 sql : ', exec.sql);

      if(err){
        console.log('sql 실행시 오류');
        console.dir(err);
        callback(err, null);
        return;
      }
      callback(null, result);
    })
  });// END pool.getConnection
}; // END addMemo

router.route('/mission/memo').post((req,res) => {
  console.log('/mission/memo5 call!! post.');
  const author = req.body.author || req.query.author;
  const rdate = req.body.rdate || req.query.rdate;
  const contents = req.body.contents || req.query.contents;
  console.log('요청 param : ',author+' , '+rdate+' , '+contents);

  //객체가 초기화된 경우, addMemo 함수 호출하여 추가
  if(pool){
    addMemo(author, rdate, contents, (err, result) => {
      if(err){
        console.log('메모 추가 오류 발생.', err.stack);
        res.writeHead('200', {'Content-type' : 'text/html;charset=utf8'})
        res.write('<h1>메모 추가 오류 발생.</h1>');
        res.write('<p><a href="/mission/memo">다시작성</a></p>')
        res.write('<p>'+ err.stack +'</p>');
        res.end();
        return;
      }

      if(result){
        console.log(result);
        console.log('inserted '+result.affectedRows+' rows');
        const insertId = result.insertId;
        console.log('추가한 레코드 : ', insertId);
        res.writeHead('200', {'Content-type' : 'text/html;charset=utf8'})
        res.write('<h1>메모가 저장되었습니다.</h1>');
        res.write('작성자 : '+author+',<br>시간 : '+rdate+'<br>내용 : '+contents);
        res.write('<p><a href="/mission/memo">다시작성</a></p>')
        res.end();

      } else {
        res.writeHead('200', {'Content-type' : 'text/html;charset=utf8'})
        res.write('<h1>저자하지 못했습니다.</h1>');
        res.write('<p><a href="/mission/memo">다시작성</a></p>')
        res.end();
      }
    })
  }// END if pool





});// END router.route /mission/memo

app.use('/', router);

http.createServer(app).listen(app.get('port'), () => {
  console.log('Mission 5, Running!', app.get('port'));
});
