module.exports = function(router, passport) {
  console.log('user_passport call!!!');

  // 홈 화면
  router.route('/').get(function(req, res) {
      console.log('/ 패스 요청됨.');

      console.log('req.user의 정보');
      console.dir(req.user);

      // 인증 안된 경우
      if (!req.user) {
          console.log('사용자 인증 안된 상태임.');
          res.render('index', {login_success:false});
      } else {
          console.log('사용자 인증된 상태임.');
          res.render('index', {login_success:true});
      }
  });

  // 로그인 화면
  router.route('/login').get(function(req, res) {
    console.log('/login 패스 요청 됨');
  	res.render('login', {message: req.flash('loginMessage')});
  });
  // 사용자 인증 - POST로 요청받으면 패스포트를 이용해 인증함
  // 성공 시 /profile로 리다이렉트, 실패 시 /login으로 리다이렉트함
  // 인증 실패 시 검증 콜백에서 설정한 플래시 메시지가 응답 페이지에 전달되도록 함
  router.route('/login').post(passport.authenticate('local-login', {
    successRedirect : '/profile',
    failureRedirect : '/login',
    failureFlash : true
  }));


  // 회원가입 화면
  router.route('/signup').get(function(req, res) {
  	console.log('/signup 패스 요청됨.');
  	res.render('signup', {message: req.flash('signupMessage')});
  });

  // 회원가입 - POST로 요청받으면 패스포트를 이용해 회원가입 유도함
  // 인증 확인 후, 성공 시 /profile 리다이렉트, 실패 시 /signup으로 리다이렉트함
  // 인증 실패 시 검증 콜백에서 설정한 플래시 메시지가 응답 페이지에 전달되도록 함
  router.route('/signup').post(passport.authenticate('local-signup', {
      successRedirect : '/profile',
      failureRedirect : '/signup',
      failureFlash : true
  }));

  // 프로필 화면 - 로그인 여부를 확인할 수 있도록 먼저 isLoggedIn 미들웨어 실행
  router.route('/profile').get(function(req, res) {
  	console.log('/profile 패스 요청됨.');

    // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
    console.log('req.user 객체의 값');
  	console.dir(req.user);

      // 인증 안된 경우
      if (!req.user) {
          console.log('사용자 인증 안된 상태임.');
          res.redirect('/');
          return;
      }

      // 인증된 경우
      console.log('사용자 인증된 상태임.');
    	if (Array.isArray(req.user)) {
    		res.render('profile', {user: req.user[0]._doc});
    	} else {
    		res.render('profile', {user: req.user});
    	}
  });

  // 로그아웃 - 로그아웃 요청 시 req.logout() 호출함
  router.route('/logout').get(function(req, res) {
  	console.log('/logout 패스 요청됨.');

  	req.logout();
  	res.redirect('/');
  });

  // 패스포트 - google 인증 라우팅
  router.route('/auth/google').get(passport.authenticate('google', {
      scope : 'email'
  }));

  // 패스포트 - google 인증 콜백 라우팅
  router.route('/auth/google/callback').get(passport.authenticate('google', {
      successRedirect : '/profile',
      failureRedirect : '/'
  }));

  // 패스포트 - facebook 인증 라우팅
  router.route('/auth/facebook').get(passport.authenticate('facebook', {
      scope :  'email'
  }));

  // 패스포트 - facebook 인증 콜백 라우팅
  router.route('/auth/facebook/callback').get(passport.authenticate('facebook', {
      successRedirect : '/profile',
      failureRedirect : '/'
  }));


}
