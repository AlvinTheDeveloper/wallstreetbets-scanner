const fs = require("fs")
const symbolsObj=require('../index')()
fs.writeFileSync('output.json',JSON.stringify(symbolsObj,null,2))
