const url = require('url');
//주소 문자열을 URL 객체로 만들기
const curURL = url.parse('https://search.naver.com/search.naver?ie=utf8&where=nexearch&query=steve%20jobs');
// URL 객체를 주소 문자열로 만들기
const curStr = url.format(curURL);

console.log('주소 문자열 : %s', curStr);
console.dir(curURL);

// 요청 파라미터 구분하기
const querystring = require('querystring');
const param = querystring.parse(curURL.query);
console.log('요청 파라미터 중 query의 값 : %s', param.query);
console.log('원본 요청 파라미터 : %s', querystring.stringify(param));
