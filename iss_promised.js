const request = require('request-promise-native');
/*
 * Requests user's ip address from https://www.ipify.org/
 * Input: None
 * Returns: Promise of request for ip data, returned as JSON string
 */
const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(body) {
  const ip = JSON.parse(body).ip;
  return request(`https://api.ipbase.com/v2/info?apikey=hsIgobTVBBxSmfhkeGm3vKujTDy4ZnUJu5zg01do&ip=${ip}`);
};

const fetchISSFlyOverTimes = function(body) {
  const { data } = JSON.parse(body);
  const { latitude, longitude } = data.location;
  const coords = { latitude: latitude, longitude: longitude };
  return request(`https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`)
}



const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchISSFlyOverTimes)
    .then((data) => {
      const { response } = JSON.parse(data);
      return response;
    });
};

module.exports = { nextISSTimesForMyLocation };
