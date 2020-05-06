const animal = require('./user_animal');

function showAnimal() {
  return animal.getUser().name +', '+ animal.group.name;
}

console.log(' 사용자 정보 : %s', showAnimal());
