# wallstreetbets-scanner
#### The wallstreetbets-scanner collects statistical data from Reddit (r/wallstreetbets). It tells us how many times do symbols (e.g. TSLA) occurs in x times of API calls, and how many times do different types of flairs were tagged to the posts.

## Installation
### Install dependencies with npm
```
npm i wallstreetbets-scanner --save
```
### Or with yarn
```
yarn add wallstreetbets-scanner --save
```

## Example
```
const wsbScanner=require('wallstreetbets-scanner')

wsbScanner({
    pages:10,
    retryOnError:true,
    retryTimes:3,
    retryAfter:3, //A non-negative decimal integer indicating the seconds to wait on error occurs
    hideIfNotMentioned:true
})
    .then(data=>{
        console.log(data)
    })

```

## Sample output
```
{
"MVIS": {
    "occurrence_count": 1336,
        "flair": {
            "News": 85,
            "Discussion": 657,
            "Meme": 58,
            "Mods": 4,
            "Gain": 132,
            "DD": 126,
            "YOLO": 201,
            "Loss": 15,
            "Chart": 18,
            "Daily Discussion": 3
        }
    }
}


```

## Options
| Option name        |    Type | Description                                                                                                                             | Default value |
|--------------------|--------:|-----------------------------------------------------------------------------------------------------------------------------------------|---------------|
| pages              | number  | Number of page the scanner is going to fetch.                                                                                           | 100           |
| retryOnError       | boolean | If "retryOnError" is set to "true", the scanner will call the API again if an error occurs. If will not retryOnError is set to "false". | true          |
| retryTimes         | number  | Maximum attempt to re-run the API call on error occurs.                                                                                 | 3             |
| retryAfter         | number  | Number of seconds to wait for re-run the API call after error occurs.                                                                   | 3             |
| hideIfNotMentioned | boolean | Hide the result of a stock if occurrence_count=0.                                                                                       | true          |


