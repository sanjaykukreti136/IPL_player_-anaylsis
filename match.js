const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const xlsx = require("xlsx");

function getmatchdetails(link) {
    request(link, function (error, res, data) {
        processdata(data);
    })
}
function processdata(html) {
    let ch = cheerio.load(html + "");
    let bini = ch('.Collapsible');
    for (let i = 0; i < bini.length; i++) {
        let teamname = ch(bini[i]).find("h5").text();
        teamname = teamname.split('INNINGS')[0].trim();
        console.log(teamname);
        let alltrs = ch(bini[i]).find('.table.batsman tbody tr');
        console.log(alltrs.length);
        for (let j = 0; j < alltrs.length - 1; j++) {
            console.log('calra');
            let alltds = ch(alltrs[j]).find("td");
            console.log(alltds.length);
            if (alltds.length > 1) {
                console.log("ye bhi");
                let bname = ch(alltds[0]).find("a").text().trim();
                let run = ch(alltds[2]).text().trim();
                let ball = ch(alltds[3]).text().trim();
                let four = ch(alltds[5]).text().trim();
                let six = ch(alltds[6]).text().trim();
                //console.log(`batsman = ${bname}  run = ${run} ball = ${ball} four = ${four} six = ${six} `);
                processDetails(teamname, bname, run, ball, four, six);
            }
        }

        // console.log("####################");
    }
}

function checkbfile(tname, bname) {
    let t = `./IPL/${tname}/${bname}/${bname}.json`;
    console.log(fs.existsSync(t));
    return fs.existsSync(t);
}

function checkteamfolder(tname) {
    console.log("team folder");
    let t = `./IPL/${tname}`;
    return fs.existsSync(t);
}
function checkbfolder(tname, bname) {
    console.log("check batsman folder");
    let b = `./IPL/${tname}/${bname}`;
    return fs.existsSync(b);
}
function createtfolder(tname) {
    console.log("c t f");
    let t = `./IPL/${tname}`;
    fs.mkdirSync(t);
    console.log("folder created");
}
function createbfile(tname, bname, run, ball, four, six) {
    console.log("cre b file");
    let btfile = [];
    let inig = {
        Name: bname,
        Run: run,
        Balls: ball,
        Fours: four,
        Sixes: six
    }
    btfile.push(inig);
    let b = `./IPL/${tname}/${bname}/${bname}.json`;
    fs.writeFileSync(b, JSON.stringify(btfile));

    //    fs.unlinkSync(`./IPL/${tname}/${bname}/${bname}.json`);

}

function updateb(tname, bname, run, ball, four, six) {
    let b = `./IPL/${tname}/${bname}/${bname}.json`;
    let x = fs.readFileSync(b);
    x = JSON.parse(x);
    let inig = {
        Name: bname,
        Run: run,
        Balls: ball,
        Fours: four,
        Sixes: six
    }
    x.push(inig);
    fs.writeFileSync(b, JSON.stringify(x));

    let content = JSON.parse(fs.readFileSync(`./IPL/${tname}/${bname}/${bname}.json`, "utf-8"));
    let newWB = xlsx.utils.book_new();
    let newWS = xlsx.utils.json_to_sheet(content);
    xlsx.utils.book_append_sheet(newWB, newWS, "shubham");
    xlsx.writeFile(newWB, `./IPL/${tname}/${bname}/${bname}.xlsx`);
}
function createbfolder(team, bat) {
    console.log("batsman folder");
    let t = `./IPL/${team}/${bat}`;
    fs.mkdirSync(t);
}
function processDetails(tname, bname, run, ball, four, six) {
    if (checkteamfolder(tname)) {
        if (checkbfolder(tname, bname)) {
            if (checkbfile(tname, bname)) {
                updateb(tname, bname, run, ball, four, six);
            }
            else {
                createbfile(tname, bname, run, ball, four, six)
            }
        }
        else {
            createbfolder(tname, bname);
            createbfile(tname, bname, run, ball, four, six)
        }
    }
    else {
        createtfolder(tname);
        createbfolder(tname, bname);
        createbfile(tname, bname, run, ball, four, six)
    }
}


module.exports = getmatchdetails;