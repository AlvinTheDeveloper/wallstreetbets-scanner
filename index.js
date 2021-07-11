
const path = require('path');
const axios = require('axios');
const URL = require('url').URL;
let dataLoader = require('./utils/data-loader')
global.appRoot = path.resolve(__dirname);


let childrenArr=[]
let symbolsObj={}

const defaultOptions={
    pages:100,
    retryOnError:true,
    retryTimes:3,
    retryAfter:3,
    hideIfNotMentioned:true,
    sortMethod:"hot",
    symbols:[]
}

/**
 * Assign default option value to options if property do not exist
 * @param options
 * @returns {*}
 */
function setDefaultOptions(options){
    for(let key in defaultOptions){
        if(options[key]===null||options[key]===undefined){
            options[key]=defaultOptions[key]
        }
    }
    return options
}

module.exports = async (options={})=>{
    options=setDefaultOptions(options)
    let url = new URL(`https://www.reddit.com/r/wallstreetbets/${options.sortMethod}.json`);

    if(Object.keys(symbolsObj).length === 0){
        if(options.symbols.length>0){
            symbolsObj=dataLoader.symbolArrayToObject(options.symbols)
        }else{
            symbolsObj=dataLoader.loadSymbolObject()
        }
    }

    console.log('Running API calls')

    for(let i=0;i<options.pages;i++){
        let retry=0
        let callAPI=async ()=>{
            try{
                console.log(`Fetching page ${i+1} data`)
                return await axios.get(url.toString())
            }catch (e){
                if(options.retryOnError&&retry<options.retryTimes){
                    retry+=1
                    console.error(e)
                    console.log("Retry after 3 seconds")
                    return await new Promise(resolve => {
                        setTimeout(async()=>{
                            resolve(await callAPI())
                        },options.retryAfter)
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

    if(options.hideIfNotMentioned){
        for(let s in symbolsObj){
            if(symbolsObj[s].occurrence_count<=0){
                delete symbolsObj[s]
            }
        }
    }
    return symbolsObj
}
