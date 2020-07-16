const movie = require('./Movie');


module.exports = {
    findByPlatformAndGenre: async function(id, platform){
        
        const moviesResult = await movie.find()
        .where('genre').equals(id)
        .where('platform').equals(platform);
       return moviesResult;
    }
}
