require('dotenv').config();
const rp = require('request-promise');
const xml2js = require('xml2js');
const util = require('util');
const express = require('express');
const app = express();

const options = {
  method: 'GET',
  uri: `https://www.goodreads.com/review/list/${process.env.USER_ID}.xml`,
  qs: {
    key: process.env.KEY,
    v: process.env.VERSION,
    shelf: process.env.SHELF,
    per_page: process.env.PER_PAGE
  }
};

rp(options)
  .then(res => {
    xml2js.parseString(res, (err, result) => {
      const books = result['GoodreadsResponse']['reviews'][0]['review'];
      let titles = [],
        images = [],
        ratings = [];
      books.forEach(book => {
        titles.push(book['book'][0]['title']);
        images.push(book['book'][0]['image_url']);
        ratings.push(book['book'][0]['average_rating']);

        app.get('/', (req, res) => {
          res.send(titles);
        });
      });
    });
  })
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT);
console.log(`Server running on port ${PORT}`);
