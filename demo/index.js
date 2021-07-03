const fs = require("fs")
const wsbScanner=require('../index')


wsbScanner({
    pages:10,
    retryOnError:true,
    retryTimes:3,
    retryAfter:3,
    hideIfNotMentioned:true,
    sortMethod:"new",
    symbols:["XPEV"]
})
    .then(data=>{
        fs.writeFileSync('output.json',JSON.stringify(data,null,2))
    })
