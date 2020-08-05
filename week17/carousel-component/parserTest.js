var parser = require('./parser')

var res = parser.parseHTML(`
<script>a</script>
`)

console.log(res)