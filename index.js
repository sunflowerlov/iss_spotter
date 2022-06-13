
 const { nextISSTimesForMyLocation } = require('./iss');

//  fetchMyIP((error, ip) => {
//    if (error) {
//      console.log("It didn't work!" , error);
//      return;
//    }
 
//    console.log('It worked! Returned IP:' , ip);
//  });



// fetchCoordsByIP('104.171.50.69', (abc, {latitude, longitude}) => {
//   console.log({'latitude': latitude, 'longitude': longitude});
// })

// fetchISSFlyOverTimes({latitude: '43.87316131591797', longitude: '-79.2615966796875'}, (error, data) => {
//   if (error) {
//     console.log("It didn't work!", error);
//     return;
//   }
//   console.log(data)
// })

const printPassTimes = function(passTimes) {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const duration = pass.duration;
    console.log(`Next pass at ${datetime} for ${duration} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }
  // success, print out the deets!
  printPassTimes(passTimes);
});