const express = require('express');
const paths = require('path');
const bcrypt = require('bcrypt');
const userCollection = require('./src/db');
const https = require("https");
const axios = require("axios");
const app = express();
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 3000;

app.set('view engine', 'ejs');

// Set the title
app.locals.title = 'Booking of Aviatickets';

app.get("/", function(req, res) {
    res.redirect("/login");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/signup", function(req, res) {
    res.render("signup"); 
});

//Sign up
app.post("/signup", async function(req, res) {
    try {
        const data = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
        };

        //If Exist
        const existingUser = await userCollection.findOne({username: req.body.username});
        if(existingUser){
            console.log(existingUser)
            res.send("USER IS ALREADY EXIST!!!!!")
        }else{
            const userData = await userCollection.insertMany([data]);
            console.log(userData)
            res.status(201).send("User created successfully");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});


// Login
app.post("/login", async function(req, res) {
    try{
        const user = await userCollection.findOne({username: req.body.username, password: req.body.password});
            if(!user){
            res.send("Invalid Password of Username");
        }else{
                if (user.username === "Merei" && user.password === "12345") {
                    res.render("admin");
                } else {
                    res.render("user");
                }
        }
    }catch(error){
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

//Delete user by email

app.post("/admin", async function(req, res) {
    try {
        const userEmail = req.body.email; 
        const existingUser = await userCollection.findOne({ email: userEmail });
        
        if (existingUser) {
            await userCollection.deleteOne({ email: userEmail });
            console.log(req.body);
            res.send(`User with email ${userEmail} deleted successfully`);
        } else {
            res.send("User not found");
            console.log(existingUser);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

app.get("/weather", function (req, res) {
    const query = req.query.city;
    const weatherApikey = '77ba1b0352a68853b36f756b55a16c2b';
    const weatherUnit = "metric";

    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${weatherApikey}&units=${weatherUnit}`;

    https.get(weatherUrl, function (weatherResponse) {
        console.log(weatherResponse.statusCode);

        let weatherData = '';

        weatherResponse.on("data", function (weatherChunk) {
            weatherData += weatherChunk;
        });

        weatherResponse.on("end", function () {
            const weatherInfo = JSON.parse(weatherData);
            console.log(weatherInfo);

            const temp = weatherInfo.main.temp;
            const feelsLike = weatherInfo.main.feels_like;
            const weatherDescription = weatherInfo.weather[0].description;
            const icon = weatherInfo.weather[0].icon;
            const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            const humidity = weatherInfo.main.humidity;
            const pressure = weatherInfo.main.pressure;
            const windSpeed = weatherInfo.wind.speed;
            const countryCode = weatherInfo.sys.country;

            // Extracting coordinates from the response
            const coordinates = {
                lat: weatherInfo.coord.lat,
                lon: weatherInfo.coord.lon
            };

            const rainVolume = weatherInfo.rain ? weatherInfo.rain["3h"] || 0 : 0;

            res.send(`
                <h2>Temperature: ${temp}°C</h2>
                <p>Feels like: ${feelsLike}°C</p>
                <p>The weather is currently ${weatherDescription}.</p>
                <img src="${imageURL}" alt="Weather Icon">
                <p>Coordinates: ${coordinates.lat}, ${coordinates.lon}</p>
                <p>Humidity: ${humidity}%</p>
                <p>Pressure: ${pressure} hPa</p>
                <p>Wind Speed: ${windSpeed} m/s</p>
                <p>Country Code: ${countryCode}</p>
                <p>Rain Volume (last 3 hours): ${rainVolume} mm</p>
            `);
        });

    });
});

app.get("/cityinfo", async function (req, res) {
    const cityName = req.query.city;
    const opencageApikey = '7b66bd9799e04aa9854baa18a85bbcae';  

    const opencageUrl = `https://api.opencagedata.com/geocode/v1/json?q=${cityName}&key=${opencageApikey}&limit=1`;

    try {
        const response = await axios.get(opencageUrl);
        const cityInfo = response.data.results[0];

        if (cityInfo) {
            const cityFullName = cityInfo.formatted;
            const cityCountry = cityInfo.components.country;

            res.send(`
                <h2>City Information</h2>
                <p>City Name: ${cityFullName}</p>
                <p>Country: ${cityCountry}</p>
            `);
        } else {
            res.send(`<p>No information found for the specified city.</p>`);
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

app.get("/quotes", async function (req, res) {
    try {
        const response = await axios.get('https://api.quotable.io/random');
        const quote = response.data.content;
        const author = response.data.author;
  
        res.send(`
            <h2>Random Quote</h2>
            <blockquote>
                <p>${quote}</p>
                <footer>${author}</footer>
            </blockquote>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  });
  async function randomQuote() {
      const response = await fetch('https://api.quotable.io/random');
      const quote = await response.json();
      return quote;
  }






  

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
