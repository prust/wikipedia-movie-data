var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var $ = cheerio;
var async = require('async');

var invalid_genres = JSON.parse(fs.readFileSync('invalid-genres.json'));
var genre_replacements = JSON.parse(fs.readFileSync('genre-replacements.json'));

var years = [];
for (var year = 1930; year <= 2018; year++)
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
    console.log('loading movies from ' + year);
    
    var url;
    if (year == 2018)
      url = 'https://en.wikipedia.org/wiki/2018_in_film';
    else
      url = 'https://en.wikipedia.org/wiki/List_of_American_films_of_' + year;

    request(url, function(err, res, body) {
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

          // skip the next cell which is Director for 2016 & earlier
          // but is Studios for 2017 & later
          var cast_cell = title_cell.next().next();
          var genre_cell = cast_cell.next();
          if (year == 2018) {
            var country_cell = genre_cell.next();

            // filter to just US films, like the other years
            if (country_cell.text().indexOf('US') == -1)
              return;
          }
          
          var movie_data = {
            title: title_cell.text().trim(),
            year: year,
            cast: toArray(cast_cell),
            genres: cleanGenres(toArray(genre_cell))
          };
          movies.push(movie_data);
        });
      });

      callback(null, movies);
    });
  }, 1000);
}

function cleanGenres(genres) {
  var cleaned_genres = [];
  
  genres.forEach(function(genre) {
    if (invalid_genres.indexOf(genre) > -1)
      return;
    if (genre_replacements[genre])
      cleaned_genres = cleaned_genres.concat(genre_replacements[genre]);
    else
      cleaned_genres.push(genre);
  });

  return cleaned_genres;
}

function toArray(cell) {
  var arr = [];

  if (!cell)
    return arr;

  cell.contents().each(function(ix, el) {
    var text = $(el).text().trim();
    var text_parts = text.split(/\n|,|;|\//);
    text_parts.forEach(function(text, ix) {
      text = text.trim();
      if (!text)
        return;

      if (text == 'Jr.')
        arr[arr.length - 1] += ', Jr.';
      else if (text == '(director)')
        arr[arr.length - 1] += ' (director)';
      else if (text == '(screenplay)')
        arr[arr.length - 1] += ' (screenplay)';
      else if (text == '(director' && text_parts[ix + 1] == 'screenplay)')
        arr[arr.length - 1] += ' (director, screenplay)';
      else if (text.endsWith(' (director') && text_parts[ix + 1] == 'screenplay)')
        arr.push(text + ', screenplay)');
      else if (text == 'screenplay)')
        return; // this was handled by the previous iteration
      else
        arr.push(text);
    });
  });

  return arr;
}
