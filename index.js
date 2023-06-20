// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

const moment = require('moment');
require('moment-timezone');



// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


//Endpoint to fetch current time if no arguments are passed to the API
app.get('/api/', (req, res)=>{

  let currentTime = Date.now();
  let currentTimeObj = new Date(currentTime);
  let fulldate = currentTimeObj.toString();
  const timestamp = currentTimeObj.getTime();
  const format = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)';
  const convertedDate = moment(fulldate, format).utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');

  res.json({"unix": timestamp, "utc": convertedDate});

});

//Endpoint to fetch uxix format and UTC format if arguments are passed as well as throw error JSON if passed date arguments are ivalid.
app.get('/api/:date?', (req, res)=>{
  const dateString = req.params['date'];
  console.log(dateString, "-", typeof(dateString));

  // Below is the block to process if the date is in milliseconds format
  if (/\d{5,}/.test(dateString)) {
  const milleSecondsFormat = parseInt(dateString); // date string is converted to int so that Date() can be able to parse the time milliseconds in number format instead of it being in string format
  const date_obj = new Date(milleSecondsFormat); // Date() does not seem to be able to parse milliseconds when passed as a string - solved with some help
  let fulldate = date_obj.toString();
  
  const format = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)';
  const convertedDate = moment(fulldate, format).utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');
  
  res.json({"unix": milleSecondsFormat, "utc": convertedDate});
  return;
  }
  
  // Below is the block of code to process if the date is in YYYY-MM-DD format as well as to throw an error if any other unrecognized format is passed as an argument
  const date_obj = new Date(dateString);
  if (date_obj.toString() === "Invalid Date"){
  res.json({"error": "Invalid Date"});
  return
  }
  else {
  let fulldate = date_obj.toString();
  const format = 'ddd MMM DD YYYY HH:mm:ss [GMT]ZZ (z)';
  const convertedDate = moment(fulldate, format).utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]');

  res.json({'unix': date_obj.getTime(), 'utc': convertedDate});
  return;
  }
  
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
