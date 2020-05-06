
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

exports.user = User;
