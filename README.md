# Movie Data

JSON data on American movies scraped from Wikipedia:

```javascript
[
  // ...
  {
    "title": "Avengers: Age of Ultron",
    "year": 2015,
    "director": ["Joss Whedon"],
    "cast":["Robert Downey, Jr.","Chris Evans","Chris Hemsworth","Mark Ruffalo"],
    "genre":["Action"],
    "notes":["Walt Disney","Sequel to The Avengers (2012)","Based on the comics of the same name by Stan Lee and Jack Kirby"]
  },
  // ...
  {
    "title": "Avengers, The Avengers",
    "year": 2012,
    "director": ["Joss Whedon"],
    "cast": ["Robert Downey, Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson, Jeremy Renner, Tom Hiddleston, Clark Gregg, Cobie Smulders, Stellan Skarsgård, Samuel L. Jackson"],
    "genre": ["Superhero"],
    "notes": ["Walt Disney Pictures, Marvel Studios","Based on the comic book of the same name by Stan Lee and Jack Kirby"]
  }
  // ...
]
```

I got frustrated at the lack of decent, public movie data APIs (IMDB doesn't offer an API, Netflix removed their API, Rotten Tomatoes' API requires an approval process, etc) and then realized that Wikipedia had a decent listing of American movies and that it's not really that much data, so I could scrape it and easily put it into JSON form.

The `movies.json` file contains all the data from Wikipedia in convenient form: an array of objects, each representing a movie, with a `title` string, `year` integer, a `director` array, a `cast` array, a `genre` array and a `notes` array -- each representing the text content of those respective columns in the Wikipedia tables. 

## Known Issues

With a lot of the older movies (early 1900s) much of the data isn't populated. I should fix it so it has an empty array if there is no data for a particular property, but at the moment an empty table cell is represented in the JSON by an array with an empty string.

Note that there may be errors in the Wikipedia's data. For instance in 2016 I noticed that one film is duplicated (perhaps because the release date changed). I'd like to create a script that checks for duplicates, but I haven't done that yet (pull requests welcome).

One particularly striking absence is "Star Wars: The Force Awakens". There is a long chunk of notes about in the 2015 List but the film itself isn't listed in the December section of the table.

Genres are pretty messy in the data as well. A lot of times two genres are included in a single string with a hyphen, such as "Action-Comedy". Other times you have (as in the JSON example above) a "Superhero" genre and an "Action" genre for two movies that are sequels and should be in the same genre.

My script doesn't handle multiple titles very well: it assumes there is one title and if there are two listed in Wikipedia they will be shoved together. In the example above, I manually cleaned up "Avengers, TheThe Avengers" to just "Avengers, The Avengers", but really it should have been parsed into a list of "Avengers, The" and "The Avengers".

## Future Directions

I would like to change the script to interpret `title` as an array, so that it captures the "Avengers, The" and "The Avengers" double title instance mentioned above. The idea being that the script scrapes Wikipedia's data as accurately and faithfully as possible.

I would like to introduce a second script that "cleans up" (sometimes subjectively) the data in the first JSON file and saves the result in a second JSON file. This would consolidate all films to a single title and would consolidate the genres down to a smaller, more manageable set of genres with their own ascending integer IDs and introduce integer IDs for the movies as well.

The next step would be to separate out the people (directors and cast) into their own table and assign them IDs as well.

A final step would be to separate out the companies mentioned in the notes into their own table and assign them IDs and set these to a `companies` property and remove the notes field.

This should result in a more compact, useful JSON file, probably arranged something like this:

```javascript
{
  "movies": [ /* ... */ ],
  "genres": [ /* ... */ ],
  "people": [ /* ... */ ],
  "companies": [ /* ... */ ]
}
```

## Using the JSON file

You can use the `movies.json` JSON file directly from Node or the browser or most other programming languages.

## Scraping Wikipedia and adding to the JSON file

If you would like to re-run the scraping routine, it is contained in `index.js` and can be run via `npm start` after loading the dependencies via `npm install`. Towards the top of the file you'll see a loop that sets which years to scrape data for, currently it is set at 1900-1910. If you want to scrape the most recent data, you might change it to 2016-2017 or something similar. The script naively appends to the JSON file, so it will create duplicates of any movies already in the JSON file.
