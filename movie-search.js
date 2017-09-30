const rp = require('request-promise');
const cheerio = require("cheerio");
const searchTerm = process.argv.slice(2).join('+');


function queryIMDB(searchTerm) {
  let options = {
    url: `http://www.imdb.com/find?ref_=nv_sr_fn&q=${searchTerm}&s=all`,
    json: true,
    transform: function(body) {
      return cheerio.load(body);
    }
  };
  
  if(!searchTerm) {
    const errorMessage = 'Please provide a term to search on';
    console.log(errorMessage);
    return errorMessage;
  }
  return rp(options)
    .then(($) => {
        const movieTitles = $(".findSection:contains('Titles')")
          .find('.result_text')
          .map((i, elm) => $(elm).text())
          .toArray();
        if(movieTitles.length === 0) {
          let notFoundMsg = `No results found for ${searchTerm}`;
          console.log(notFoundMsg);
          return notFoundMsg;
        }
        movieTitles.forEach((movie) => {
          console.log(movie);
        })
        return movieTitles;
    })
    .catch((error) => {
      console.error(error.message);
    })
}

queryIMDB(searchTerm);

module.exports = { queryIMDB }
