
const request = require("request");

const fetchMyIP = function (callback) {
  return request(
    `https://api.ipify.org?format=json`,
    (error, response, body) => {
      if (error) {
        callback(error, null);
        return;
      }
      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(msg, null);
        return;
      }
      const ip = JSON.parse(body).ip;
      callback(null, ip);
    }
  );
};

const fetchCoordsByIP = function (ip, callback) {
  return request(`https://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }
 
    const data = JSON.parse(body)

    if (!data.success) {
      const message = `Success status was ${data.success}. Server message says: ${data.message} when fetching for IP ${data.ip}`;
      callback(Error(message), null);
      return
    }

    
    const { latitude, longitude } = data
    callback(null, { latitude, longitude } )
  });
};

const fetchISSFlyOverTimes = function (coords, callback) {
  return request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, 
  (error, response, body) => {

    if (error) {
      callback(error, null)
    }


    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null)
      return
    }

    const parse = JSON.parse(body)
    callback(null, parse)

  })
}

const nextISSTimesForMyLocation = function (callback) {
  fetchMyIP ((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP (ip, (error, loc) => {
      if (error) {
        return callback(error, null)
      }

      fetchISSFlyOverTimes (loc, (error, nextPass) => {
        if (error) {
          return callback(error, null)
        }
         callback(null, nextPass)
      })
    })
  })
}
module.exports = { nextISSTimesForMyLocation };
