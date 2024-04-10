const weather = require('weather-js');
const expect  = import('chai').then(e => {return e.expect}).then(
    weather.find({search: 'San Fransisco, 94102', degreeType: 'C'}, function(err, result) {
      if(err) console.log(err);
      console.log(JSON.stringify(result, null, 2));
    })
);
console.log(expect)
// Options:
// search:     location name or zipcode
// degreeType: F or C
 