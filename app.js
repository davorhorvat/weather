const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  const city = req.body.cityName;
  const apiKey = "71381dce4152da821896a7aea4b21828"
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=metric";

  https.get(url, function(response) {
    console.log(response.statusCode);

    if (response.statusCode === 200) {
      response.on("data", function(data) {
        const weatherData = JSON.parse(data);
        const date = new Date().toDateString();
        const temp = Math.round(weatherData.main.temp);
        const description = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imgUrl = "http://openweathermap.org/img/wn/" + icon + "@4x.png";

        res.send(`<link rel="stylesheet" type="text/css" href="styles.css">
        <div class="widget">
         <div class="left-panel panel">
          <div class="date">${date}</div>
          <div class="city">${city}</div>
          <div class="temp">${temp}&deg;</div>
         </div>
         <div class="right-panel panel">
          <div class="description">${description}</div>
          <div><img src=${imgUrl}></div>
         </div>
        </div>`);
      });
    } else {
      res.send(`<link rel="stylesheet" type="text/css" href="styles.css">
          <h1>SORRY, THERE WAS A ERROR ${response.statusCode}!</h1>
          <p>Please, try again and pay attention to spelling.</p>`);
    }
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});
