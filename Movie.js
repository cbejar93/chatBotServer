const mongoose = require("mongoose");
const { Schema } = mongoose;

const movieSchema = new Schema ({
    _id: {type: Schema.ObjectId, auto: true},
    movieName: {type: String, required: true },
    movieRecap: {type: String, required: true},
    genre: {type: String, required:true },
    platform:  {type: String, required:true },
    original: {type: String, required:true }
   
});

const Movie = mongoose.model('movieCollection', movieSchema, 'movieCollection');

module.exports = Movie;