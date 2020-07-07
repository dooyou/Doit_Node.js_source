const local_login = require('./passport/local_login');
const local_signup = require('./passport/local_signup');
const google = require('./passport/google');
const facebook = require('./passport/facebook');

module.exports = function(app, passport){
  console.log('config/passport call!!');

  //사용자 인증에 성공했을 때 호출
  passport.serializeUser(function(user, done){
    console.log('serializeUser() 호출됨.');
    console.dir(user);
    done(null, user);
  });

  //사용자 인증 이후 사용자 요청이 있을 때마다 호출
  passport.deserializeUser(function(user, done){
    console.log('deserializeUser() 호출됨.');
    console.log(user);
    done(null, user);
  });

  passport.use('local-login', local_login);
  passport.use('local-signup', local_signup);
  passport.use('google', google(app, passport));
  passport.use('facebook', facebook(app, passport));
};
