var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(res)
  fs.writeFileSync('../server/public/hello.html', 'hello world');
  res.send('respond with a resource 321312');
});

module.exports = router;
