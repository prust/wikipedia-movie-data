let fs = require('fs');
let promisify = require('util').promisify;
let request = require('request');
request = promisify(request);
let cheerio = require('cheerio');
let $ = cheerio;

let genre_replacements = JSON.parse(fs.readFileSync('genre-replacements.json'));

// lowercase-to-proper-case whitelist
let whitelist = {};
JSON.parse(fs.readFileSync('genres.json')).forEach(function(genre) {
  whitelist[genre.toLowerCase()] = genre;
});

let years = [];
for (let year = 2020; year <= 2023; year++)
  years.push(year);

invalid_genres = {};

main();

async function main() {
  let movies = [];
  for (let year of years) {
    movies = movies.concat(await scrapeMoviesForYear(year));
  }

  for (let movie of movies) {
    await timeout(50);
    let res = await request(`https://en.wikipedia.org/api/rest_v1/page/summary/${movie.href}`);
    if (res.statusCode == 404) {
      continue;
    }

    if (res.statusCode != 200) {
      throw new Error('wikipedia returned an error response: ' + res.statusCode);
    }

    let summary_data = JSON.parse(res.body);
    movie.extract = summary_data.extract;
    if (summary_data.thumbnail) {
      movie.thumbnail = summary_data.thumbnail.source;
      movie.thumbnail_width = summary_data.thumbnail.width;
      movie.thumbnail_height = summary_data.thumbnail.height;
    }

    console.log(`${movie.title}: "${movie.extract.split('.')[0]}"`);
  }

  fs.writeFileSync('movies.json', JSON.stringify(movies, null, 2), { encoding: 'utf8' });
}

async function scrapeMoviesForYear(year) {
  // setTimeout() so wikipedia doesn't hate us for slamming their servers
  await timeout(1000);
  console.log('loading movies from ' + year);
  
  let url = 'https://en.wikipedia.org/wiki/List_of_American_films_of_' + year;

  let res = await request(url);//, function(err, res, body) {
  if (res.statusCode != 200)
    throw new Error('wikipedia returned an error response: ' + res.statusCode);
  let body = res.body;

  let $ = cheerio.load(body);
  let tables = $('table.wikitable');
  if (!tables.length) {
    console.log(body);
    throw new Error('Did not find a table w/ class "wikitable" in Wikipedia\'s response');
  }

  let movies = [];
  tables.each(function(ix, table) {
    let rows = $(table).find('tr');

    // skip 'Top-grossing Films' tables (heading row includes "Gross")
    if ($(rows[0]).text().toLowerCase().includes('gross'))
      return;
    
    // 2003 has **both** an alphabetical full-year table and an opening-date season/quarter tables
    // skip the first (full-year) table to avoid dupes
    if (year == 2003 && $(rows[0]).text().toLowerCase().includes('opening')) {
      return;
    }

    rows.each(function(ix, el) {
      // the first row just has headings
      if (ix == 0)
        return;

      let cells = $(el).find('td');
      let title_cell = $(cells[0]);
      if (isDateCell(title_cell))
        title_cell = $(cells[1]);
      if (isDateCell(title_cell))
        title_cell = $(cells[2]);
      if (isDateCell(title_cell))
        throw new Error('Unexpected: a 3 cells in a row with rowspans');

      // often there are empty rows with just rowspans
      // perhaps leftover from when there was an anticipated release in that month
      if (!title_cell.text().trim())
        return;

      title_cell.find('.sortkey').remove();

      let cast_cell = title_cell.next().next();
      let genre_cell = cast_cell.next();

      let href = title_cell.find('a').attr('href');
      
      // action=edit are placeholders for wikipedia pages not yet created; screen them out
      if (href && href.includes('action=edit')) {
        href = null;
      }
      else if (href) { // these are normal links, clean them up
        assert(href.includes('/wiki/'), `Expected "${href}" to include "/wiki/"`);
        href = href.replace('/wiki/', '');
      }
      
      let movie_data = {
        title: title_cell.text().trim(),
        year: year,
        cast: toArray(cast_cell),
        genres: cleanGenres(toArray(genre_cell), year),
        href: href
      };
      console.log(`${movie_data.year} ${movie_data.genres.join(',')} (${movie_data.cast.join(', ')}) "${movie_data.title}"`)
      movies.push(movie_data);
    });
  });

  return movies;
}

function isDateCell(cell) {
  return cell.attr('rowspan') ||
    (cell.attr('style') && cell.attr('style').indexOf('center') > -1) ||
    (cell.attr('align') && cell.attr('align').indexOf('center') > -1);
}

function cleanGenres(genres, year) {
  let cleaned_genres = [];
  
  genres.forEach(function(genre) {
    genre = genre.toLowerCase();

    if (whitelist[genre])
      cleaned_genres.push(whitelist[genre]);
    else if (genre_replacements[genre]) {
      cleaned_genres = cleaned_genres.concat(genre_replacements[genre]);
    }
    else {
      let genres = genre.split(/ |-|–|\/|\./);
      if (genres.length > 1) {
        cleaned_genres = cleaned_genres.concat(cleanGenres(genres, year));
      }
      else {
        if (!invalid_genres[genre]) {
          invalid_genres[genre] = true;
        }
      }
    }
  });

  return cleaned_genres;
}

function toArray(cell) {
  let arr = [];

  if (!cell)
    return arr;

  cell.contents().each(function(ix, el) {
    let text = $(el).text().trim();
    let text_parts = text.split(/\n|,|;|\//);
    text_parts.forEach(function(text, ix) {
      text = text.trim();
      if (!text)
        return;

      if (text == 'Jr.')
        arr[arr.length - 1] += ', Jr.';
      else if (text == '-')
        return;
      // don't include directors or screenwriters (it gets complicated
      // to parse the different ways they're listed; they're always at the top of the list)
      else if (text.indexOf('director') > -1 || text.indexOf('screenplay') > -1)
        arr = [];
      else
        arr.push(text);
    });
  });

  return arr;
}

function assert(val, msg) {
  if (!val) {
    throw new Error(msg || 'Assertion failed');
  }
}

async function timeout(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}
