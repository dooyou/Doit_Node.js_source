
function User(id, name) {
  this.id = id;
  this.name = name;
}

User.prototype.getUser = () => {
  return  {id: this.id, name: this.name};
}

User.prototype.group =  {id: 'group1', name: '고양이'};

User.prototype.printUser = function()  {
  console.log('user 이름 : %s, user ID : %s, group 이름 : %s', this.name, this.id, this.group.name);
}

exports.user = new User('mugmug', '강이지');

// 그런데 모듈을 만들 때 exports 객체의 속성으로 인스턴스 객체를 추가했다면
// 이 객체를 어떻게 사용할까요?
// 모듈의 속성으로 exports에 인스턴스 객체를 추가한 경우에는 모듈을
// 불러들이는 쪽에서 require() 메소드를호출한 후 반환되는 객체 속성으로
// 인스턴스 객체를 참조할 수 있습니다.
