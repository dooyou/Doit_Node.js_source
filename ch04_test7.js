const fs = require('fs');

//파일을 비동기식 IO로 쓰기
fs.writeFile('./output.txt', 'Hello World', (err) => {
  if (err) {
    console.log('Error : ', err);
  }
  console.log('output.txt 파일에 데이터 쓰기 완료.');
});
