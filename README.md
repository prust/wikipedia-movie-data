# Movie Data

JSON data on American movies scraped from Wikipedia.

`movies.json` contains a list of 1900-2023 movies from Wikipedia in convenient form: an array of objects, each representing a movie, with a `title`, `year`, `extract`, `thumbnail`, `cast` (array), and `genres` (array):

```javascript
[
  // ...
  {
    title: "Avengers: Age of Ultron",
    year: 2015,
    cast: [
      "Robert Downey Jr.",
      "Chris Hemsworth",
      "Mark Ruffalo",
      "Chris Evans",
      "Scarlett Johansson",
      "Jeremy Renner",
      "Don Cheadle",
      "Aaron Taylor-Johnson",
      "Elizabeth Olsen",
      "Paul Bettany",
      "Cobie Smulders",
      "Anthony Mackie",
      "Hayley Atwell",
      "Idris Elba",
      "Stellan Skarsgård",
      "James Spader",
      "Samuel L. Jackson",
    ],
    genres: ["Superhero"],
    href: "Avengers:_Age_of_Ultron",
    extract:
      "Avengers: Age of Ultron is a 2015 American superhero film based on the Marvel Comics superhero team the Avengers. Produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures, it is the sequel to The Avengers (2012) and the 11th film in the Marvel Cinematic Universe (MCU). Written and directed by Joss Whedon, the film features an ensemble cast including Robert Downey Jr., Chris Hemsworth, Mark Ruffalo, Chris Evans, Scarlett Johansson, Jeremy Renner, Don Cheadle, Aaron Taylor-Johnson, Elizabeth Olsen, Paul Bettany, Cobie Smulders, Anthony Mackie, Hayley Atwell, Idris Elba, Linda Cardellini, Stellan Skarsgård, James Spader, and Samuel L. Jackson. In the film, the Avengers fight Ultron (Spader)—an artificial intelligence created by Tony Stark (Downey) and Bruce Banner (Ruffalo) who plans to bring about world peace by causing human extinction.",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/en/f/ff/Avengers_Age_of_Ultron_poster.jpg",
    thumbnail_width: 220,
    thumbnail_height: 326,
  },
  // ...
  {
    title: "The Avengers",
    year: 2012,
    cast: [
      "Robert Downey Jr.",
      "Chris Evans",
      "Chris Hemsworth",
      "Mark Ruffalo",
      "Jeremy Renner",
      "Scarlett Johansson",
      "Tom Hiddleston",
      "Samuel L. Jackson",
      "Stellan Skarsgård",
      "Cobie Smulders",
      "Clark Gregg",
      "Gwyneth Paltrow",
      "Maximiliano Hernández",
      "Paul Bettany",
      "Alexis Denisof",
      "Damion Poitier",
      "Powers Boothe",
      "Jenny Agutter",
      "Stan Lee",
      "Harry Dean Stanton",
      "Jerzy Skolimowski",
      "Warren Kole",
      "Enver Gjokaj",
    ],
    genres: ["Superhero"],
    href: "The_Avengers_(2012_film)",
    extract:
      "Marvel's The Avengers, or simply The Avengers, is a 2012 American superhero film based on the Marvel Comics superhero team of the same name. Produced by Marvel Studios and distributed by Walt Disney Studios Motion Pictures, it is the sixth film in the Marvel Cinematic Universe (MCU). Written and directed by Joss Whedon, the film features an ensemble cast including Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, and Jeremy Renner as the Avengers, alongside Tom Hiddleston, Stellan Skarsgård, and Samuel L. Jackson. In the film, Nick Fury and the spy agency S.H.I.E.L.D. recruit Tony Stark, Steve Rogers, Bruce Banner, Thor, Natasha Romanoff, and Clint Barton to form a team capable of stopping Thor's brother Loki from subjugating Earth.",
    thumbnail:
      "https://upload.wikimedia.org/wikipedia/en/8/8a/The_Avengers_%282012_film%29_poster.jpg",
    thumbnail_width: 220,
    thumbnail_height: 326,
  },
  // ...
];
```

The same data is also split into separate decade files (`movies-1990s.json`, `movies-2000s.json`, `movies-2010s.json`, etc) for convenience.

Most properties were scraped from the respective columns in the Wikipedia movie tables (for example https://en.wikipedia.org/wiki/List_of_American_films_of_2023), however the `extract` and the thumbnail URL/dimensions were pulled from a separate `/summary` API for each movie individually.

## Motivation

I was frustrated at the lack of decent, public movie data APIs (IMDB doesn't offer an API, Netflix removed their API, Rotten Tomatoes' API requires an approval process, etc). The [OMDb API](http://www.omdbapi.com/) probably has cleaner, better data, but you have to donate to get a static dump of their database (but they have a nice RESTful API service that's free). That said, Wikipedia has decent data on American movies and it's not too much data to scrape and put in a static JSON file.

## Genre Cleanup

This effort includes a good deal of work to clean up Wikipedia's messy & inconsistent genres, thanks to some initial work by @stacytao. You can view and edit the metadata that drives this cleanup in the files `genres.json` and `genre-replacements.json`.

At some point around 2020 wikipedia removed the genre column from the movie tables in recent years, so this script now retrieves additional data from each movie via a `/summary` API endpoint, including the `extract` property, which it then parses to supplement the genre data.

## Known Issues

With some of the older years (early 1900s) some of the data isn't populated, which results in a lot of `null` values.

## Scraping Wikipedia and adding to the JSON file

If you would like to re-run the scraping routine, it is contained in `index.js` and can be run via `npm start` after loading the dependencies via `npm install`. Towards the top of the file you'll see a loop that sets which years to scrape data for, this can be adjusted to a smaller set of years in order to more quickly test particular data points or to restrict the data collected.
