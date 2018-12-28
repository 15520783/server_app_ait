var server = require('./server');
var ds = server.dataSources.ait_data;
var lbTables = [
  'User', 
  'AccessToken', 
  'ACL', 
  'RoleMapping', 
  'Role',
  'news',
  'infomation',
  'job',
  'job_descrip',
  'job_require_job',
  'job_require_resume',
  'job_benifits',
  'descrip',
  'require_job',
  'require_resume',
  'benefits',
  ];
ds.automigrate(lbTables, function(er) {
  if (er) throw er;
  console.log('Loopback tables [' - lbTables - '] created in ', ds.adapter.name);
  ds.disconnect();
});