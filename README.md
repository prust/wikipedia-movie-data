# Movie Data

JSON data on American movies scraped from Wikipedia.

`movies.json` contains a list of 1900-2018 movies from Wikipedia in convenient form: an array of objects, each representing a movie, with a `title` string, `year` integer, a `cast` array and a `genres` array -- each representing the text content of those respective columns in the Wikipedia tables:

```javascript
[
  // ...
  {
    "title": "Avengers: Age of Ultron",
    "year": 2015,
    "cast": [
      "Robert Downey, Jr.",
      "Chris Evans",
      "Chris Hemsworth",
      "Mark Ruffalo"
    ],
    "genres": [
      "Action"
    ]
  },
  // ...
  {
    "title": "The Avengers",
    "year": 2012,
    "cast": [
      "Robert Downey, Jr.",
      "Chris Evans",
      "Mark Ruffalo",
      "Chris Hemsworth",
      "Scarlett Johansson",
      "Jeremy Renner",
      "Tom Hiddleston",
      "Clark Gregg",
      "Cobie Smulders",
      "Stellan Skarsgård",
      "Samuel L. Jackson"
    ],
    "genres": [
      "Superhero"
    ]
  },
  // ...
]
```

## Motivation

I was frustrated at the lack of decent, public movie data APIs (IMDB doesn't offer an API, Netflix removed their API, Rotten Tomatoes' API requires an approval process, etc). The [OMDb API](http://www.omdbapi.com/) probably has cleaner, better data, but you have to donate to get a static dump of their database (but they have a nice RESTful API service that's free). That said, Wikipedia has halfway decent data on American movies and it's not too much data to scrape and put in a static JSON file.

## Genre Cleanup

This effort includes a good deal of work to clean up Wikipedia's messy & inconsistent genres, thanks to some initial work by @stacytao. You can view and edit the metadata that drives this cleanup in the files `genres.json` and `genre-replacements.json`.

## Known Issues

With some of the older years (early 1900s) some of the data isn't populated, so there are a lot of `null` values.

Note that there may be errors in the Wikipedia's data. For instance in 2016 I noticed that one film is duplicated (perhaps because the release date changed). If you write a script that detects or removes duplicates, please let me know.

One particularly striking absence is "Star Wars: The Force Awakens". There is a long chunk of notes about it in the 2015 List but the film itself isn't listed in the December section of the table.

## Scraping Wikipedia and adding to the JSON file

If you would like to re-run the scraping routine, it is contained in `index.js` and can be run via `npm start` after loading the dependencies via `npm install`. Towards the top of the file you'll see a loop that sets which years to scrape data for, this can be adjusted to a smaller set of years in order to more quickly test particular data points or to restrict the data collected.
