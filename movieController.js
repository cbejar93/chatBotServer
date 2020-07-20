const movie = require('./Movie');


module.exports = {
    findByPlatformAndGenre: async function(id, platform){
        
        const moviesResult = await movie.find()
        .where('genre').equals(id)
        .where('platform').equals(platform);
        return moviesResult;
    },

    variableLenghtQuery: async function(genre, platform, original ){
        let query = movie.find();

        if(genre){
            query.where('genre', genre);
        }
        if(platform){
            query.where('platform', platform);
        }
        if(original){
            query.where('original',original)
        }

        return await query.exec();

    },

    multipleStreamingServices: async function(id, platforms){
      const arrayResults = await  movie.find({platform: {$in: platforms}}).where('genre').equals(id);
      return arrayResults;
    },

    submitNewMovie: async function(form){
            const errors = {};

            console.log('in the validators.');
            console.log(form)

            if(!form.movieName){
                errors.movieName = "Movie Name is required."
            }


            if(!form.platform){
                errors.platform = 'A platform is required.'
            }

            if(!form.genre){
                errors.genre = 'A genre is required.'
            }

            if(!form.movieRecap){
                errors.movieRecap = 'A movie recap is required.'
            }

            if(!form.original){
                errors.original = 'Choose if it is an original.'
            }

            if(Object.keys(errors).length > 0){
                console.log('error was found.')
                return errors;
            }

            return {status: 'success'}
    }
}
