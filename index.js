var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var years = [];
for (var year = 1900; year < 2017; year++)
  years.push(year);

async.mapSeries(years, scrapeMoviesForYear, function(err, results) {
  var movies = [];
  results.forEach(function(movies_for_year) {
    movies = movies.concat(movies_for_year);
  });

  var complete_movie_list = []; // JSON.parse(fs.readFileSync('movies.json')); // read in the JSON file if you want to append to it
  complete_movie_list = complete_movie_list.concat(movies);
  fs.writeFileSync('movies.json', JSON.stringify(complete_movie_list), {encoding: 'utf8'});
});

function scrapeMoviesForYear(year, callback) {
  // setTimeout() so wikipedia doesn't hate us for slamming their servers
  setTimeout(function() {
    request('https://en.wikipedia.org/wiki/List_of_American_films_of_' + year, function(err, res, body) {
      if (err)
        throw err;
      if (res.statusCode != 200)
        throw new Error('wikipedia returned an error response: ' + res.statusCode);

      var $ = cheerio.load(body);
      var tables = $('table.wikitable');
      if (!tables.length) {
        console.log(body);
        throw new Error('Did not find a table w/ class "wikitable" in Wikipedia\'s response');
      }

      var movies = [];
      tables.each(function(ix, table) {
        var rows = $(table).find('tr');
        rows.each(function(ix, el) {
          // the first row just has headings
          if (ix == 0)
            return;

          var cells = $(el).find('td');
          var title_cell = $(cells[0]);
          if (title_cell.attr('rowspan'))
            title_cell = $(cells[1]);
          if (title_cell.attr('rowspan'))
            title_cell = $(cells[2]);
          if (title_cell.attr('rowspan'))
            throw new Error('Unexpected: a 3 cells in a row with rowspans');

          // often there are empty rows with just rowspans
          // perhaps leftover from when there was an anticipated release in that month
          if (!title_cell.text().trim())
            return;

          title_cell.find('.sortkey').remove();
          var director_cell = title_cell.next();
          var cast_cell = director_cell.next();
          var genre_cell = cast_cell.next();
          var notes_cell = genre_cell.next();
          
          var movie_data = {
            title: title_cell.text(),
            year: year,
            director: toCommaDelimitedList(director_cell),
            cast: toCommaDelimitedList(cast_cell),
            genre: toCommaDelimitedList(genre_cell),
            notes: toCommaDelimitedList(notes_cell)
          };
          movies.push(movie_data);

          var m = movie_data;
          console.log(m.title + ':', m.director, m.cast, m.genre, m.notes);
        });
      });

      callback(null, movies);
    });
  }, 1000);
}

function toCommaDelimitedList(cell) {
  var text = cell.text().trim();
  if (text)
    return text.split('\n').join(', ');
  else
    return null;
}
