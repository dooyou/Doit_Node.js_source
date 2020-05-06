const fs = require('fs');
fs.mkdir('./docs', 0666, (err) =>{
  if(err) throw err;
  console.log('새로운 docs 폴더를 만들었습니다.');

  fs.rmdir('./docs', (err) => {
    if(err) throw err;
    console.log('새로운 docs 폴더를 삭제했습니다.');
  });
});
