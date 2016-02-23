# Movie Data

JSON data on American movies scraped from Wikipedia.

`movies.json` contains all the data from Wikipedia in convenient form: an array of objects, each representing a movie, with a `title` string, `year` integer, a `director` string, a `cast` string, a `genre` string and a `notes` string -- each representing the text content of those respective columns in the Wikipedia tables:

```javascript
[
  // ...
  {
    "title": "Avengers: Age of Ultron",
    "year": 2015,
    "director": "Joss Whedon",
    "cast": "Robert Downey, Jr., Chris Evans, Chris Hemsworth, Mark Ruffalo",
    "genre": "Action",
    "notes": "Walt Disney, Sequel to The Avengers (2012), Based on the comics of the same name by Stan Lee and Jack Kirby"
  },
  // ...
  {
    "title": "Avengers, The Avengers",
    "year": 2012,
    "director": "Joss Whedon",
    "cast": "Robert Downey, Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Jeremy Renner, Tom Hiddleston, Clark Gregg, Cobie Smulders, Stellan Skarsgård, Samuel L. Jackson",
    "genre": "Superhero",
    "notes": "Walt Disney Pictures, Marvel Studios, Based on the comic book of the same name by Stan Lee and Jack Kirby"
  }
  // ...
]
```

## Motivation

I was frustrated at the lack of decent, public movie data APIs (IMDB doesn't offer an API, Netflix removed their API, Rotten Tomatoes' API requires an approval process, etc). The [OMDb API](http://www.omdbapi.com/) probably has cleaner, better data, but you have to donate to get a static dump of their database (but they have a nice RESTful API service that's free). That said, Wikipedia has halfway decent data on American movies and it's not too much data to scrape and put in a static JSON file.

## Known Issues

With a lot of the older movies (early 1900s) much of the data isn't populated, so there are a lot of `null` values.

Note that there may be errors in the Wikipedia's data. For instance in 2016 I noticed that one film is duplicated (perhaps because the release date changed). If someone writes a script that takes this JSON file and detects duplicates or removes duplicates, please let me know and I'll link to it here (as a separate project / repository).

One particularly striking absence is "Star Wars: The Force Awakens". There is a long chunk of notes about in the 2015 List but the film itself isn't listed in the December section of the table.

Genres are pretty messy in the data as well. A lot of times two genres are included in a single string with a hyphen, such as "Action-Comedy". Other times you have (as in the JSON example above) one movie categorized as "Superhero" and another as "Action", even though they are sequels and really should be in the same genre.

## Future Directions

The goal of this JSON file (and the script that generates it) is to capture the data in Wikipedia as faithfully as possible. Any pull requests to that end (either improving the JSON or the script) will be much appreciated.

However, corrections to the data itself will not be accepted: these should instead be made at the source (in Wikipedia) or in a separate cleanup script, which would be a different library that builds on this one.

Similarly, logic that consolidates or condenses genres, looks for or resolves duplicates, etc, will not be accepted into this library but will gladly be linked to as separate projects that build on this one.

## Scraping Wikipedia and adding to the JSON file

If you would like to re-run the scraping routine, it is contained in `index.js` and can be run via `npm start` after loading the dependencies via `npm install`. Towards the top of the file you'll see a loop that sets which years to scrape data for, this can be adjusted to a smaller set of years in order to more quickly test particular data points or to restrict the data collected.
