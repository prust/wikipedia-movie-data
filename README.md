# Movie Data

JSON data on American movies scraped from Wikipedia.

`movies.json` contains a list of 1970-2023 movies from Wikipedia in convenient form: an array of objects, each representing a movie, with a `title` string, `year` integer, a `cast` array and a `genres` array -- each representing the text content of those respective columns in the Wikipedia tables:

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
    description: "2015 Marvel Studios film",
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
    description: "Marvel Studios film",
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

There is also a short `description`, a longer `extract` and a `thumbnail` URL and dimensions. This data was pulled from a separate summary API.

## Motivation

I was frustrated at the lack of decent, public movie data APIs (IMDB doesn't offer an API, Netflix removed their API, Rotten Tomatoes' API requires an approval process, etc). The [OMDb API](http://www.omdbapi.com/) probably has cleaner, better data, but you have to donate to get a static dump of their database (but they have a nice RESTful API service that's free). That said, Wikipedia has halfway decent data on American movies and it's not too much data to scrape and put in a static JSON file.

## Genre Cleanup

This effort includes a good deal of work to clean up Wikipedia's messy & inconsistent genres, thanks to some initial work by @stacytao. You can view and edit the metadata that drives this cleanup in the files `genres.json` and `genre-replacements.json`.

## Known Issues

Recently wikipedia removed the genre column from its movie tables, so the genres are now retrieved from parsing the `extract` (which is retrieved via a separate summary API endpoint). The genre parsing isn't as clean as it could be; help in this area would be most welcome.

With some of the older years (early 1900s) some of the data isn't populated, so there are a lot of `null` values.

For instance in 2016 I noticed that one film is duplicated (perhaps because the release date changed). If you write a script that detects or removes duplicates, please let me know.

## Scraping Wikipedia and adding to the JSON file

If you would like to re-run the scraping routine, it is contained in `index.js` and can be run via `npm start` after loading the dependencies via `npm install`. Towards the top of the file you'll see a loop that sets which years to scrape data for, this can be adjusted to a smaller set of years in order to more quickly test particular data points or to restrict the data collected.
