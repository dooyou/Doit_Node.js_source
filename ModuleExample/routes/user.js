//////////////////////////////////////////////////
/// 로그인 login
const login = (req, res) => {
  console.log('user 모듈 안에 있는 login 호출됨.');
  const database = req.app.get('database');

  const paramId = req.body.id || req.query.id;
  const paramPw = req.body.password || req.query.password;

  if(database) {
    authUser(database, paramId, paramPw, (err, docs) => {
      if(err) throw err;

      if(docs){
        console.dir(docs);
        const username = docs[0].name;
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>사용자 아이디 : '+paramId+'</p></div>');
        res.write('<div><p>사용자 이름 : '+username+'</p></div>');
        res.write('<br><br><a href="/process/login">다시 로그인하기</a>');
        res.end();
      } else {
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>로그인 실패</h1>');
        res.write('<div><p>아이디와 비밀번호를 다시 확인하십시오.</p></div>');
        res.write('<br><br><a href="/process/login">다시 로그인하기</a>');
        res.end();
      }
    });

  } else {
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h1>데이터베이스 연결 실패</h1>');
    res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
    res.end();
  }
}//END login

//////////////////////////////////////////////////
/// 사용자 인증 함수 auth User
const authUser = (database, id, password, callback) => {
  console.log('authUser 호출');

  //1. 아이디 사용해 검색
  database.UserModel.findById(id, (err, results) => {
    if(err){
      callback(err, null);
      return;
    }
     console.log('아이디 [%s] 사용자 검색 결과', id);
     //console.dir(results);

    if(results.length > 0){
      console.log('아이디 일치하는 사용자 찾음. ');

      //2. 비밀번호 확인 : 모델 인스턴스를 객체를 만들고 authenticate() 메소드 호출.
      const user = new database.UserModel({id:id});
      const authenticated = user.authenticate(password, results[0].salt,
      results[0].hashed_password);

      if(authenticated){
        console.log('비밀번호 일치함');
        callback(null, results);
      } else {
        console.log('비밀번호  일치하지 않음.');
        callback(null, null);
      }

    } else {
      console.log('아이디와 일치하는 사용자를 찾지 못함.');
      callback(null, null);
    }
  });
}//END authUser




//////////////////////////////////////////////////
/// 사용자추가  add User
const adduser = function(req, res){
  console.log('user(user2.js) 모듈 안에 있는 adduser 호출됨.');

  // 데이터베이스 객체 참조
  var database = req.app.get('database');

    const paramId = req.body.id || req.query.id;
    const paramPw = req.body.pw || req.query.pw;
    const paramNm = req.body.nm || req.query.nm;

    console.log('요청 파라미터 : '+paramId+' , '+paramPw+' , '+paramNm);

    //데이터베이스 객체가 초기화된 경우, addUser 함수 호출하여 사용자 추가
    if(database){
      addUser(database, paramId, paramPw, paramNm, (err, result) => {
        if(err) throw err;

        if(result) {
          console.dir(result);
          res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
          res.write('<h1>사용자 추가 성공</h1>');
          res.write('NAME : '+paramNm+', <br>ID : '+paramId+', <br>PW : '+paramPw+'<br>');
          res.write('<a href="/process/login">login</a><br>');
          res.write('<a href="/process/adduser">adduser</a>');
          res.end();
        } else {
          res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
          res.write('<h1>사용자 추가 실패</h1>');
          res.end();
        }

      });
    } else { //데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
      res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
      res.write('<h1>데이터베이스 연결 실패</h1>');
      res.end();
    }

}//END add user

const addUser = function(database, id, password, name, callback){
  console.log('user 모듈 안에 있는 adduser호출.');

  // UserModel의 인스턴스 생성
  const user = new database.UserModel({"id":id, "password":password, "name":name});

  //save()로 저장
  user.save((err)=>{
    if(err){
      callback(err, null);
      return;
    }
    console.log('사용자 데이터 추가함.');
    callback(null, user);
  });
}; //END addUser



//////////////////////////////////////////////////
/// 사용자 조회  list User

const listuser = function(req, res){
  console.log('user 모듈안에 있는 listuser 호출됨.');
  // 데이터베이스 객체 참조
	var database = req.app.get('database');

  //데이터베이스 객체가 초기화된 경우, findAll 메소드 호출
  if(database){
    //1. 모든 사용자 검색
    database.UserModel.findAll(function(err, results){
      //오류가 발생했을 때 클라이언트로 오류 전송
      if(err) {
        console.error('사용자 리스트 조회 중 오류 발생'+err.stack);
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 리스트 조회 중 오류 발생</h1>');
        res.write('<p>'+err.stack+'</p>');
        res.end();

        return ;
      }

      if(results){ // 결과 객체 있으면 리스트 전송
        console.log(results);
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 리스트 </h1>');
        res.write('<div><ul>');

        for(let i=0; i<results.length; i++){
          let curId = results[i]._doc.id;
          let curName = results[i]._doc.name;
          res.write('<li>#'+i+' : '+curId+' : '+curName+'</li>');
        }
        res.write('</ul></div>');
        res.write('<a href="/process/login">login</a><br>');
        res.write('<a href="/process/adduser">adduser</a>');
        res.end();
      } else { // 결과 객체 없으면 실패 응답 전송
        res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
        res.write('<h1>사용자 리스트 조회 실패</h1>');
        res.end();
      }
    });
  } else { // 데이터베이스 객체가 초기화되지 않았을 때 실패 응답 전송
    res.writeHead('200', {'Content-Type' : 'text/html;charset=utf8'});
    res.write('<h1>데이터베이스 연결 실패 실패</h1>');
    res.end();
  }

} //END listuser


module.exports.login = login;
module.exports.adduser = adduser;
module.exports.listuser = listuser;
