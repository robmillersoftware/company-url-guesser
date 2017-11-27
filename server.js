const express = require('express');
const path = require('path');
const GoogleApi = require('./google-api');

const stringify = require('json-stringify-safe');

//Set up express
const app = express();
const PORT = process.env.PORT || 5000;

//Currently, development will be set to true unless it recognizes the DYNO environment variable which is set on Heroku
const isDevelopment = process.env.DYNO ? false : true;

if (isDevelopment) {
  let cors = require('cors');
  app.use(cors());
}

//Set up static paths. This is pretty much only used to show the background so it's kind of silly
app.use(express.static(path.join(__dirname, 'build')));

//API
app.get('/companies', (req, res) => {
  GoogleApi.getCompanyUrls(req.query.companies).then((urls) => {
    let rtn = {
      data: urls,
      length: urls.length
    }

    res.type('json');
    res.send(rtn);
  }).catch(err => console.log(err));
});

app.listen(PORT, () => {
  console.log(`===> 🚀  Server is now running on port ${PORT}`);
});
