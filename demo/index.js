const fs = require("fs")
const wsbScanner=require('../index')


wsbScanner({
    pages:10,
    retryOnError:true,
    retryTimes:3,
    retryAfter:3, //A non-negative decimal integer indicating the seconds to wait on error occurs
    hideIfNotMentioned:true
})
    .then(data=>{
        fs.writeFileSync('output.json',JSON.stringify(data,null,2))
    })
