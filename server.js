const express = require('express');
const path = require('path');
const GoogleApi = require('./google-api');

const stringify = require('json-stringify-safe');

//Set up express
const app = express();
const PORT = process.env.PORT || 5000;

//Currently, development will be set to true unless it recognizes the DYNO environment variable which is set on Heroku
const isDevelopment = process.env.DYNO ? false : true;
const serverUrl = isDevelopment ? 'https://young-river-54256.herokuapp.com/companies' : `http://localhost:${PORT}/companies`;

if (isDevelopment) {
  let cors = require('cors');
  app.use(cors());
}

//Set up static paths
app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) => { 
  res.render(path.join(__dirname, 'build/index.html'), (err, html) => {
    res.send(html.replace('__SERVER_URL__', serverUrl));
  });
});

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
