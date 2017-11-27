const request = require('request');
const fs = require('fs');
const stringify = require('json-stringify-safe');

class GoogleApi {
    static getCompanyUrls(companies) {
        return new Promise((resolve, reject) => {
            let urls = [];            
            let name = '';

            const apiCB = (err, res, body) => {
                if (err) return reject(err);

                if (body) {
                    urls.push({name: name, domain: JSON.parse(body).items[0].link});
                }

                if (companies.length > 0) {
                    name = companies.shift();

                    let options = {
                        url: 'https://www.googleapis.com/customsearch/v1?key=AIzaSyBXGkVilmqEN0KSDAaQy1BlVVIA8r4nS6w&num=10&cx=009637816073108880163:nfsysoqnztc&q=' + name,
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }

                    request(options, apiCB);
                } else {
                    resolve(urls);
                } 
            }
            
            apiCB();
        });
    }
}

module.exports = GoogleApi;