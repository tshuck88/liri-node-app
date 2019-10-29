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

        //console.log(JSON.stringify(data, null, 2)); 

    });
}

songSearch(searchInput)