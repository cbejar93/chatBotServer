const express = require('express')
var unirest = require("unirest");
const fetch = require('node-fetch');
const  bodyParser = require("body-parser");
const mongoose = require('mongoose');
const movieController = require('./movieController');


const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGODB_URI || "mongodb://movieAdmin:malikcarlos2017@ds253388.mlab.com:53388/moviedb", {useNewUrlParser: true, useUnifiedTopology: true,});

const db = mongoose.connection;

db.once('open', function() {
    console.log('connected to db');
  });

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
    extended: false
  }));


let tmdbAuth = "04fcae961b5a92d99e1d7f8e2df78e58"
let v4 = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNGZjYWU5NjFiNWE5MmQ5OWUxZDdmOGUyZGY3OGU1OCIsInN1YiI6IjVlYTMxNTRhNmQxYmIyMDAyNGEyOTgzYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lchzr8N64CaMTv3ZQSM0_HRAYDp1gHks-hgbsWbHIjg"
async function getGenreId(genreType, platform) {
    let foundit = ''
    let genreId;
    const data = await fetch('https://api.themoviedb.org/3/genre/movie/list?api_key=04fcae961b5a92d99e1d7f8e2df78e58&language=en-US', {
        headers: { 'Authorization': 'Bearer ' + v4 },
    })
    let response = await data.json();
    response.genres.forEach(genre => {
        if (genre.name === genreType) {
            genreId = genre.id;
        }
    })

    foundit = await getApiTmdb(genreId, platform, 1, genreType);

    // .then(res => res.json())
    // .then(json => {
    //     json.genres.forEach(genre => {
    //         if (genre.name === genreType) {
    //             genreId = genre.id;
    //         }
    //     });
    //     foundit = await getApiTmdb(genreId, platform,  1);
    // });

    return foundit;
}

async function getApiTmdb(id, platform, page, genre) {
    let foundMovie = ''

    const data = await fetch(`https://api.themoviedb.org/3/discover/movie?language=en-US&sort_by=popularity.desc&include_adult=true&include_video=false&page=${page}&with_genres=${id}`, {
        headers: { 'Authorization': 'Bearer ' + v4 },
    })

    let json = await data.json();
  

    foundMovie = await findAmovieInStreaming(json['results']);
    console.log('after the await one method above the recursion.')
    
    for(let i = 0; i< foundMovie.length;i++){
        
        if(foundMovie[i][0]){
        if(foundMovie[i][0].locations){
            let matched = foundMovie[i][0].locations.some(service=>{
                    // console.log(service.display_name)
                return service.display_name === platform;
            })

            if(matched){
                        console.log('sending api');
                        console.log(foundMovie[i][0].name);
                        let overView
                        // console.log(movie[0].overview)
                        let overViewTitle =json['results'].some(firstApi=>{
                            overView = firstApi.overview;
                            return firstApi.title === foundMovie[i][0].name
                               
                        })
                    if(overViewTitle){
                       foundMovie = {
                            "messages":[
                                {"text": foundMovie[i][0].name},
                                {"text": overView}

                            ]
                        }

                        return foundMovie
                    }
            }
        }
    }

    }

    console.log('failed to find a movie with external API');
    console.log(genre);
    console.log(platform);

    let mongoPlat;

    if(platform ==='AmazonInstantVideo'){
        mongoPlat = 'Amazon'
    }else{
        
        mongoPlat = platform;
    }
    
    console.log('about to find movie in mongo')
    const movieMongo = await movieController.findByPlatformAndGenre(genre.toLowerCase(),mongoPlat);

    let randNum = Math.floor(Math.random() * Math.floor(movieMongo.length));
    foundMovie = {'messages': [{'text': movieMongo[randNum].movieName},{'text': movieMongo[randNum].movieRecap}]}

    console.log(`the length of the movie array is ${movieMongo.length}`);
    console.log(`the randNum is ${randNum}`);

    console.log(foundMovie);

    return foundMovie;
}


function findAmovieInStreaming(movieArray) {

   movieArray = shuffle(movieArray);

    let promises = [];
    for (let i = 0; i < movieArray.length; i++) {

    //   console.log( `${movieArray[i].title} movie is tagged with index ${i}`)
        promises.push(new Promise(function (resolve, reject) {
            promiseFunction({movies: movieArray[i].title}, resolve, reject)
        }))
        
    }
    return Promise.all(promises);

}

async function findMovieStuff(movieArray) {
    let responses = [];
    for (let i = 0; i < movieArray.length; i++) {
        let promise = new Promise(function (resolve, reject) {
            promiseFunction({movies: movieArray[i].title}, resolve, reject)
        });
        responses.push(await promise);
    }
    return responses;
}

function promiseFunction(data, resolve, reject) {

    let req = unirest("GET", "https://utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com/lookup");


    req.query({
        "term": data.movies
    });
    req.headers({
        "x-rapidapi-host": "utelly-tv-shows-and-movies-availability-v1.p.rapidapi.com",
        "x-rapidapi-key": "sgemhbHde1mshMEFw2m16DkiPievp1bcnfrjsnWOuIAAnsXyxH"
    });

    req.end((res) => {
        if (res.error) {
            reject('error while processing.')
        } else {

            resolve(res.body.results);

        }

    });
   
}

const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }

app.get('/getType', asyncMiddleware(async (req, res) => {
    console.log('in the controllor');
    
    const movie = await getGenreId(req.query.genre, req.query.platform);
    // console.log(movie);
    res.send(movie);
}));

app.listen(PORT, () => console.log(`Server at http://localhost:${PORT}`))

