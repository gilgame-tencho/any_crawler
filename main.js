const https = require('https');
const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');
require('date-utils');
const conf_file = path.join(__dirname, 'conf', 'conf.yml');
const conf = yaml.load(fs.readFileSync(conf_file), 'utf-8');
const log_dir = path.join(__dirname, 'data');

let d1 = new Date(Date.UTC(2022, 0, 1));
let d1_last = new Date(Date.UTC(2023, 0, 1));
// console.log(d1.toFormat("YYYY-MM-DD"));
// console.log(d1.add({"days": 1}).toFormat("YYYY-MM-DD"));
// console.log(Date.compare(d1, d1_last));

const param = {
  children : conf.children,
  classid : conf.classid,
};

// ###  common ##################################################

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

// ###  main   ##################################################

var request = require('request');

var headers = {
  'Content-Type':'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'cookie':conf.cookie,
}

// craw param
let day = new Date(Date.UTC(2023, 3 - 1, 20));
let max = 12;

for(let i=0; i<max; i++){
    setTimeout(() => {
        let child = 'hii';
        let classid = 'hina';
        let dt = day.toFormat("YYYY-MM-DD");
        let url = 
          conf.base.url_base +
          `${conf.url_function.children}${param.children[child]}/` +
          `${conf.url_function.classid}${param.classid[`${child}_${classid}`]}/` +
          `${conf.url_function.photo}${dt}`;

        let options = {
          url: url,
          method: 'GET',
          headers: headers,
        }
        request(options, function (error, response, body) {
            console.log(`  ## try: ${i} -- ${url}`);
            if (body.indexOf(conf.html_tags.search_key) > 0 ){
                let top = body.indexOf(conf.html_tags.top);
                let bottom = body.indexOf(conf.html_tags.bottom);
                let view = body.substr(top, bottom - top);
                console.log(view);

                let file_name = `craw_${child}_${classroom}_${dt}.txt`;
                let file_path = path.join(log_dir, file_name);
                fs.writeFile(file_path, view, (err) => {
                    if(err) throw err;
                });
            }else{
                console.log('not images.');
                // console.log(body);
            }
        });
        day.add({"days": 1});
    }, 1000 * i + getRandomInt(1000), 'funky');
}
