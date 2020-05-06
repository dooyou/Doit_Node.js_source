const user = require('./user5');

function showUser() {
  return user.getUser().name + ', '+user.group.name;
}

console.log(showUser());
