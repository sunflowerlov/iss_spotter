/**
 * Makes a single API request to retrieve the user's IP address.
 * Input:
 *   - A callback (to pass back an error or the IP string)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The IP address as a string (null if error). Example: "162.245.144.188"
 */
const request = require("request");

const fetchMyIP = function (callback) {
  return request(
    `https://api.ipify.org?format=json`,
    (error, response, body) => {
      // console.log("error:", error); // Print the error if one occurred
      // console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      // console.log("body:", body.length);

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
   return request(
     `https://api.ipbase.com/v2/info?apikey=hsIgobTVBBxSmfhkeGm3vKujTDy4ZnUJu5zg01do&ip=${ip}`,
     (error, response, body) => {
       // console.log('error:', error); // Print the error if one occurred
       // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
       // console.log("body:", body['data']);
       if (error) {
         callback(error, null);
         return;
       }

       if (response.statusCode !== 200) {
         const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
         callback(msg, null);
         return;
       }

       const { data } = JSON.parse(body);
       // console.log(data)
       const { latitude, longitude } = data.location;
       const coords = { latitude: latitude, longitude: longitude };
       callback(null, { latitude, longitude });
       // console.log(latitude, longitude)
     }
   );
 };



/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function (coords, callback) {
  return request(
    `https://iss-pass.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`,
    (error, response, body) => {
      // console.log("error:", error); // Print the error if one occurred
      // console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      // console.log("body:", body);

      if (error) {
        callback(error, null);
        return;
      }

      if (response.statusCode !== 200) {
        const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
        callback(msg, null);
        return;
      }

      const data = JSON.parse(body).response;

      callback(null, data);
    }
  );
};


/**
 * Orchestrates multiple API requests in order to determine the next 5 upcoming ISS fly overs 
 * for the user's current location.
 * Input:
 *   - A callback with an error or results. 
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly-over times as an array (null if error):
 *     [ { risetime: <number>, duration: <number> }, ... ]
 */ 
 const nextISSTimesForMyLocation = function(callback) {
  fetchMyIP((error, ip) => {
    if (error) {
      return callback(error, null);
    }

    fetchCoordsByIP(ip, (error, loc) => {
      if (error) {
        return callback(error, null);
      }

      fetchISSFlyOverTimes(loc, (error, nextPasses) => {
        if (error) {
          return callback(error, null);
        }

        callback(null, nextPasses);
      });
    });
  });
};

module.exports = { nextISSTimesForMyLocation };

// const abc = {
//   data: {
//     timezone: {
//       id: "America/Toronto",
//       current_time: "2022-06-13T15:22:17-04:00",
//       code: "EDT",
//       is_daylight_saving: true,
//       gmt_offset: -14400,
//     },
//     ip: "104.171.50.69",
//     type: "v4",
//     connection: {
//       asn: 54614,
//       organization: "CIKTELECOM-CABLE",
//       isp: "Cik Telecom Inc",
//     },
//     location: {
//       geonames_id: 6066513,
//       latitude: 43.87316131591797,
//       longitude: -79.2615966796875,
//       zip: "L3P 1A1",
//       continent: {
//         code: "NA",
//         name: "North America",
//         name_translated: "North America",
//       },
//       country: {
//         alpha2: "CA",
//         alpha3: "CAN",
//         calling_codes: ["+1"],
//         currencies: [
//           {
//             symbol: "CA$",
//             name: "Canadian Dollar",
//             symbol_native: "$",
//             decimal_digits: 2,
//             rounding: 0,
//             code: "CAD",
//             name_plural: "Canadian dollars",
//           },
//         ],
//         emoji: "🇨🇦",
//         ioc: "CAN",
//         languages: [
//           { name: "English", name_native: "English" },
//           { name: "French", name_native: "Français" },
//         ],
//         name: "Canada",
//         name_translated: "Canada",
//         timezones: [
//           "America/St_Johns",
//           "America/Halifax",
//           "America/Glace_Bay",
//           "America/Moncton",
//           "America/Goose_Bay",
//           "America/Blanc-Sablon",
//           "America/Toronto",
//           "America/Nipigon",
//           "America/Thunder_Bay",
//           "America/Iqaluit",
//           "America/Pangnirtung",
//           "America/Atikokan",
//           "America/Winnipeg",
//           "America/Rainy_River",
//           "America/Resolute",
//           "America/Rankin_Inlet",
//           "America/Regina",
//           "America/Swift_Current",
//           "America/Edmonton",
//           "America/Cambridge_Bay",
//           "America/Yellowknife",
//           "America/Inuvik",
//           "America/Creston",
//           "America/Dawson_Creek",
//           "America/Fort_Nelson",
//           "America/Vancouver",
//           "America/Whitehorse",
//           "America/Dawson",
//         ],
//         is_in_european_union: false,
//       },
//       city: { name: "Markham", name_translated: "Markham" },
//       region: {
//         fips: "CA-08",
//         alpha2: "CA-ON",
//         name: "Ontario",
//         name_translated: "Ontario",
//       },
//     },
//   },
// };
