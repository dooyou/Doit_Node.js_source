
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

module.exports = new User('mugmug', '강이지');

// 자바스크립트에서는 함수를 생성자로 지정하여 객체를 정의하고,
// 그 객체를 사용해 인스턴스 객체를 만들 수 있습니다.
// 만약 User 객체를 만들고 싶다면 User라는 이름의 함수를 먼저 정의 합니다.

// 이 함수에는 id와 name 속성이 파라미터로 전달되며,
// 이 둘을 User객체의 속성으로 만들기 위해 다음 코드를 사용합니다.

// this.id = id;

// 이렇게 하면 전달받은 파라미터가 this 객체의 속성으로 추가됩니다.
// User 객체의 속성으로 함수나 값을 추가하려면 User.prototype 객체에
// 속성으로 추가하면 됩니다. 이렇게 정의한 User 객체에서 new 연산자를 사용하여
// 새로운 인스턴스 객체를 만든 후 module.exports에 직접 할당합니다.
// 이렇게 하면 모듈을 불러오는 쪽에서 인스턴스 객체를 바로 참조할 수 있습니다. 
