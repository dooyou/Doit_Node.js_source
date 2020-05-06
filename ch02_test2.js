console.log('argv 속성의 파라미터 수', process.argv.length);
console.dir(process.argv)

process.argv.forEach((item, i) => {
  console.log(i,':',item);
});
