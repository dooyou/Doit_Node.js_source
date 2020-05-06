// output.txt.파일의 내용을 읽어 들인 후 output2.txt파일로 쓰는 코드
const fs = require('fs');
const inname = './output.txt';
const outname = './output2.txt';

fs.exists(outname, (exists) => {
  if (exists) {
    fs.unlink(outname, (err) => {
      if(err) throw err;
      console.log('기존파일 [', outname, '] 삭제함.' );
    });
  }
  const infile = fs.createReadStream(inname, {flags:'r'});
  const outfile = fs.createWriteStream(outname, {flags:'w'});
  infile.pipe(outfile);
  console.log('파일복사 [', inname, '] -> [', outname, ']' );
});
