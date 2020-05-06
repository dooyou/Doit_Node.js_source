const mongoose = require('mongoose');
//database 객체에 db, schema, model 모두 추가
var database = {};

database.init = (app, config) => {
  console.log('init() Call!!');
  connect(app, config);
}

//데이터베이스에 연결하고 응답 객체의 속성으로 db 객체 추가
function connect(app, config){
  console.log('connect() Call!!');

  mongoose.Promise = global.Promise;
  mongoose.set('useCreateIndex', true);
  mongoose.connect(config.databaseUrl, {useNewUrlParser: true, useUnifiedTopology: true });
  database = mongoose.connection;

  database.on('error', console.error.bind(console, 'mongoose connection error'));
  database.on('open', function(){
    console.log('데이터베이스에 연결되었습니다. : '+config.databaseUrl);
    // user 스키마 및 모델 객체 생성
    createSchema(app, config);
  });
  //database.db.on('disconnected', connect);

  //연결 끊어졌을 때 5초 후 재 연결
   database.on('disconnected', function(){
     console.log('연결이 끊어졌습니다. 다시 연결합니다.');
     setInterval(connect, 3000);
   });
}

//config에 정의한 스키마 및 모델 객체 생성
function createSchema(app, config){
  const schemaLen = config.db_schemas.length;
  console.log('설정에 정의된 스키마의 수 : %d', schemaLen);

  for(let i = 0; i < schemaLen; i++){
    let curItem = config.db_schemas[i];

    //모듈 파일에서 모듈 불러온 후 createSchema() 함수 호출하기
    var curSchema = require(curItem.file).createSchema(mongoose);
    console.log('%s 모듈을 불러들인 후 스키마 정의함, ', curItem.file);

    //User 모델 정의
    var curModel = mongoose.model(curItem.collection, curSchema);
    console.log('%s 컬렉션을 위해 모델 정의함.', curItem.collection);

    //database 객체에 속성으로 추가
    database[curItem.schemaName] = curSchema;
    database[curItem.modelName] = curModel;
    console.log('스키마 이름 [%s], 모델 이름 [%s]이 datbase 객체의 속성으로 추가됨.',
  curItem.schemaName, curItem.modelName);
  }

  app.set('database', database);
  console.log('database 객체가 app 객체의 속성으로 추가됨.');
}

// database 객체를 module.exports에 할당
module.exports = database;
