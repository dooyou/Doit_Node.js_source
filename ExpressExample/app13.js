const express = require('express');
const http = require('http');
const path = require('path');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const errorhandler = require('errorhandler');
const expressErrorHandler = require('express-error-handler');
const expressSession = require('express-session');

const multer = require('multer');
const fs = require('fs');
const cors = require('cors');

// 익스프레스 개체 생성
const app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 3000);
// body-parser를 사용해 application/x=www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }));
// body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());
app.use('/public', express.static(path.join(__dirname,'public')));
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

app.use(cookieParser());
app.use(expressSession({
  secret:'my key',
  resave:true,
  saveUninitialized:true
}));
//클라이언트에서 ajax로 요청했을 때 cors(다중 서버 접속) 지원
app.use(cors());

//multer 미들웨어 사용 : 미들웨어 사용 순서 중요 body-parser-> multer -> Router
//파일 제한 :10개, 1G
const storage = multer.diskStorage({
  destination : (req, file, callback) => {
    callback(null, 'uploads')
  },
  filename : (req, file, callback) => {
    callback(null, file.originalname + Date.now())
  }
});

const upload = multer({
  storage:storage,
  limits:{
    files : 10,
    fileSize : 1024*1024*1024
  }
});


// 라우터 객체 참조 = 라우터 사용하여 라우팅 함수 등록
const router = express.Router();

// 상품정보 라우팅 함수
router.route('/process/photo').post(upload.array('photo',1) , (req,res) => {
  console.log('/process/photo 호출됨.');

  try{
    const files = req.files;

    console.log('-------업로드 된 첫번째 파일 정보-------');
    console.dir(req.files[0]);
    console.log('--------');

    //현재의 파일 정보를 저장할 변수 선언
    let originalname = '',
    filename = '',
    mimetype = '',
    size = 0;

    if(Array.isArray(files)) { // 배열에 들ㅇ가 있는 경우 (설정에서 1개의 파일도 배열에 넣ㄱ 했음)
      console.log('배열에 들어있는 파일 갯수 : %d', files.length);

      for(let index=0; index<files.length; index++){
        originalname = files[index].originalname;
        filename = files[index].filename;
        mimetype = files[index].mimetype;
        size =  files[index].size;
      }
    } else { // 배열에 들어가 있지 않은 경우(현재설정에서는 해당 없음)
      console.log('파일 갯수 : 1');

      originalname = files[index].originalname;
      filename = files[index].name;
      mimetype = files[index].mimetype;
      size =  files[index].size;
    }

    console.log('현재 파일 정보 : ',originalname,',',filename,',',mimetype,',',size);

    //클라이언트에 응답 전송
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h1>파일 업로드 성공</h1>');
    res.write('<hr/>');
    res.write('<div><p>원본파일 이름 : '+originalname+' -> 저장 파일명 : '+filename+'</p></div>');
    res.write('<div><p>mimetype : '+mimetype+'</p></div>');
    res.write('<div><p>파일크기 : '+size+'</p></div>');
    res.write('<br><br><a href="/public/photo.html">photo.html이동하기</a>');
    res.end();

  } catch(err) {
    console.dir(err.stack);
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
  console.log('app13 익스프레스 서버를 시작 :', app.get('port'));
});
