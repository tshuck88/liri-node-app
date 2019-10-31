require("dotenv").config();
const keys = require("./key.js");
const axios = require('axios');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const moment = require('moment');
const fs = require("fs");

let userCommand;
if (process.argv[2] !== undefined) {
    userCommand = process.argv[2].toLowerCase();
}
let searchInput = process.argv.slice(3).join(" ");
const divider = "=============================";

readCommand(userCommand);

function readCommand(command) {
    switch (command) {
        case "spotify-this-song":
            songSearch(searchInput);
            break;
        case "concert-this":
            concertSearch(searchInput);
            break;
        case "movie-this":
            movieSearch(searchInput);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log('Not a recognized command. Try "concert-this", "spotify-this-song", "movie-this", or "do-what-it-says".');
    }
}


function songSearch(song) {
    if (song === "") {
        song = "The Sign Ace of Base";
        console.log("No song was entered. Check out 'The Sign' by Ace of Base.");
    }
    spotify.search({ type: 'track', query: song, limit: "5" }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        for (let i = 0; i < data.tracks.items.length; i++) {
            const artistName = [];
            const returnedArtists = data.tracks.items[i].artists;
            for (let j = 0; j < returnedArtists.length; j++) {
                artistName.push(returnedArtists[j].name);
            }
            console.log(divider);
            console.log("Artist(s): " + artistName.join(", "));
            console.log("Song: " + data.tracks.items[i].name);
            console.log("Album: " + data.tracks.items[i].album.name);
            console.log("Preview URL: " + data.tracks.items[i].preview_url);
            console.log(divider);
        }
    });
}

function concertSearch(artist) {
    if (artist === "") {
        artist = "Diplo";
        console.log("No artist was entered. Here are Diplo's upcoming shows.");
    }
    const queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    axios.get(queryURL).then(
        function (response) {
            for (let i = 0; i < response.data.length; i++) {
                const venue = response.data[i].venue
                console.log(divider);
                console.log(venue.name);
                if (venue.region !== "") {
                    console.log(venue.city + ", " + venue.region);
                    console.log(venue.country);
                } else {
                    console.log(venue.city + ", " + venue.country);
                }
                console.log(moment(response.data[i].datetime).format("MM/DD/YYYY"));
                console.log(divider);
            }
        }).catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function movieSearch(movie) {
    if (movie === "") {
        movie = "Mr. Nobody";
        console.log("No movie was entered. Here are some details about the movie 'Mr. Nobody'.");
    }
    const queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie
    axios.get(queryURL).then(
        function (response) {
            console.log(divider);
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Actors: " + response.data.Actors);
            console.log("Plot: " + response.data.Plot);
            console.log(divider);
        }).catch(function (error) {
            if (error.response) {
                console.log("---------------Data---------------");
                console.log(error.response.data);
                console.log("---------------Status---------------");
                console.log(error.response.status);
                console.log("---------------Status---------------");
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log("Error", error.message);
            }
            console.log(error.config);
        });
}

function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log(error);
        }
        const dataArray = data.toString().split("\r\n").join(",").split(",")
        console.log(dataArray)
        const dataCommand = dataArray[0];
        searchInput = dataArray[1];
        readCommand(dataCommand);
    });
}
