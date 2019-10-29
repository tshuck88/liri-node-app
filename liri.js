require("dotenv").config();
const keys = require("./key.js");
const axios = require('axios');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);
const moment = require('moment');
moment().format();

const command = process.argv[2].toLowerCase();
const searchInput = process.argv.slice(2).join(" ");
const divider = "============================="

function songSearch(song) {
    spotify.search({ type: 'track', query: song, limit: "1" }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        const artistName = [];
        const returnedArtists = data.tracks.items[0].artists;

        //console.log(JSON.stringify(data, null, 2)); 
        for (let i = 0; i < returnedArtists.length; i++) {
             artistName.push(returnedArtists[i].name);
        }
        console.log(divider);
        console.log("Artist(s): " + artistName.join(", "));
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("Preview URL: " + data.tracks.items[0].preview_url);
        console.log(divider);
    });
}

songSearch(searchInput)