const fs = require('fs');

//파일을 동기식 IO로 읽기
const data = fs.readFileSync('./package.json', 'utf8');

console.log(data);
