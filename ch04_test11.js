// output.txt.파일의 내용을 읽어 들인 후 output2.txt파일로 쓰는 코드
const fs = require('fs');
const infile = fs.createReadStream('./output.txt', {flags:'r'});
const outfile = fs.createWriteStream('./output2.txt', {flags:'w'});

infile.on('data', (data) => {
  console.log('읽어 들인 데이터 : ', data.toString('utf8'));
  outfile.write(data);
});

infile.on('end', () => {
  console.log('파일 읽기 종료.');
  outfile.end(() => {
    console.log('파일 쓰기 종료.');
  });
});
