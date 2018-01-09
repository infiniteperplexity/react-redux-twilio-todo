const marklogic = require('marklogic');
console.dir(marklogic);


curl -X POST  --anyauth -u admin:admin --header "Content-Type:application/json" -d '{"user-name":"writer", "password": "nodetut", "role": [ "rest-writer" ] }' http://localhost:8002/manage/v2/users