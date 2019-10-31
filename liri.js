// grabs and stores required dependencies
require("dotenv").config();
const keys = require("./key.js");
const axios = require('axios');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const moment = require('moment');
const fs = require("fs");

// toLowerCase returns an error if userCommand is undefined. Adding this logic allows default case of switch statement to run if userCommand is undefined
let userCommand;
if (process.argv[2] !== undefined) {
    userCommand = process.argv[2].toLowerCase();
}
let searchInput = process.argv.slice(3).join(" ");
const divider = "=============================";

// writes the userCommand and searchInput to log.txt
const text = userCommand + " " + searchInput + "\n";
fs.appendFileSync("log.txt", text, function (err) {
    if (err) {
        logText(err);
    } else {
        logText("Content logged to log.txt");
    }
});

// function to log outputs to the console and log.txt
function logText(message) {
    console.log(message)
    fs.appendFileSync("log.txt", message + "\n", function (err) {
        if (err) {
            console.log(err);
        }
    });
}

readCommand(userCommand, searchInput);

// function that will run the apporopriate search based on the user's command
function readCommand(command, search) {
    switch (command) {
        case "spotify-this-song":
            songSearch(search);
            break;
        case "concert-this":
            concertSearch(search);
            break;
        case "movie-this":
            movieSearch(search);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            logText(divider);
            logText('Not a recognized command. Try "concert-this", "spotify-this-song", "movie-this", or "do-what-it-says".');
            logText(divider);
    }
}

// function to search the Spotify API
function songSearch(song) {
    if (song === "") {
        song = "The Sign Ace of Base";
        logText(divider);
        logText("No song was entered. Check out 'The Sign' by Ace of Base:");
        logText(divider);
    }
    spotify.search({ type: 'track', query: song, limit: "1" }, function (err, data) {
        if (err) {
            return logText('Error occurred: ' + err);
        } else if (data.tracks.total === 0) {
            logText(divider);
            logText("No song was found. Please check grammatical errors or enter a different song.");
            logText(divider);
        }
        for (let i = 0; i < data.tracks.items.length; i++) {
            const artistName = [];
            const returnedArtists = data.tracks.items[i].artists;
            for (let j = 0; j < returnedArtists.length; j++) {
                artistName.push(returnedArtists[j].name);
            }
            logText(divider);
            logText("Artist(s): " + artistName.join(", "));
            logText("Song: " + data.tracks.items[i].name);
            logText("Album: " + data.tracks.items[i].album.name);
            logText("Preview URL: " + data.tracks.items[i].preview_url);
            logText(divider);
        }
    });
}

// function to search the Bands In Town API
function concertSearch(artist) {
    if (artist === "") {
        artist = "Diplo";
        logText(divider);
        logText("No artist was entered. Here are Diplo's upcoming shows:");
        logText(divider);
    }
    const queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp"
    axios.get(queryURL).then(
        function (response) {
            if (response.data.length === 0) {
                logText(divider);
                logText("No events were found. Please check grammatical errors or enter a different artist.");
                logText(divider);
            }
            for (let i = 0; i < response.data.length; i++) {
                const venue = response.data[i].venue
                logText(divider);
                logText(venue.name);
                if (venue.region !== "") {
                    logText(venue.city + ", " + venue.region);
                    logText(venue.country);
                } else {
                    logText(venue.city + ", " + venue.country);
                }
                logText(moment(response.data[i].datetime).format("MM/DD/YYYY"));
                logText(divider);
            }
        }).catch(function (error) {
            if (error.response) {
                logText("---------------Data---------------");
                logText(error.response.data);
                logText("---------------Status---------------");
                logText(error.response.status);
                logText("---------------Status---------------");
                logText(error.response.headers);
            } else if (error.request) {
                logText(error.request);
            } else {
                logText("Error", error.message);
            }
            logText(error.config);
        });
}

// function to search the OMDB API
function movieSearch(movie) {
    if (movie === "") {
        movie = "Mr. Nobody";
        logText(divider);
        logText("No movie was entered. Here are some details about the movie 'Mr. Nobody':");
        logText(divider);
    }
    const queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + movie
    axios.get(queryURL).then(
        function (response) {
            if (response.data.Response === "False") {
                logText(divider);
                logText("No movie was found. Please check grammatical errors or enter a different movie.");
                logText(divider);
            } else {
                logText(divider);
                logText("Title: " + response.data.Title);
                logText("Year: " + response.data.Year);
                logText("IMDB Rating: " + response.data.imdbRating);
                logText("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
                logText("Country: " + response.data.Country);
                logText("Language: " + response.data.Language);
                logText("Actors: " + response.data.Actors);
                logText("Plot: " + response.data.Plot);
                logText(divider);
            }
        }).catch(function (error) {
            if (error.response) {
                logText("---------------Data---------------");
                logText(error.response.data);
                logText("---------------Status---------------");
                logText(error.response.status);
                logText("---------------Status---------------");
                logText(error.response.headers);
            } else if (error.request) {
                logText(error.request);
            } else {
                logText("Error", error.message);
            }
            logText(error.config);
        });
}

// function that reads the random.txt file and returns search results based on the content of the file
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            logText(error);
        }
        const dataArray = data.toString().split("\r\n").join(",").split(","); // puts content of random.txt into an array
        for (let i = 0, j = 1; i < dataArray.length; i += 2, j += 2) { // for loop with a command iterator and a search iterator 
            let formattedCommand = dataArray[i].trim(); // stores and formats the command iterator
            let formattedSearch = dataArray[j].replace(/"/g, "").trim(); // stores and formats the search iterator. uses regex to replace all double quotes ("). this was causing an issue with bandsintown api
            readCommand(formattedCommand, formattedSearch); // runs the readCommand function for each pair of iterators
        }
    });
}

