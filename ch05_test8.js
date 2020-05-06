const http = require('http');

const opts = {
  host:'www.google.com',
  port:80,
  method:'POST',
  path:'/',
  headers:{}
};

let resData = '';
const req = http.request(opts, (res) => {
  //응답 처리
  res.on('data', (chunk) => {
    resData += chunk;
  });
  res.on('end', () => {
    console.log(resData);
  });
});

opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
req.data = 'q=actor';
opts.headers['Content-Length'] = req.data.length;

req.on('error', (err) => {
  console.log('오류발생 : ', err.message);
});

//요청 전송
req.write(req.data);
req.end();
