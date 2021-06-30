const fs = require('fs')
const parse = require('csv-parse/lib/sync')

function loadSymbolObject(){
    let symbolObj={}
    let nasdaqRawData = fs.readFileSync('data/symbols/nasdaq.txt')
    let otherListedRawData = fs.readFileSync('data/symbols/otherlisted.txt') // NYSE and other exchanges
    const nasdaqData = parse(nasdaqRawData, {
        delimiter: "|",
        trim: true
    })
    const otherListedData = parse(otherListedRawData,{
        delimiter: "|",
        trim: true
    })

    // We set i=1 because we have to skip the header
    for(let i=1;i<nasdaqData.length;i++){
        symbolObj[nasdaqData[i][0]]={
            occurrence_count:0,
            total_post_score:0,
            flair:{}
        }
    }
    for(let i=1; i<otherListedData.length;i++){
        symbolObj[otherListedData[i][0]]={
            occurrence_count:0,
            total_post_score:0,
            flair:{}
        }
    }

    return symbolObj
}

module.exports={
    loadSymbolObject
}
