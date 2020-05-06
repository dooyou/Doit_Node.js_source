module.exports  = () => {
    return {id:'test01', name:'강아지'};
  };

// module.exports에는 자바스크립트객체만 할당할 수 있을까요?
// 함수도 객체이므로 함수만 할당할 수 도 있습니다.

// 익명함수를 만들어 module.exports에 할당합니다.
// 익명 함수에 들어 있는 코드는 앞에서 만든 getUser() 함수의 코드와 같습니다.
