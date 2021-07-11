let dataLoader = require('../utils/data-loader')
const path = require('path')
global.appRoot = path.resolve('./')
test('test loadSymbolData()', () => {
    let symbolObj=dataLoader.loadSymbolObject();
    expect('AAL' in symbolObj).toBe(true);
    expect('AAPL' in symbolObj).toBe(true);
    expect('BABA' in symbolObj).toBe(true);
    expect('BB' in symbolObj).toBe(true);
    expect('BYND' in symbolObj).toBe(true);
    expect('ESTC' in symbolObj).toBe(true);
    expect('FB' in symbolObj).toBe(true);
    expect('GOOGL' in symbolObj).toBe(true);
    expect('GME' in symbolObj).toBe(true);
    expect('NFLX' in symbolObj).toBe(true);
    expect('NIO' in symbolObj).toBe(true);
    expect('PLTR' in symbolObj).toBe(true);
    expect('PTON' in symbolObj).toBe(true);
    expect('TSLA' in symbolObj).toBe(true);
    expect('WORK' in symbolObj).toBe(true);
    expect('ZM' in symbolObj).toBe(true);
    expect(JSON.stringify(symbolObj['AAL'])).toBe(JSON.stringify({
        occurrence_count:0,
        total_post_score:0,
        flair:{}
    }))
});

test("test symbolArrayToObject()",()=>{
    let symbolObj=dataLoader.symbolArrayToObject(["AAPL","ESTC","ZM"]);
    expect('AAPL' in symbolObj).toBe(true);
    expect('ESTC' in symbolObj).toBe(true);
    expect('ZM' in symbolObj).toBe(true);
    symbolObj=dataLoader.symbolArrayToObject([]);
    expect(Object.keys(symbolObj).length).toBe(0)
})
