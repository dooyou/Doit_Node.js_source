const FacebookStrategy = require('passport-facebook').Strategy;
const config = require('../config');

module.exports = function(app, passport) {
	return new FacebookStrategy({
    	clientID: config.facebook.clientID,
    	clientSecret: config.facebook.clientSecret,
    	callbackURL: config.facebook.callbackURL
      ,profileFields: ['id','emails','displayName'] // 수집할 데이터컬럼명
			//,passReqToCallback : true
			//,enableProof: true

	}, function(accessToken, refreshToken, profile, done) {
		console.log('passport의 facebook 호출됨.');

		//console.dir(profile);

		var options = {
		    criteria: { 'facebook.id' : profile.id }
		};

		var database = app.get('database');
	    database.UserModel.findOne(options, function (err, user) {
			if (err) return done(err);

			if (!user) {
				var user = new database.UserModel({
					name: profile.displayName,
			    email: profile.emails[0].value,
			    provider: 'facebook',
					//authToken: accessToken,
			    facebook: profile._json
				});

				user.save(function (err) {
					if (err){console.log('Err : '+err);}
					return done(err, user);
				});
			} else {
				return done(err, user);
			}
	    });
	});
};
