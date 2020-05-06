const express = require('express');
const http = require('http');
const path = require('path');
const bodyParser = require('body-parser');
const pug = require('pug');

const app = express();
app.set('port', process.env.PORT || 3000);
// view engine setup
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')));

const router = express.Router();

router.get('/mission/memo', (req,res) => { 
  res.render('memo');
});

router.route('/mission/memo').post((req,res) => {
  console.log('/mission/memo 처리함.');
  const author = req.body.author;
  const rdate = req.body.rdate;
  console.log('rdate : ',rdate);
  const contents = req.body.contents;

  res.writeHead('200', {'Content-type' : 'text/html;charset=utf8'})
  res.write('<h1>메모가 저장되었습니다.</h1>');
  res.write('작성자 : '+author+',<br>시간 : '+rdate+'<br>내용 : '+contents);
  res.write('<p><a href="/mission/memo">다시작성</a></p>')
  res.end();

});

app.use('/', router);

http.createServer(app).listen(app.get('port'), () => {
  console.log('Mission 3, Running!', app.get('port'));
});
