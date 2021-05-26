const request= require('request');
const cheerio= require('cheerio');
const allmatch= require("./allmatch");
request('https://www.espncricinfo.com/series/ipl-2020-21-1210595', function(error, res, data){
    processData(data);
})

function processData(html){
    let ch= cheerio.load(html);
    let atag= ch('.widget-items.cta-link a');
  //  console.log(atag);
    let allmatchlink = "https://espncricinfo.com"+atag.attr('href');
    //console.log(allmatchlink);
    allmatch(allmatchlink);
}


