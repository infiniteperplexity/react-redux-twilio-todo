var marklogic = require('marklogic');
var db = marklogic.createDatabaseClient({
      host: 'localhost', 
      port: '8000', 
      user: 'admin', 
      password: 'admin', 
      authType: 'DIGEST'
});
console.log(db);

db.documents.write({
  uri: '/afternoon-drink',
  contentType: 'application/json',
  content: {
    name: 'Iced Mocha',
    size: 'Grand',
    tasty: true
  }
}).result(function(response) {
  console.log(JSON.stringify(response, null, 2));
});