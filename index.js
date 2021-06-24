
const axios = require('axios');
const URL = require('url').URL;

const redditUrl = 'https://www.reddit.com/r/wallstreetbets/hot.json'

let url = new URL(redditUrl);
console.log(url.toString())

const MAX_API_CALL=100
let childrenArr=[]
let symbolsObj={}

module.exports = async ()=>{
    // The code below finds string in $SYMBOL(e.g. $GME) pattern. It is because Reddit users usually use $ following by the symbol code to represent a symbol.
    // Also, it store the JSON object to a variable to save time from making API calls again.
    console.log('Running API calls')
    let reg= new RegExp(/\$\b[^\d\W]+\b/g)
    for(let i=0;i<MAX_API_CALL;i++){
        let retry=0
        let callAPI=async ()=>{
            try{
                console.log(`Fetching page ${i+1} data`)
                return await axios.get(url.toString())
            }catch (e){
                if(retry<3){
                    retry+=1
                    console.error(e)
                    console.log("Retry after 3 seconds")
                    return await new Promise(resolve => {
                        setTimeout(async()=>{
                            resolve(await callAPI())
                        },3000)
                    })
                }else{
                    throw e
                }
            }
        }
        let res = await callAPI()
        childrenArr=childrenArr.concat(res.data.data.children)
        let symbolArr=[]
        for(let c of res.data.data.children){
            let symbolsFoundArr=c.data.selftext.match(reg)
            symbolsFoundArr=symbolsFoundArr?symbolsFoundArr:[]
            symbolArr=symbolArr.concat(symbolsFoundArr)
            symbolsFoundArr=c.data.title.match(reg)
            symbolsFoundArr=symbolsFoundArr?symbolsFoundArr:[]
            symbolArr=symbolArr.concat(symbolsFoundArr)
        }

        for(let sa of symbolArr){
            if(!symbolsObj[sa]){
                symbolsObj[sa.replace("$","").toUpperCase()]={
                    occurrence_count:0,
                    total_post_score:0,
                    flair:{}
                }
            }
        }

        if(res.data.data.after||res.data.data.after!==""){
            url.searchParams.set('after', res.data.data.after);
        }else{
            console.log('break '+res.data.data.after)
            break;
        }
    }

    //Right here, the program start counting data.
    console.log("Counting data")
    for(let c of childrenArr){
        for(let s in symbolsObj){
            let reg2= new RegExp(`\\$*\\b[${s}|${s.toLowerCase()}]\\b`,'g')

            if(c.data.selftext.match(reg2)||c.data.title.match(reg2)){ //If no string matches the regex pattern, the .match() will return null.
                symbolsObj[s].occurrence_count+=1
                symbolsObj[s].total_post_score += childrenArr["0"].data.score
                for(let flair of c.data.link_flair_richtext){
                    if(flair.e==="text"){
                        if(!symbolsObj[s].flair[flair.t]){
                            symbolsObj[s].flair[flair.t]=1
                        }else{
                            symbolsObj[s].flair[flair.t]+=1
                        }
                    }
                }
            }
        }
    }
    // console.log(JSON.stringify(symbolsObj,null,2))
    return symbolsObj
}
