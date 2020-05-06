
function User(id, name) {
  this.id = id;
  this.name = name;
}

User.prototype.getUser = () => {
  return  {id: this.id, name: this.name};
}

User.prototype.group =  {id: 'group1', name: '고양이'};

User.prototype.printUser = function() {
  console.log('user 이름 : %s, user ID : %s, group 이름 : %s', this.name, this.id, this.group.name);
}

module.exports = User;

//프로토타입 객체를 할당하는 코드 패턴
// User 객체를 새로 정의한 후 module.exports에 직접 할당합니다.
// 다시 말해, 앞에서 만든 User 객체로 인스턴스 객체를 만든 후
// module.exports에 할당하는 것이 아니라
// User 객체 자체를 module.exports에 할당합니다.

// 이렇게 하면 User 객체를 정의하는 부분만 별도의 모듈 파일로 분리할 수 있으니
// 다른 파일에서 필요할 때마다 직접 인스턴스 객체를 만들어 사용할 수 있다는 장점.
