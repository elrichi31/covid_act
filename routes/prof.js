const csv = require('csv-parser')
const fs = require('fs');
const flags = require('../flags.json')
function getData (){
    const results = []
    fs.createReadStream(`../country_data/Ecuador.csv`)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () =>{
                console.log(flags)
                const data1 = {
                    country: results[0].location,
                    date: results.map(function(result){
                        return result.date
                    }),
                    vaccine: results.map(function(result){
                        return result.vaccine
                    }),
                    total_vaccinations: results.map(function(result){
                        return result.total_vaccinations
                    }),
                    people_vaccinated: results.map(function(result){
                        return result.people_vaccinated
                    }),
                    people_fully_vaccinated: results.map(function(result){
                        return result.people_fully_vaccinated
                    }),
                } 
                console.log(data1)
            });
    return results
}
function swap(json){
    var ret = {};
    for(var key in json){
      ret[json[key]] = key;
    }
    console.log(ret);
}
let result = []
for(var i in flags){
    result.push(i, flags[i])
}
iter = 0
let resultCont = []
let resultCode = []
for(var k in result){
    if(k % 2 === 0){
        resultCont.push(result[k])
    }
    else if (k % 1 === 0) {
        resultCode.push(result[k])
    }
}
console.log(iter)
console.log(result[125])
console.log(resultCont)
console.log(resultCode.length)

