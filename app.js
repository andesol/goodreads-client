require('dotenv').config();
const xml2js = require('xml2js');
const fetch = require('node-fetch');
const express = require('express');
const querystring = require('querystring');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/api', async (req, res) => {
  try {
    const qs = querystring.stringify({
      key: process.env.KEY,
      v: process.env.VERSION,
      per_page: process.env.PER_PAGE,
      shelf: process.env.SHELF,
    });

    const response = await fetch(
      `https://www.goodreads.com/review/list/${process.env.USER}.xml?${qs}`
    );

    const data = await response.text();
    if (data.errors && data.errors.length > 0) {
      return res.status(400).json({
        message: 'Not found',
      });
    }
    const booksArr = [];
    xml2js.parseString(data, (err, result) => {
      res.json(result);
      const books = result.GoodreadsResponse.reviews[0].review;

      books.forEach(book =>
        booksArr.push({
          title: book.book[0].title[0],
          author: book.book[0].authors[0].author[0].name[0],
          image: book.book[0].image_url[0],
          rating: book.book[0].average_rating[0],
          description: book.book[0].description[0],
        })
      );
      res.json(booksArr);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Server error',
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
