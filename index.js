
const axios = require('axios');
const URL = require('url').URL;
let dataLoader = require('./utils/data-loader')
const redditUrl = 'https://www.reddit.com/r/wallstreetbets/hot.json'

let url = new URL(redditUrl);

const MAX_API_CALL=100
let childrenArr=[]
let symbolsObj={}

const defaultOptions={
    maxApiCall:MAX_API_CALL,
    retryOnError:true,
    retryTimes:3,
    retryAfter:3, //A non-negative decimal integer indicating the seconds to wait on error occurs
}

let symbolObj

module.exports = async (options={})=>{
    if(!symbolObj){
        symbolObj=dataLoader.loadSymbolObject()
    }
    // The code below finds string in $SYMBOL(e.g. $GME) pattern. It is because Reddit users usually use $ following by the symbol code to represent a symbol.
    // Also, it store the JSON object to a variable to save time from making API calls again.
    console.log('Running API calls')

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
            let reg= new RegExp(`\\b\\$*${s}\\b`,'gmi')
            if(c.data.selftext.toUpperCase().match(reg)||c.data.title.toUpperCase().match(reg)){//If no string matches the regex pattern, the .match() will return null.
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
    return symbolsObj
}
