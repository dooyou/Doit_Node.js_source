module.exports = {
  server_port : 3000,
  databaseUrl : 'mongodb://localhost:27017/local',

  db_schemas : [
    {file:'./user_schema', collection:'users4', schemaName:'UserSchema', modelName:'UserModel'}
  ],

  route_info : [
    {file:'./user', path:'/process/login', method:'login', type:'post'},
    {file:'./user', path:'/process/adduser', method:'adduser', type:'post'},
    {file:'./user', path:'/process/listuser', method:'listuser', type:'post'}
  ]

}
