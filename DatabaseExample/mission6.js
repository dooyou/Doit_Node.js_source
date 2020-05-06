const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const pug = require('pug');

const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

const mysql = require('mysql');

const app = express();
app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads',express.static(path.join(__dirname,'uploads')));
app.use(cors());

// DB연결정보
const pool = mysql.createPool({
  host:'adidas03315.cafe24.com',
  user:'adidas03315',
  password:'milkymilky87*',
  database:'adidas03315',
  port:'3306',
  debug:false;
});


const storage = multer.diskStorage({
  destination : (req, file, callback) => {
    callback(null, 'uploads')
  },
  filename : (req, file, callback) => {
    callback(null, file.originalname + Date.now())
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    callback(null, basename + Date.now() + extension);
  }
});

const upload = multer({
  storage:storage,
  limits:{
    files : 10,
    fileSize : 1024*1024*1024
  }
});

const router = express.Router();

router.get('/mission/memo', (req,res) => {
  res.render('memo6');
});

router.route('/mission/memo').post(upload.array('photo',1) ,(req,res) => {
  console.log('/mission/memo Call!! post.');
  try{
    const author = req.body.author || req.query.author;
    const rdate = req.body.rdate || req.query.rdate;
    const contents = req.body.contents || req.query.contents;
    const files = req.files;

    console.log('-------업로드 된 첫번째 파일 정보-------');
    console.dir(req.files[0]);
    console.log('--------');

    //현재의 파일 정보를 저장할 변수 선언
    let originalname = '',
    filename = '',
    mimetype = '',
    path1 = '',
    size = 0;

    if(Array.isArray(files)) { // 배열에 들ㅇ가 있는 경우 (설정에서 1개의 파일도 배열에 넣ㄱ 했음)
      console.log('배열에 들어있는 파일 갯수 : %d', files.length);

      for(let index=0; index<files.length; index++){
        originalname = files[index].originalname;
        filename = files[index].filename;
        mimetype = files[index].mimetype;
        path1 = files[index].path;
        size =  files[index].size;
      }
    } else { // 배열에 들어가 있지 않은 경우(현재설정에서는 해당 없음)
      console.log('파일 갯수 : 1');

      originalname = files[index].originalname;
      filename = files[index].name;
      mimetype = files[index].mimetype;
      path1 = files[index].path;
      size =  files[index].size;
    }

    const pathpath = path.dirname(path1);

    console.log('현재 파일 정보 : ',originalname,', ',filename,', ',mimetype,', ',pathpath,', ',size);



    //클라이언트에 응답 전송
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h1>메모가 저장되었습니다</h1>');
    res.write('<hr/>');
    res.write('작성자 : '+author+',<br>시간 : '+rdate+'<br>내용 : '+contents);
    res.write('<img src=/'+pathpath+'/'+filename+' width="100%">');
    res.write('<div><p>원본파일 이름 : '+originalname+' -> 저장 파일명 : '+filename+'</p></div>');
    res.write('<div><p>mimetype : '+mimetype+'</p></div>');
    res.write('<div><p>파일크기 : '+size+'</p></div>');

    res.write('<p><a href="/mission/memo6">다시작성</a></p>')
    res.end();

  } catch(err) {
    console.dir(err.stack);
  }
});


app.use('/', router);

http.createServer(app).listen(app.get('port'), () => {
  console.log('Mission 3, Running!', app.get('port'));
});
