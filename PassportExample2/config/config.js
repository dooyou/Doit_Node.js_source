module.exports = {
  server_port : 3000,
  databaseUrl : 'mongodb://localhost:27017/local',
  db_schemas : [
    {file:'./user_schema', collection:'users6', schemaName:'UserSchema', modelName:'UserModel'}
  ],

  route_info : [
  ],
  google: {		// passport google
		clientID: 'scenic-scholar-274219',
		clientSecret: '417478895354',
		callbackURL: '/auth/google/callback'
	},
  facebook: {		// passport facebook
		clientID: '589367341674459',
		clientSecret: '070048bd1909fb80415594dc7c26ca32',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
	}
}
