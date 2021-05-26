const request= require('request');
const cheerio= require('cheerio');

const getmatchdetails= require('./match');

function allmatch(link){
    request(link , function(error, res, data){
        processdata(data);
    })
  //  console.log(link);
}

function processdata(html){
    let ch= cheerio.load(html+"");
    let allatags= ch('a[data-hover="Scorecard"]');
   // console.log(allatags.length);
   for(let i=0;i<allatags.length;i++){
       let matchlink= "https://espncricinfo.com"+ ch(allatags[i]).attr('href');
      // console.log(matchlink);
      getmatchdetails(matchlink)
   }
}

// module.exports is a initially expmty object , used to send data to anothes js files
module.exports= allmatch;

//a[data-hover="Scorecard"]